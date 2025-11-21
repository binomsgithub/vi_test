# Voice Intelligence Analytics Dashboard

A full-stack voice intelligence analytics application built with React, TypeScript, and Node.js.

## Project Structure

```
conv_now_new_app/
├── backend/          # Express API server
│   ├── data/        # CSV data files
│   └── server.js    # Express server
└── frontend/         # React + Vite application
    └── src/         # React source code
```

## Getting Started

### Local Development

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:3001`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` and proxy API requests to the backend.

### Production Build

To build for production:

```bash
# From the root directory
npm run build
```

This will:
1. Build the frontend React app
2. Copy the built files to `backend/client-build/`

To start the production server:

```bash
# From the root directory
npm start
```

The server will serve both the API and the React app on the configured PORT.

## Deployment to Render.com

### Prerequisites

1. Push your code to a GitHub repository
2. Have a Render.com account

### Deployment Steps

1. **Connect Repository to Render**:
   - Go to Render dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - Render will auto-detect the `render.yaml` file
   - The service will use the build and start commands from the root `package.json`

3. **Set Environment Variables**:
   - In the Render dashboard, go to Environment variables
   - Add `SESSION_SECRET` with a secure random string (e.g., generate with `openssl rand -hex 32`)
   - `NODE_ENV` is automatically set to `production` by `render.yaml`

4. **Deploy**:
   - Render will automatically:
     - Run `npm install && npm run build`
     - Run `npm start`
     - The app will be available at your Render URL

### Environment Variables

- `NODE_ENV`: Set to `production` automatically
- `PORT`: Set automatically by Render
- `SESSION_SECRET`: **Required** - Set a secure random string in Render dashboard

## Features

- **Overview Page**: High-level summary with volume, efficiency, and quality metrics
- **Journey & Policy Page**: Policy adherence metrics by step of the order flow
- **Sales & Upsell Page**: Upsell and revenue opportunity analytics
- **Friendliness & Sentiment Page**: Friendliness scores and sentiment analysis
- **Alerts & Coaching Page**: Risk alerts and coaching queue management
- **Explore & Compare Page**: Detailed session exploration and segment comparison

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite, React Router, TailwindCSS, Recharts
- **Backend**: Node.js, Express, csv-parse
- **Data**: CSV files with realistic dummy data

## API Endpoints

- `GET /api/filters` - Get filter options
- `GET /api/overview` - Get overview data
- `GET /api/journey-policy` - Get journey and policy data
- `GET /api/sales-upsell` - Get sales and upsell data
- `GET /api/friendliness` - Get friendliness data
- `GET /api/alerts` - Get alerts data
- `GET /api/explore` - Get explore table data
- `GET /api/compare` - Get comparison data

## Deployment

### Quick Deploy to Render.com

See **[QUICK_START.md](./QUICK_START.md)** for step-by-step deployment instructions.

### Detailed Deployment Guide

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for comprehensive deployment documentation.

### Pre-Deployment Checklist

See **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** for a checklist of items to verify before deploying.

