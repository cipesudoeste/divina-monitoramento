'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = ['dashboard','sessions','groups','automations','campaigns','audit'];

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="w-60 border-r bg-white p-4"><h1 className="mb-6 text-lg font-bold">Divina Monitoramento</h1><nav className="space-y-2">{items.map((i)=><Link key={i} href={`/${i}`} className={`block rounded px-3 py-2 ${pathname.includes(i)?'bg-slate-900 text-white':'hover:bg-slate-100'}`}>{i.toUpperCase()}</Link>)}</nav></aside>;
}
