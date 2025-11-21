# Create GitHub Personal Access Token

GitHub no longer accepts passwords for git operations. You need to create a Personal Access Token.

## Quick Steps:

1. **Go to GitHub Token Settings:**
   https://github.com/settings/tokens

2. **Click:** "Generate new token" → "Generate new token (classic)"

3. **Configure:**
   - **Note:** `vi_app_deployment`
   - **Expiration:** Choose your preference (90 days, 1 year, or no expiration)
   - **Scopes:** Check `repo` (Full control of private repositories)

4. **Click:** "Generate token" at the bottom

5. **IMPORTANT:** Copy the token immediately (it starts with `ghp_`). You won't see it again!

6. **Use the token as your password** when pushing

## After Creating Token:

Run this command and use the token as the password:
```bash
cd /Users/binomullazhikamsugathan/Desktop/conv_now_new_app
git push -u origin main
```

- Username: `binomsgithub`
- Password: **Paste your token** (the `ghp_...` string)

