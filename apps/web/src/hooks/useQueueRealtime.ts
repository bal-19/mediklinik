import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useQueueRealtime(clinicId?: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!clinicId || !import.meta.env.VITE_SUPABASE_URL) return;
    const today = new Date().toISOString().slice(0, 10);
    const channel = supabase
      .channel(`queues-${clinicId}-${today}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queues', filter: `clinic_id=eq.${clinicId}` }, () => {
        void queryClient.invalidateQueries({ queryKey: ['queues', 'today'] });
        void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [clinicId, queryClient]);
}
