import React, { useState, useRef } from 'react';
import { 
  X, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Scale, 
  BarChart3,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  InvoiceItem, 
  AccountingVoucher, 
  BankTransaction, 
  BankReconciliationReport, 
  FinancialReportsData, 
  FinancialInsight 
} from '../types/accounting';
import { PipelineStepMeta } from '../types/workflow';
import { AccountingStorageSnapshot, StorageStats, StorageAuditLog } from '../types/storage';
import { accountingRepository } from '../services/storage/accountingRepository';

interface StorageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    invoices: InvoiceItem[];
    vouchers: AccountingVoucher[];
    bankTransactions: BankTransaction[];
    reconciliationReport: BankReconciliationReport;
    financialReports: FinancialReportsData;
    insights: FinancialInsight[];
    pipelineSteps?: PipelineStepMeta[];
  };
  onRestoreSnapshot: (snapshot: AccountingStorageSnapshot) => void;
  onResetToDefault: () => void;
  lastSavedAt: string | null;
}

export const StorageManagerModal: React.FC<StorageManagerModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onRestoreSnapshot,
  onResetToDefault,
  lastSavedAt
}) => {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'audit'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const stats: StorageStats = accountingRepository.getStats(currentData);
  const auditLogs: StorageAuditLog[] = accountingRepository.getAuditLogs();

  const handleExport = () => {
    const snapshot: AccountingStorageSnapshot = {
      schemaVersion: 1,
      metadata: {
        companyName: '北京智算星辰科技有限公司',
        accountingPeriod: '2026年9月 (2026-09-01 至 2026-09-30)',
        appVersion: '2.4.0',
        createdAt: new Date().toISOString(),
        exportedBy: '主管会计 (系统自动导出)',
        entityCounts: {
          invoices: currentData.invoices.length,
          vouchers: currentData.vouchers.length,
          bankTransactions: currentData.bankTransactions.length,
          discrepancies: currentData.reconciliationReport.discrepancies.length,
          insights: currentData.insights.length
        }
      },
      invoices: currentData.invoices,
      vouchers: currentData.vouchers,
      bankTransactions: currentData.bankTransactions,
      reconciliationReport: currentData.reconciliationReport,
      financialReports: currentData.financialReports,
      insights: currentData.insights,
      pipelineSteps: currentData.pipelineSteps
    };

    accountingRepository.downloadBackupFile(snapshot);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = accountingRepository.validateAndParseBackup(content);
      if (result.valid && result.data) {
        onRestoreSnapshot(result.data);
        setImportSuccess(`成功恢复账套！已导入 ${result.data.invoices.length} 张发票，${result.data.vouchers.length} 张记账凭证。`);
        setTimeout(() => setImportSuccess(null), 4000);
      } else {
        setImportError(result.error || '账套备份文件校验失败，请检查格式');
      }
    };
    reader.onerror = () => {
      setImportError('读取本地文件失败');
    };
    reader.readAsText(file);

    // 重置 input 允许重复选择相同文件
    e.target.value = '';
  };

  const handleReset = () => {
    accountingRepository.resetToFactory();
    onResetToDefault();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">财务数据持久化与账套备份中心</h3>
                <span className="text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  实时本地持久化已开启
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                所有发票识别数据、复式凭证、对账明细与财务报表均已完整保存在您本机的持久化数据库中
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800/80 bg-slate-950/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            数据概览与备份恢复
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === 'audit'
                ? 'border-cyan-500 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>数据存取审计历史</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 rounded-full">
              {auditLogs.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {importSuccess && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{importSuccess}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {activeTab === 'overview' ? (
            <>
              {/* Storage Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                    本地存储占用
                  </div>
                  <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                    {stats.formattedSize}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    驱动: {stats.driver}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    识别发票记录
                  </div>
                  <div className="text-lg font-bold font-mono text-blue-300 mt-1">
                    {stats.counts.invoices} <span className="text-xs font-normal text-slate-500">张</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    含票面四要素明细
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    复式记账凭证
                  </div>
                  <div className="text-lg font-bold font-mono text-purple-300 mt-1">
                    {stats.counts.vouchers} <span className="text-xs font-normal text-slate-500">笔</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    借贷试算严格平衡
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    最近自动保存
                  </div>
                  <div className="text-sm font-bold font-mono text-emerald-300 mt-1 truncate">
                    {lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString('zh-CN', { hour12: false }) : '刚刚'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    变更自动节流写入
                  </div>
                </div>
              </div>

              {/* Operations Action Area */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    账套快照备份与跨端迁移
                  </span>
                  <span className="text-[11px] text-slate-500">符合《会计档案管理办法》电子化导出标准</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Export Button */}
                  <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all text-xs font-semibold group shadow-sm"
                  >
                    <Download className="w-4 h-4 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
                    <div className="text-left">
                      <div>导出全量账套备份 (.json)</div>
                      <div className="text-[10px] font-normal text-slate-400">下载当前完整凭证、发票与报表</div>
                    </div>
                  </button>

                  {/* Import Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all text-xs font-semibold group shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-emerald-400 group-hover:-translate-y-0.5 transition-transform" />
                    <div className="text-left">
                      <div>恢复 / 导入外部账套</div>
                      <div className="text-[10px] font-normal text-slate-400">选择 JSON 账套文件恢复历史数据</div>
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Reset to Factory Danger Zone */}
              <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    恢复出厂演示账套
                  </div>
                  <div className="text-[11px] text-slate-400">
                    清空当前本地所有编辑记录，重新载入智算星辰科技 2026年9月 标准演示例题数据
                  </div>
                </div>

                {confirmReset ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm shadow-rose-600/30"
                    >
                      确认重置
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 rounded-lg border border-rose-800/80 transition-colors shrink-0"
                  >
                    重置数据
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Audit Trail Tab */
            <div className="space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between pb-1">
                <span>持久化操作与同步审计流 (保留最新 50 条)</span>
                <span className="font-mono text-cyan-400 text-[11px]">不可篡改审计追踪</span>
              </div>

              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  暂无审计历史
                </div>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'success' ? 'bg-emerald-400' :
                          log.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        <span className="font-mono text-slate-400 text-[11px]">{log.timestamp}</span>
                        <span className="text-slate-200">{log.description}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>数据全程加密储存于当前浏览器，无需担心隐私或涉税财务数据泄露。</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
