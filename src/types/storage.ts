/**
 * 财务数据持久化与备份恢复类型定义
 */
import { 
  InvoiceItem, 
  AccountingVoucher, 
  BankTransaction, 
  BankReconciliationReport, 
  FinancialReportsData, 
  FinancialInsight 
} from './accounting';
import { PipelineStepMeta } from './workflow';

export interface StorageSnapshotMetadata {
  companyName: string;
  accountingPeriod: string;
  appVersion: string;
  createdAt: string;
  exportedBy: string;
  entityCounts: {
    invoices: number;
    vouchers: number;
    bankTransactions: number;
    discrepancies: number;
    insights: number;
  };
}

export interface AccountingStorageSnapshot {
  schemaVersion: number;
  metadata: StorageSnapshotMetadata;
  invoices: InvoiceItem[];
  vouchers: AccountingVoucher[];
  bankTransactions: BankTransaction[];
  reconciliationReport: BankReconciliationReport;
  financialReports: FinancialReportsData;
  insights: FinancialInsight[];
  pipelineSteps?: PipelineStepMeta[];
}

export interface StorageStats {
  driver: 'localStorage' | 'indexedDB' | 'memory';
  totalBytes: number;
  formattedSize: string;
  lastSavedAt: string | null;
  counts: {
    invoices: number;
    vouchers: number;
    bankTransactions: number;
    reports: number;
    insights: number;
  };
}

export interface StorageAuditLog {
  id: string;
  timestamp: string;
  action: 'initial_load' | 'auto_save' | 'manual_save' | 'export_json' | 'import_json' | 'reset_factory';
  description: string;
  recordCount: number;
  status: 'success' | 'warning' | 'error';
}
