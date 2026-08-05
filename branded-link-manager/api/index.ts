// Vercel API entry point
// This file serves as the main API handler for Vercel deployment

import '../apps/api/src/index';

// Export the Express app for Vercel
export { app as default } from '../apps/api/src/index';
