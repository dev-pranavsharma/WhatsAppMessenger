# VS Code Setup Guide for Mac

## Quick Setup Steps

### 1. Open the Project in VS Code
```bash
# Navigate to your project folder
cd path/to/whatsapp-campaign-manager

# Open in VS Code
code .
```

### 2. Install Required VS Code Extensions
Install these recommended extensions:
- **TypeScript and JavaScript Language Features** (built-in)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

### 3. Setup Environment
Create your `.env` file:
```bash
# Copy the example file
cp .env.example .env

# Edit with your settings (optional for development)
```

### 4. Install Dependencies
Open VS Code terminal (`Terminal` > `New Terminal`) and run:
```bash
npm install
```

### 5. Handle Port 5000 Conflict (Mac-specific)
Since port 5000 is often used by AirPlay on Mac, you have two options:

**Option A: Use a different port**
```bash
PORT=3000 npm run dev
```

**Option B: Disable AirPlay Receiver**
1. Go to `System Preferences` > `Sharing`
2. Uncheck `AirPlay Receiver`

### 6. Start the Development Server

**Method 1: Using Terminal**
```bash
# For Mac compatibility (recommended)
PORT=3000 HOST=127.0.0.1 npm run dev
```

**Method 2: Quick Start Script**
```bash
./start-mac.sh
```

**Method 2: Using VS Code Tasks**
1. Press `Cmd+Shift+P`
2. Type "Tasks: Run Task"
3. Select "Start Development Server (Port 3000)"

**Method 3: Using VS Code Debugger**
1. Go to the Debug panel (`Cmd+Shift+D`)
2. Select "Start Development Server" configuration
3. Press F5 or click the play button

### 7. Access the Application
- Default: http://localhost:5000
- If using port 3000: http://localhost:3000

## VS Code Features Configured

### Integrated Terminal
- Automatically sets NODE_ENV=development
- Configured for Mac environment

### TypeScript Support
- Full IntelliSense for React and Node.js
- Automatic import organization
- Real-time error checking

### Debugging
- Configured launch configuration for server debugging
- Breakpoint support in TypeScript files

### Tasks
Available tasks (access via `Cmd+Shift+P` > "Tasks: Run Task"):
- Install Dependencies
- Start Development Server
- Start Development Server (Port 3000)
- Build Production
- Type Check

## Troubleshooting

### Port Issues
If you see "Port 5000 is in use":
```bash
# Check what's using the port
lsof -i :5000

# Kill the process if needed
sudo lsof -t -i:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### Node.js Issues
```bash
# Check Node.js version (needs 18+)
node --version

# Install/update Node.js via Homebrew
brew install node

# Or use nvm
nvm install 18
nvm use 18
```

### TypeScript Errors
1. Restart TypeScript language server:
   - `Cmd+Shift+P`
   - Type "TypeScript: Restart TS Server"

### Hot Reload Not Working
1. Make sure you're editing files in the `client/src` directory
2. Check the terminal for any build errors
3. Refresh the browser manually if needed

## Development Workflow

### 1. Frontend Development
- Edit files in `client/src/`
- Changes auto-refresh in browser
- Components are in `client/src/components/`

### 2. Backend Development
- Edit files in `server/`
- Server automatically restarts on changes
- API routes are in `server/routes.ts`

### 3. Database Schema
- Edit `shared/schema.ts` for data models
- Both frontend and backend use these types

### 4. Styling
- Uses Tailwind CSS
- Custom styles in `client/src/index.css`
- Component library: shadcn/ui

## Useful VS Code Shortcuts

- `Cmd+Shift+P`: Command palette
- `Cmd+```: Toggle terminal
- `Cmd+Shift+E`: Explorer panel
- `Cmd+Shift+D`: Debug panel
- `Cmd+Shift+X`: Extensions panel
- `F5`: Start debugging
- `Ctrl+C`: Stop server (in terminal)

## Next Steps

1. Start the development server
2. Open http://localhost:3000 (or 5000)
3. Begin developing your WhatsApp campaign features
4. Check the main README.md for feature documentation

## Need Help?

- Check the main README.md for detailed project information
- Look at the `shared/schema.ts` for data structure
- Examine existing components in `client/src/components/`