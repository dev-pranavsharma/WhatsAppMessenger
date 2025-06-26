# Quick Start Guide for Mac

## Current Status
Your server is running successfully! Now let's get the client working.

## Step 1: Check Your Setup
In your VS Code terminal, run:
```bash
./diagnose-mac.sh
```

## Step 2: Start Your App
If the server isn't already running, start it with:
```bash
PORT=3000 HOST=127.0.0.1 npm run dev
```

## Step 3: Access the App
Open your browser and go to:
- **http://localhost:3000** (if using PORT=3000)
- **http://localhost:5000** (if port 5000 is available)

## Step 4: If You See a Blank Page
1. Open Developer Tools in your browser:
   - **Chrome/Firefox**: Press F12 or Cmd+Option+I
   - **Safari**: Enable Developer Menu first, then Cmd+Option+I

2. Check the **Console** tab for any red error messages

3. Common fixes:
   - **Hard refresh**: Cmd+Shift+R (Mac) or Ctrl+Shift+R
   - **Clear cache**: In DevTools, right-click refresh button → Empty Cache and Hard Reload
   - **Try different browser**: Safari sometimes blocks local scripts

## Step 5: Common Mac Issues

### Browser Compatibility
- **Safari**: May block local JavaScript - try Chrome or Firefox first
- **Chrome**: Best compatibility for development
- **Firefox**: Good alternative to Chrome

### Network Issues
If you get connection errors:
```bash
# Kill any processes on the port
sudo lsof -t -i:3000 | xargs kill -9
sudo lsof -t -i:5000 | xargs kill -9

# Restart with explicit host
PORT=3000 HOST=127.0.0.1 npm run dev
```

### Dependencies Issues
If the client won't load:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Then restart
PORT=3000 HOST=127.0.0.1 npm run dev
```

## What You Should See
When working correctly, you'll see:
- WhatsApp Business Campaign Manager interface
- Sidebar with navigation (Onboarding, Campaigns, Templates, etc.)
- Main content area showing the onboarding page

## Still Having Issues?
1. Run the diagnostic script: `./diagnose-mac.sh`
2. Check the VS Code terminal for any error messages
3. Try accessing the test page: http://localhost:3000/test-client.html
4. Make sure you have Node.js 18+ installed: `node --version`

The app is specifically designed for WhatsApp Business campaign management and should load the onboarding page first to help you connect your WhatsApp Business account.