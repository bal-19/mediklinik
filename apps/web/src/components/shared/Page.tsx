import type { ReactNode } from 'react';

export function Page({
  title,
  description,
  action,
  eyebrow = 'Operasional Klinik',
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {action}
      </header>
      {children}
    </>
  );
}

export function QueryState({ isLoading, error }: { isLoading: boolean; error: Error | null }) {
  if (isLoading) return <div className="panel">Memuat data klinik...</div>;
  if (error) return <div className="panel danger">{error.message}</div>;
  return null;
}
