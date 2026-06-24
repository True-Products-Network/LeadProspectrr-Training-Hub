# Focus Calendar

A daily calendar designed to keep you focused and productive. Built with Next.js and Tailwind CSS.

## Features

- **Current Focus Panel** - See what you should be doing right now with live progress tracking
- **Daily Intentions** - Set your main goal and list distractions to avoid
- **Smart Timeline** - Visual schedule with color-coded activity types
- **Progress Stats** - Track completion rates and deep work hours
- **Focus Mode** - Full-screen timer for distraction-free work
- **Google Calendar Integration** - Sync your existing calendar events

## Google Calendar Setup

To use Google Calendar integration, you need to create OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3001` (for development)
     - `https://yourdomain.com` (for production)
   - Copy the Client ID
5. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API key"
   - Restrict the key to Google Calendar API only
6. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   NEXT_PUBLIC_GOOGLE_API_KEY=your-api-key
   ```

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the app.

## Build for Production

```bash
npm run build
```

The static files will be in the `dist/` directory, ready for Vercel or any static host.

## Deploy to Vercel

```bash
vercel --prod
```

Or drag the `dist/` folder to Vercel's dashboard.

## How It Works

1. **Notifications**: Keep coming from Google Calendar on your phone/watch
2. **Focus View**: Open this app to see your day at a glance
3. **Smart Categorization**: Events are auto-categorized based on title keywords and colors
4. **Progress Tracking**: Check off tasks as you complete them
5. **Daily Reset**: Each day starts fresh with new intentions

## Activity Categories

- **Deep Work** (Purple) - Focused, creative work
- **Meetings** (Pink) - Calls and collaborations
- **Admin** (Gray) - Email, paperwork
- **Exercise** (Green) - Physical activity
- **Personal** (Amber) - Life maintenance
- **Learning** (Cyan) - Skill development
- **Creative** (Violet) - Design, writing, art

## Data Storage

- Tasks and progress are stored in your browser's localStorage
- Google Calendar events are fetched fresh each sync
- No data is sent to any server
