import { Task, TaskCategory } from './types';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// Type for Google Calendar event (simplified)
interface GoogleCalendarEvent {
  id?: string;
  summary?: string;
  description?: string;
  colorId?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
}

// Map Google Calendar event colors to our categories
function guessCategoryFromEvent(event: GoogleCalendarEvent): TaskCategory {
  const summary = (event.summary || '').toLowerCase();
  const description = (event.description || '').toLowerCase();
  const colorId = event.colorId;
  const text = summary + ' ' + description;
  
  // DEEP WORK - focused productive work
  if (text.includes('focus') || text.includes('deep work') || text.includes('coding') || 
      text.includes('programming') || text.includes('development') || text.includes('dev') ||
      text.includes('build') || text.includes('project') || text.includes('implement') ||
      text.includes('debug') || text.includes('deploy') || text.includes('ship')) {
    return 'deep-work';
  }
  
  // MEETINGS - collaborative/synchronous time
  if (text.includes('meeting') || text.includes('meet up') || text.includes('meetup') || 
      text.includes('call') || text.includes('sync') || text.includes('standup') || 
      text.includes('stand-up') || text.includes('1:1') || text.includes('1-to-1') || 
      text.includes('interview') || text.includes('review') || text.includes('discussion') ||
      text.includes('catch up') || text.includes('catchup') || text.includes('zoom') ||
      text.includes('teams') || text.includes('conference') || text.includes('demo') ||
      text.includes('presentation') || text.includes('client') || text.includes('sales')) {
    return 'meetings';
  }
  
  // LEARNING - skill building
  if (text.includes('learn') || text.includes('course') || text.includes('study') || 
      text.includes('read') || text.includes('training') || text.includes('clinic') || 
      text.includes('workshop') || text.includes('webinar') || text.includes('tutorial') ||
      text.includes('research') || text.includes('explore') || text.includes('onboarding') ||
      text.includes('certification') || text.includes('lesson')) {
    return 'learning';
  }
  
  // CREATIVE - design/content creation
  if (text.includes('design') || text.includes('creative') || text.includes('write') || 
      text.includes('draft') || text.includes('content') || text.includes('video') ||
      text.includes('photo') || text.includes('edit') || text.includes('produce') ||
      text.includes('brainstorm') || text.includes('mockup') || text.includes('prototype')) {
    return 'creative';
  }
  
  // EXERCISE - physical activity
  if (text.includes('gym') || text.includes('workout') || text.includes('run') || 
      text.includes('exercise') || text.includes('walk') || text.includes('yoga') ||
      text.includes('swim') || text.includes('cycle') || text.includes('sport') ||
      text.includes('fitness') || text.includes('training') || text.includes('hike')) {
    return 'exercise';
  }
  
  // ADMIN - overhead tasks
  if (text.includes('email') || text.includes('admin') || text.includes('expense') || 
      text.includes('invoice') || text.includes('billing') || text.includes('timesheet') ||
      text.includes('report') || text.includes('paperwork') || text.includes('hr') ||
      text.includes('expenses') || text.includes('accounting') || text.includes('tax') ||
      text.includes('compliance') || text.includes('audit')) {
    return 'admin';
  }
  
  // PERSONAL - life stuff
  if (text.includes('lunch') || text.includes('break') || text.includes('personal') ||
      text.includes('dentist') || text.includes('doctor') || text.includes('appointment') ||
      text.includes('errand') || text.includes('bank') || text.includes('shopping') ||
      text.includes('family') || text.includes('kids') || text.includes('school') ||
      text.includes('vacation') || text.includes('holiday') || text.includes('pto') ||
      text.includes('sick') || text.includes('travel')) {
    return 'personal';
  }
  
  // Check Google Calendar color IDs
  // 1: Lavender, 2: Sage, 3: Grape, 4: Flamingo, 5: Banana, 6: Tangerine, 7: Peacock, 8: Graphite, 9: Blueberry, 10: Basil, 11: Tomato
  switch (colorId) {
    case '1': // Lavender - meetings
      return 'meetings';
    case '2': // Sage - exercise
      return 'exercise';
    case '3': // Grape - creative
      return 'creative';
    case '4': // Flamingo - personal
      return 'personal';
    case '5': // Banana - admin
      return 'admin';
    case '6': // Tangerine - learning
      return 'learning';
    case '7': // Peacock - deep work
      return 'deep-work';
    case '9': // Blueberry - deep work
      return 'deep-work';
    case '10': // Basil - exercise
      return 'exercise';
    case '11': // Tomato - meetings/critical
      return 'meetings';
    default:
      // Default to deep-work for work hours, personal for off-hours
      return 'deep-work';
  }
}

function guessPriorityFromEvent(event: GoogleCalendarEvent): 'low' | 'medium' | 'high' | 'critical' {
  const summary = (event.summary || '').toLowerCase();
  
  if (summary.includes('urgent') || summary.includes('critical') || summary.includes('deadline') || summary.includes('important')) {
    return 'critical';
  }
  if (summary.includes('focus') || summary.includes('deep') || event.colorId === '11') {
    return 'high';
  }
  if (summary.includes('optional') || summary.includes('maybe')) {
    return 'low';
  }
  
  return 'medium';
}

export function convertGoogleEventToTask(event: GoogleCalendarEvent): Task {
  const start = event.start?.dateTime || event.start?.date || '';
  const end = event.end?.dateTime || event.end?.date || '';
  
  // Parse times
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  // Check if it's an all-day event
  const isAllDay = !event.start?.dateTime;
  
  return {
    id: event.id || `gcal-${Date.now()}`,
    title: event.summary || 'Untitled Event',
    category: guessCategoryFromEvent(event),
    priority: guessPriorityFromEvent(event),
    startTime: isAllDay ? '00:00' : formatTime(startDate),
    endTime: isAllDay ? '23:59' : formatTime(endDate),
    completed: false,
    notes: event.description || undefined,
  };
}

// Type declarations for Google APIs
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

// Google Calendar API wrapper
export class GoogleCalendarAPI {
  private tokenClient: any = null;
  private gapiInited = false;
  private gsiInited = false;
  private accessToken: string | null = null;

  async initialize(): Promise<boolean> {
    if (this.gapiInited && this.gsiInited) return true;
    
    return new Promise((resolve) => {
      // Load GAPI script
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.async = true;
      gapiScript.defer = true;
      gapiScript.onload = () => {
        window.gapi.load('client', async () => {
          await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          this.gapiInited = true;
          this.checkInit(resolve);
        });
      };
      document.head.appendChild(gapiScript);

      // Load GSI script
      const gsiScript = document.createElement('script');
      gsiScript.src = 'https://accounts.google.com/gsi/client';
      gsiScript.async = true;
      gsiScript.defer = true;
      gsiScript.onload = () => {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse: { access_token?: string }) => {
            if (tokenResponse.access_token) {
              this.accessToken = tokenResponse.access_token;
              window.gapi.client.setToken(tokenResponse);
            }
          },
        });
        this.gsiInited = true;
        this.checkInit(resolve);
      };
      document.head.appendChild(gsiScript);
    });
  }

  private checkInit(resolve: (value: boolean) => void) {
    if (this.gapiInited && this.gsiInited) {
      resolve(true);
    }
  }

  async signIn(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.tokenClient) {
        resolve(false);
        return;
      }
      
      this.tokenClient.callback = (tokenResponse: { access_token?: string }) => {
        if (tokenResponse.access_token) {
          this.accessToken = tokenResponse.access_token;
          window.gapi.client.setToken(tokenResponse);
          resolve(true);
        } else {
          resolve(false);
        }
      };
      
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  signOut() {
    if (this.accessToken) {
      window.google.accounts.oauth2.revoke(this.accessToken, () => {
        this.accessToken = null;
        window.gapi.client.setToken(null);
      });
    }
  }

  isSignedIn(): boolean {
    return !!this.accessToken;
  }

  async fetchTodayEvents(): Promise<Task[]> {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = await window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = (response.result.items || []) as GoogleCalendarEvent[];
    return events.map(convertGoogleEventToTask);
  }

  async fetchCalendars(): Promise<{ id: string; summary: string }[]> {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in');
    }

    const response = await window.gapi.client.calendar.calendarList.list();
    return (response.result.items || []).map((cal: { id?: string; summary?: string }) => ({
      id: cal.id || '',
      summary: cal.summary || '',
    }));
  }
}

export const googleCalendarAPI = new GoogleCalendarAPI();

