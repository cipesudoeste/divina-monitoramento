import React from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-xl border bg-white p-4 shadow-sm', className)} {...props} />;
}

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx('w-full rounded-md border px-3 py-2 text-sm', className)} {...props} />;
}
