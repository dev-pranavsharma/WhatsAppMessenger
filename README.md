# WhatsApp Business Campaign Manager

A SaaS platform for WhatsApp marketing campaigns with embedded client onboarding using React/TypeScript and Facebook Business integration.

## Prerequisites

- Node.js 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm) for version management)
- npm or yarn package manager
- Git

### For Mac Users

1. **Install Node.js**:
   ```bash
   # Using Homebrew (recommended)
   brew install node

   # Or using nvm (Node Version Manager)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **Install Git** (if not already installed):
   ```bash
   brew install git
   ```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd whatsapp-campaign-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Add your environment variables:
   ```env
   # Database (optional - uses in-memory storage by default)
   DATABASE_URL=your_postgresql_connection_string

   # Facebook/WhatsApp API credentials
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push database schema changes (if using PostgreSQL)

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM (in-memory storage for development)
- **UI**: shadcn/ui components + Tailwind CSS
- **State Management**: TanStack Query

### Project Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
├── server/          # Express backend
│   ├── services/
│   └── routes.ts
├── shared/          # Shared TypeScript schemas
└── package.json
```

## Features

- WhatsApp Business account integration via Facebook embedded signup
- Message template creation and management
- Contact management with CSV import/export
- Campaign scheduling and automation
- Real-time message delivery tracking
- Analytics dashboard with engagement metrics

## Development Notes

### Mac-Specific Considerations

1. **Port 5000 Conflict**: If port 5000 is in use (common on newer Macs with AirPlay), the app will automatically find an available port.

2. **File Watching**: The development server uses file watching for hot reload. If you experience issues, try:
   ```bash
   # Increase file watcher limits if needed
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Node.js Memory**: For large projects, you might need to increase Node.js memory:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run dev
   ```

### Database Setup

The app uses in-memory storage by default for development. For production or persistent data:

1. Set up a PostgreSQL database (local or cloud)
2. Add the `DATABASE_URL` to your `.env` file
3. Run migrations: `npm run db:push`

### Facebook/WhatsApp Integration

To use WhatsApp features:

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Enable WhatsApp Business API
3. Add your app credentials to `.env`
4. Configure webhook URLs for production deployment

## Troubleshooting

### Common Issues

1. **tsx not found**: Install TypeScript execution tool:
   ```bash
   npm install -g tsx
   ```

2. **Permission errors**: On Mac, you might need to use sudo for global installs:
   ```bash
   sudo npm install -g tsx
   ```

3. **Port already in use**: Kill the process using the port:
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

4. **Module resolution errors**: Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Deployment

The app is designed for Replit deployment but can be deployed anywhere that supports Node.js:

1. Build the project: `npm run build`
2. Set environment variables in your hosting platform
3. Run: `npm start`

For local production testing:
```bash
npm run build
NODE_ENV=production npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details