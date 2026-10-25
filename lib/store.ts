'use client';

import { useSyncExternalStore } from 'react';
import { seedDB } from './seed';
import type { DB } from './types';

// Local-first store: everything lives in this browser's localStorage. Swap
// load/save for a Supabase client when it's time for multi-user sync.
const KEY = 'remodel-estimator-db-v1';

let db: DB | null = null;
const listeners = new Set<() => void>();

function load(): DB {
  if (db) return db;
  try {
    const raw = localStorage.getItem(KEY);
    db = raw ? (JSON.parse(raw) as DB) : seedDB();
  } catch {
    db = seedDB();
  }
  return db;
}

export function update(fn: (d: DB) => DB) {
  db = fn(load());
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // Storage full or blocked; keep working in memory.
  }
  listeners.forEach((l) => l());
}

export function resetDB() {
  update(() => seedDB());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const SERVER_SNAPSHOT = seedDB();

export function useDB(): DB {
  return useSyncExternalStore(subscribe, load, () => SERVER_SNAPSHOT);
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
