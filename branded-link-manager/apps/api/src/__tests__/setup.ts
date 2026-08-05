import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/branded_links_test';
process.env.JWT_SECRET = 'test-secret-key';
