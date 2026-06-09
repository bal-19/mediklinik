import type { ReactNode } from 'react';

export function Page({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <><header className="page-head"><div><p className="eyebrow">Operasional Klinik</p><h1>{title}</h1><p>{description}</p></div>{action}</header>{children}</>;
}

export function QueryState({ isLoading, error }: { isLoading: boolean; error: Error | null }) {
  if (isLoading) return <div className="panel">Memuat data klinik...</div>;
  if (error) return <div className="panel danger">{error.message}</div>;
  return null;
}
