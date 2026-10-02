/**
 * 财务会计数据持久化仓储层 (Accounting Storage Repository)
 * 提供领域实体持久化、JSON账套全量备份导出、导入恢复、校验与审计轨迹记录
 */

import { storageAdapter } from './storageAdapter';
import { 
  AccountingStorageSnapshot, 
  StorageStats, 
  StorageAuditLog, 
  StorageSnapshotMetadata 
} from '../../types/storage';
import { 
  InvoiceItem, 
  AccountingVoucher, 
  BankTransaction, 
  BankReconciliationReport, 
  FinancialReportsData, 
  FinancialInsight 
} from '../../types/accounting';
import { PipelineStepMeta } from '../../types/workflow';

const SNAPSHOT_KEY = 'accounting_snapshot';
const AUDIT_LOGS_KEY = 'storage_audit_logs';
const LAST_SAVED_KEY = 'last_saved_timestamp';
const SCHEMA_VERSION = 1;

class AccountingRepository {
  /**
   * 读取本地持久化的完整账套快照
   */
  public loadSnapshot(): AccountingStorageSnapshot | null {
    const data = storageAdapter.getItem<AccountingStorageSnapshot>(SNAPSHOT_KEY);
    if (data && data.schemaVersion === SCHEMA_VERSION) {
      this.recordAuditLog('initial_load', `成功读取本地持久化账套，包含 ${data.invoices?.length || 0} 张发票，${data.vouchers?.length || 0} 张凭证`, 'success');
      return data;
    }
    return null;
  }

  /**
   * 将当前会计工作流全套数据实时保存至持久化存储
   */
  public saveSnapshot(payload: {
    invoices: InvoiceItem[];
    vouchers: AccountingVoucher[];
    bankTransactions: BankTransaction[];
    reconciliationReport: BankReconciliationReport;
    financialReports: FinancialReportsData;
    insights: FinancialInsight[];
    pipelineSteps?: PipelineStepMeta[];
  }): boolean {
    const now = new Date().toISOString();

    const metadata: StorageSnapshotMetadata = {
      companyName: '北京智算星辰科技有限公司',
      accountingPeriod: '2026年9月 (2026-09-01 至 2026-09-30)',
      appVersion: '2.4.0',
      createdAt: now,
      exportedBy: '系统自动持久化',
      entityCounts: {
        invoices: payload.invoices.length,
        vouchers: payload.vouchers.length,
        bankTransactions: payload.bankTransactions.length,
        discrepancies: payload.reconciliationReport.discrepancies.length,
        insights: payload.insights.length
      }
    };

    const snapshot: AccountingStorageSnapshot = {
      schemaVersion: SCHEMA_VERSION,
      metadata,
      invoices: payload.invoices,
      vouchers: payload.vouchers,
      bankTransactions: payload.bankTransactions,
      reconciliationReport: payload.reconciliationReport,
      financialReports: payload.financialReports,
      insights: payload.insights,
      pipelineSteps: payload.pipelineSteps
    };

    const success = storageAdapter.setItem(SNAPSHOT_KEY, snapshot);
    if (success) {
      storageAdapter.setItem(LAST_SAVED_KEY, now);
    }
    return success;
  }

  /**
   * 获取最近保存时间
   */
  public getLastSavedTime(): string | null {
    return storageAdapter.getItem<string>(LAST_SAVED_KEY);
  }

  /**
   * 导出标准 JSON 账套备份文件并触发浏览器下载
   */
  public downloadBackupFile(snapshot: AccountingStorageSnapshot): void {
    const jsonStr = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `智算星辰_AI会计账套全量备份_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.recordAuditLog(
      'export_json', 
      `导出标准 JSON 账套备份，发票 ${snapshot.invoices.length} 笔，凭证 ${snapshot.vouchers.length} 笔`, 
      'success',
      snapshot.invoices.length + snapshot.vouchers.length
    );
  }

  /**
   * 解析并校验用户上传的 JSON 备份文件
   */
  public validateAndParseBackup(jsonString: string): {
    valid: boolean;
    data?: AccountingStorageSnapshot;
    error?: string;
  } {
    try {
      const parsed = JSON.parse(jsonString) as AccountingStorageSnapshot;
      if (!parsed || typeof parsed !== 'object') {
        return { valid: false, error: '文件不是合法的 JSON 格式。' };
      }
      if (!Array.isArray(parsed.invoices) || !Array.isArray(parsed.vouchers)) {
        return { valid: false, error: '备份文件结构不完整：缺少发票或凭证清单。' };
      }
      if (!parsed.reconciliationReport || !parsed.financialReports) {
        return { valid: false, error: '备份文件结构不完整：缺少对账或财务报表。' };
      }

      this.recordAuditLog(
        'import_json',
        `成功校验导入账套，包含 ${parsed.invoices.length} 张发票，${parsed.vouchers.length} 张凭证`,
        'success',
        parsed.invoices.length + parsed.vouchers.length
      );

      return { valid: true, data: parsed };
    } catch (err: any) {
      return { valid: false, error: `JSON 解析失败: ${err.message}` };
    }
  }

  /**
   * 重置本地存储恢复出厂演示账套
   */
  public resetToFactory(): void {
    storageAdapter.clearAll();
    this.recordAuditLog('reset_factory', '已清空本地持久化存储，恢复出厂初始演示数据', 'warning');
  }

  /**
   * 获取存储使用统计与配额
   */
  public getStats(currentData?: {
    invoices: InvoiceItem[];
    vouchers: AccountingVoucher[];
    bankTransactions: BankTransaction[];
    insights: FinancialInsight[];
  }): StorageStats {
    const bytes = storageAdapter.getUsedBytes();
    let formattedSize = '0 KB';
    if (bytes < 1024) {
      formattedSize = `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      formattedSize = `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      formattedSize = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    return {
      driver: storageAdapter.getDriverName() === 'localStorage' ? 'localStorage' : 'memory',
      totalBytes: bytes,
      formattedSize,
      lastSavedAt: this.getLastSavedTime(),
      counts: {
        invoices: currentData?.invoices.length || 0,
        vouchers: currentData?.vouchers.length || 0,
        bankTransactions: currentData?.bankTransactions.length || 0,
        reports: 2, // 资产负债表 + 利润表
        insights: currentData?.insights.length || 0,
      }
    };
  }

  /**
   * 记录审计日志
   */
  public recordAuditLog(
    action: StorageAuditLog['action'], 
    description: string, 
    status: StorageAuditLog['status'] = 'success',
    recordCount: number = 0
  ): void {
    const logs = this.getAuditLogs();
    const newLog: StorageAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      action,
      description,
      status,
      recordCount
    };
    const updated = [newLog, ...logs].slice(0, 50); // 保留最新50条
    storageAdapter.setItem(AUDIT_LOGS_KEY, updated);
  }

  /**
   * 获取审计日志列表
   */
  public getAuditLogs(): StorageAuditLog[] {
    return storageAdapter.getItem<StorageAuditLog[]>(AUDIT_LOGS_KEY) || [];
  }
}

export const accountingRepository = new AccountingRepository();
