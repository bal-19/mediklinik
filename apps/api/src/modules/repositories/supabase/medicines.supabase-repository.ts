import type { LowStockAlert, MedicineSummary, StockInInput, StockMutationSummary } from '@mediklinik/types';
import type { MedicinesRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';

export class SupabaseMedicinesRepository implements MedicinesRepositoryContract {
  list(): MedicineSummary[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseMedicinesRepository.list belum diimplementasikan penuh.');
  }

  listLowStock(): LowStockAlert[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseMedicinesRepository.listLowStock belum diimplementasikan penuh.');
  }

  listMutations(): StockMutationSummary[] {
    getSupabaseAdminClient();
    return notImplemented('SupabaseMedicinesRepository.listMutations belum diimplementasikan penuh.');
  }

  stockIn(_medicineId: string, _input: StockInInput) {
    getSupabaseAdminClient();
    return notImplemented('SupabaseMedicinesRepository.stockIn belum diimplementasikan penuh.');
  }
}

function notImplemented(message: string): never {
  throw new Error(message);
}
