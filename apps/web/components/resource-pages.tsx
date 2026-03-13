'use client';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Button, Card, Input } from '@divina/ui';

export function SessionsPage() {
  const [rows, setRows] = useState<any[]>([]); const [label, setLabel] = useState('Nova sessão'); const workspaceId = typeof window !== 'undefined' ? localStorage.getItem('workspaceId') : '';
  const load = ()=>api('/sessions').then(setRows); useEffect(load, []);
  return <div className='space-y-3'><h2 className='text-2xl font-bold'>Sessões WhatsApp</h2><div className='flex gap-2'><Input value={label} onChange={(e)=>setLabel(e.target.value)} /><Button onClick={async()=>{await api('/sessions',{method:'POST',body:JSON.stringify({workspaceId,label})});load();}}>Criar sessão</Button></div><Card><table className='w-full text-sm'><thead><tr><th>Label</th><th>Status</th><th>Ações</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.label}</td><td>{r.status}</td><td className='space-x-2'><button onClick={()=>api(`/sessions/${r.id}/reconnect`,{method:'POST'}).then(load)}>Reconectar</button><button onClick={()=>api(`/sessions/${r.id}/disconnect`,{method:'POST'}).then(load)}>Desconectar</button></td></tr>)}</tbody></table></Card></div>;
}

export function GroupsPage() { return <SimpleTable title='Grupos' path='/groups' cols={['name','externalGroupId','isActive']} />; }
export function CampaignsPage() { return <SimpleTable title='Campanhas' path={`/campaigns?workspaceId=${typeof window !== 'undefined' ? localStorage.getItem('workspaceId') : ''}`} cols={['name','source','medium','isActive']} />; }
export function AuditPage() { return <SimpleTable title='Auditoria' path={`/audit?workspaceId=${typeof window !== 'undefined' ? localStorage.getItem('workspaceId') : ''}`} cols={['entityType','action','createdAt']} />; }

export function AutomationsPage() {
  const [groupId, setGroupId] = useState(''); const [flows, setFlows] = useState<any[]>([]);
  return <div className='space-y-3'><h2 className='text-2xl font-bold'>Automações</h2><div className='flex gap-2'><Input placeholder='groupId' value={groupId} onChange={e=>setGroupId(e.target.value)} /><Button onClick={()=>api(`/automations/groups/${groupId}`).then(setFlows)}>Carregar</Button></div>{flows.map(f=><Card key={f.id}><h4 className='font-semibold'>{f.title}</h4><p className='text-sm'>{f.messageText}</p></Card>)}</div>;
}

function SimpleTable({ title, path, cols }: { title: string; path: string; cols: string[] }) {
  const [rows, setRows] = useState<any[]>([]); useEffect(()=>{api(path).then(setRows);}, [path]);
  return <div className='space-y-3'><h2 className='text-2xl font-bold'>{title}</h2><Card><table className='w-full text-sm'><thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={r.id||i}>{cols.map(c=><td key={c}>{String(r[c] ?? '')}</td>)}</tr>)}</tbody></table></Card></div>;
}
