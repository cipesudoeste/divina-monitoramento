'use client';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card } from '@divina/ui';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export function DashboardPage() {
  const [data, setData] = useState<any>();
  useEffect(() => { api(`/dashboard/overview?workspaceId=${localStorage.getItem('workspaceId')}`).then(setData); }, []);
  if (!data) return <p>Carregando...</p>;
  const colors = ['#0f172a', '#1d4ed8', '#16a34a', '#9333ea', '#ea580c'];
  return <div className="space-y-6"><h2 className="text-2xl font-bold">Dashboard</h2>
  <div className="grid grid-cols-5 gap-3">{Object.entries(data.cards).map(([k,v])=><Card key={k}><p className="text-xs text-slate-500">{k}</p><p className="text-2xl font-bold">{v as any}</p></Card>)}</div>
  <div className="grid grid-cols-2 gap-4"><Card><h3>Crescimento por dia</h3><div className="h-64"><ResponsiveContainer><LineChart data={data.growth}><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Line type="monotone" dataKey="netGrowth" stroke="#0f172a" /></LineChart></ResponsiveContainer></div></Card>
  <Card><h3>Entradas vs Saídas</h3><div className="h-64"><ResponsiveContainer><BarChart data={data.growth}><XAxis dataKey="date" hide /><YAxis /><Tooltip /><Bar dataKey="joins" fill="#16a34a" /><Bar dataKey="leaves" fill="#dc2626" /></BarChart></ResponsiveContainer></div></Card></div>
  <div className="grid grid-cols-2 gap-4"><Card><h3>Origens</h3><div className="h-64"><ResponsiveContainer><PieChart><Pie data={data.origins} dataKey="value" nameKey="name">{data.origins.map((_:any,idx:number)=><Cell key={idx} fill={colors[idx%colors.length]} />)}</Pie></PieChart></ResponsiveContainer></div></Card>
  <Card><h3>Motivos de saída</h3><div className="h-64"><ResponsiveContainer><PieChart><Pie data={data.reasons} dataKey="value" nameKey="name">{data.reasons.map((_:any,idx:number)=><Cell key={idx} fill={colors[idx%colors.length]} />)}</Pie></PieChart></ResponsiveContainer></div></Card></div></div>;
}
