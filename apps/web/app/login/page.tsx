'use client';
import { Button, Card, Input } from '@divina/ui';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@divina.local');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit() {
    try {
      const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('workspaceId', data.user.workspaceId);
      router.push('/dashboard');
    } catch (e: any) { setErr(e.message); }
  }

  return <div className="flex min-h-screen items-center justify-center"><Card className="w-full max-w-md space-y-3"><h1 className="text-xl font-bold">Acessar painel</h1><Input value={email} onChange={(e)=>setEmail(e.target.value)} /><Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><Button onClick={submit}>Entrar</Button>{err && <p className="text-sm text-red-600">{err}</p>}</Card></div>;
}
