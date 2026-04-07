import fs from 'fs';
import path from 'path';

// This is a simple file-based mock database for MVP purposes.
// In production on Vercel, fs.writeFileSync will not persist data across serverless executions.
// You must swap this out with Supabase, MongoDB, or Google Sheets API.

const dbPath = path.join(process.cwd(), 'database.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(dbPath)) {
  const initialData = {
    products: [
      { id: '1', name: 'AuraLock Basic', price: 14999, features: ['Face Unlock', 'Fingerprint'] },
      { id: '2', name: 'AuraLock Pro', price: 24999, features: ['App Control', 'Cloud Logs'] }
    ],
    settings: {
      email: 'support@auralock.in',
      phone: '+91 98765 43210'
    },
    orders: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf-8');
}

export const getDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

export const saveDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};
