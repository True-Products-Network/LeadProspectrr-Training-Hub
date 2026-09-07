import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const redisConnection = new IORedis(process.env.REDIS_QUEUE_URL || 'redis://localhost:6379/1', {
  maxRetriesPerRequest: null,
});

// Queue definitions
export const queues = {
  clicks: new Queue('clicks', { connection: redisConnection }),
  analytics: new Queue('analytics', { connection: redisConnection }),
  healthChecks: new Queue('health-checks', { connection: redisConnection }),
  notifications: new Queue('notifications', { connection: redisConnection }),
  exports: new Queue('exports', { connection: redisConnection }),
};

// Job types
export interface ClickJob {
  linkId: string;
  workspaceId: string;
  domainId: string;
  destinationUrl: string;
  ipHash: string;
  uniqueVisitorKey: string;
  sessionKey: string;
  userAgent?: string;
  referrer?: string;
  countryCode?: string;
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  deviceType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  isQrScan: boolean;
  isBioClick: boolean;
  timestamp: string;
}

export interface HealthCheckJob {
  linkId: string;
  workspaceId: string;
  destinationUrl: string;
}

export interface AnalyticsAggregateJob {
  workspaceId: string;
  date: string;
}

// Add job helpers
export async function addClickJob(data: ClickJob): Promise<Job> {
  return queues.clicks.add('process-click', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}

export async function addHealthCheckJob(data: HealthCheckJob): Promise<Job> {
  return queues.healthChecks.add('check-link', data, {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
  });
}

export async function addAnalyticsAggregateJob(data: AnalyticsAggregateJob): Promise<Job> {
  return queues.analytics.add('aggregate-daily', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
}

// Worker setup (for worker app)
export function createWorkers() {
  // Click processing worker
  const clickWorker = new Worker(
    'clicks',
    async (job: Job<ClickJob>) => {
      console.log('Processing click:', job.id);
      // Actual processing logic in worker app
      return { processed: true };
    },
    { connection: redisConnection }
  );

  // Health check worker
  const healthWorker = new Worker(
    'health-checks',
    async (job: Job<HealthCheckJob>) => {
      console.log('Checking link health:', job.data.linkId);
      // Actual health check logic in worker app
      return { checked: true };
    },
    { connection: redisConnection }
  );

  // Analytics aggregation worker
  const analyticsWorker = new Worker(
    'analytics',
    async (job: Job<AnalyticsAggregateJob>) => {
      console.log('Aggregating analytics:', job.data.workspaceId, job.data.date);
      // Actual aggregation logic in worker app
      return { aggregated: true };
    },
    { connection: redisConnection }
  );

  // Error handlers
  clickWorker.on('failed', (job, err) => {
    console.error('Click job failed:', job?.id, err);
  });

  healthWorker.on('failed', (job, err) => {
    console.error('Health check job failed:', job?.id, err);
  });

  analyticsWorker.on('failed', (job, err) => {
    console.error('Analytics job failed:', job?.id, err);
  });

  return {
    clickWorker,
    healthWorker,
    analyticsWorker,
  };
}

// Graceful shutdown
export async function closeQueues(): Promise<void> {
  await Promise.all([
    queues.clicks.close(),
    queues.analytics.close(),
    queues.healthChecks.close(),
    queues.notifications.close(),
    queues.exports.close(),
  ]);
  await redisConnection.quit();
}
