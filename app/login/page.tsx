'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    const supabase = createClient();
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return finish(error.message);
      // If email confirmation is off, a session exists now; otherwise prompt.
      const { data } = await supabase.auth.getSession();
      if (data.session) return router.replace('/');
      return finish('Account created. Check your email to confirm, then sign in.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return finish(error.message);
    router.replace('/');
  }
  function finish(m: string) {
    setMsg(m);
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="text-xl font-bold text-navy">Remodel Estimator</div>
          <div className="text-sm text-slate-500">{mode === 'signin' ? 'Sign in' : 'Create your account'}</div>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
        <button className="btn w-full justify-center" disabled={busy}>
          {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>
        <button
          type="button"
          className="w-full text-center text-sm text-navy underline"
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMsg(''); }}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
