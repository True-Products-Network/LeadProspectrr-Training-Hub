'use client';

import { useState, useEffect } from 'react';
import { googleCalendarAPI } from '@/lib/googleCalendar';
import { Task } from '@/lib/types';
import { 
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleCalendarConnectProps {
  onEventsLoaded: (tasks: Task[]) => void;
  onError: (error: string) => void;
}

export function GoogleCalendarConnect({ onEventsLoaded, onError }: GoogleCalendarConnectProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    googleCalendarAPI.initialize().then((success) => {
      setIsInitialized(success);
      setIsSignedIn(googleCalendarAPI.isSignedIn());
    });
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const success = await googleCalendarAPI.signIn();
      setIsSignedIn(success);
      if (success) {
        await fetchEvents();
      }
    } catch (err) {
      onError('Failed to sign in to Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    googleCalendarAPI.signOut();
    setIsSignedIn(false);
    setLastSync(null);
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const tasks = await googleCalendarAPI.fetchTodayEvents();
      onEventsLoaded(tasks);
      setLastSync(new Date());
    } catch (err) {
      onError('Failed to fetch calendar events');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-200">Initializing...</h3>
            <p className="text-xs text-slate-500">Loading Google Calendar API</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">Connect Google Calendar</h3>
            <p className="text-sm text-slate-400 mb-4">
              Sync your calendar events to see them in your Focus Calendar. 
              Your notifications will still come from Google Calendar.
            </p>
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                "bg-blue-500 text-white hover:bg-blue-600",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              {isLoading ? 'Connecting...' : 'Connect Calendar'}
            </button>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            You'll need to create Google Cloud credentials to use this feature. 
            See the README for setup instructions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-200">Google Calendar Connected</h3>
            {lastSync && (
              <p className="text-xs text-slate-500">
                Last synced: {lastSync.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEvents}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white transition-all"
            title="Refresh events"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-white transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 animate-slide-in">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Disconnect Calendar
          </button>
        </div>
      )}
    </div>
  );
}