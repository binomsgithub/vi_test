#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env.ec2 ]; then
  echo ".env.ec2 not found. Copy .env.ec2.example and edit it."
  exit 1
fi

# shellcheck source=/dev/null
source .env.ec2

if [ -z "${EC2_PUBLIC_DNS:-}" ]; then
  echo "EC2_PUBLIC_DNS not set in .env.ec2"
  exit 1
fi

ROOT_DIR="$(cd ../.. && pwd)"

echo "Deploying backend to $SSH_USERNAME@$EC2_PUBLIC_DNS ..."

ssh -i "$SSH_KEY_PATH" "$SSH_USERNAME@$EC2_PUBLIC_DNS" <<EOF
set -euo pipefail

echo "Updating packages..."
sudo apt-get update -y

if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v git >/dev/null 2>&1; then
  echo "Installing git..."
  sudo apt-get install -y git
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Installing pm2..."
  sudo npm install -g pm2
fi

if [ ! -d "$REMOTE_APP_DIR" ]; then
  echo "Cloning repository..."
  git clone https://github.com/binomsgithub/vi_test.git "$REMOTE_APP_DIR"
else
  echo "Pulling latest changes..."
  cd "$REMOTE_APP_DIR"
  git pull
fi

cd "$REMOTE_APP_DIR"

echo "Installing dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend
npm install

echo "Verifying data files exist..."
if [ ! -d "data" ]; then
  echo "ERROR: backend/data directory not found!"
  exit 1
fi

set +u
DATA_FILES_COUNT=0
if ls data/*.csv >/dev/null 2>&1; then
  DATA_FILES_COUNT=\$(ls -1 data/*.csv 2>/dev/null | wc -l)
fi
set -u

echo "Found \$DATA_FILES_COUNT CSV files in backend/data/"

if [ "\$DATA_FILES_COUNT" -eq 0 ]; then
  echo "WARNING: No CSV files found in backend/data/"
else
  echo "Data files verified:"
  ls -1 data/*.csv 2>/dev/null | head -5 || true
fi

cd ..

echo "Setting environment variables for pm2..."
cat > ecosystem.config.js <<EOC
module.exports = {
  apps: [
    {
      name: "vi-backend",
      cwd: "./backend",
      script: "node",
      args: "server.js",
      env: {
        NODE_ENV: "$BACKEND_NODE_ENV",
        PORT: 3000,
        SESSION_SECRET: "$BACKEND_SESSION_SECRET"
      }
    }
  ]
};
EOC

echo "Starting backend with pm2..."
pm2 delete vi-backend || true
pm2 start ecosystem.config.js
pm2 save

echo "Deployment complete. Backend listening on port 3000."
EOF

echo "Backend deployed to http://$EC2_PUBLIC_DNS:3000"

