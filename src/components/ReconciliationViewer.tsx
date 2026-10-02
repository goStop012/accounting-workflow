import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  FileSpreadsheet, 
  PlusCircle, 
  Check
} from 'lucide-react';
import { BankReconciliationReport, BankTransaction } from '../types/accounting';
import { DeepSeekConfig } from '../types/deepseek';

interface ReconciliationViewerProps {
  report: BankReconciliationReport;
  transactions: BankTransaction[];
  onResolveDiscrepancy: (id: string) => void;
  onRunReconciliationAI: () => void;
  deepSeekConfig: DeepSeekConfig;
  isProcessing: boolean;
}

export const ReconciliationViewer: React.FC<ReconciliationViewerProps> = ({
  report,
  transactions,
  onResolveDiscrepancy,
  onRunReconciliationAI,
  deepSeekConfig,
  isProcessing
}) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'transactions'>('statement');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">步骤 3. 银行智能对账与未达账项排查</h3>
              <span className="text-xs font-mono text-cyan-400">工具：RPA + Excel + DeepSeek</span>
            </div>
            <p className="text-xs text-slate-400">
              自动匹配银行对公流水与总账存款日记账，识别未达账项与差异成因并出具调节表
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('statement')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'statement' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              余额调节表
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'transactions' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              流水明细 ({transactions.length})
            </button>
          </div>

          <button
            onClick={onRunReconciliationAI}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/20 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'AI 诊断勾兑中...' : 'DeepSeek 智能排查差异'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'statement' ? (
        <div className="space-y-4">
          {/* Status summary banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">银行对账单余额</span>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                ¥{report.bankStatementEndingBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-500">{report.bankName}</span>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">企业日记账余额</span>
              <div className="text-base font-bold font-mono text-white tabular-nums">
                ¥{report.companyBookEndingBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] text-slate-500">所属期: {report.period}</span>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">调节后相符余额</span>
              <div className="text-base font-bold font-mono text-cyan-300 tabular-nums">
                ¥{report.adjustedBankBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>两方调整后完全相符</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">流水匹配率</span>
              <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                {((report.matchedCount / (report.matchedCount + report.unmatchedCount)) * 100).toFixed(1)}%
              </div>
              <span className="text-[11px] text-slate-400">
                匹配 {report.matchedCount} 笔 / 差异 {report.unmatchedCount} 笔
              </span>
            </div>
          </div>

          {/* Chinese Standard Bank Reconciliation Table (银行存款余额调节表) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-center pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-slate-200">银 行 存 款 余 额 调 节 表</h4>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                <span>开户行及账号: {report.bankName} ({report.accountNumber})</span>
                <span>所属编制月份: {report.period}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 border border-slate-800 rounded-lg overflow-hidden text-xs">
              {/* Left Column: Bank Side */}
              <div className="p-3 space-y-2.5">
                <div className="flex justify-between font-semibold text-slate-200 border-b border-slate-800/80 pb-1.5">
                  <span>项目 (银行对账单调整)</span>
                  <span className="font-mono">金额 (元)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>银行对账单期末余额</span>
                  <span className="font-mono tabular-nums">¥{report.bankStatementEndingBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>加: 企业已收、银行未收款项</span>
                  <span className="font-mono tabular-nums">¥{report.plusCompanyReceivedBankUnrecorded.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>减: 企业已付、银行未付款项</span>
                  <span className="font-mono tabular-nums">¥{report.lessCompanyPaidBankUnrecorded.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-cyan-300 pt-2 border-t border-slate-800">
                  <span>调节后银行存款余额</span>
                  <span className="font-mono tabular-nums">¥{report.adjustedBankBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Right Column: Company Side */}
              <div className="p-3 space-y-2.5">
                <div className="flex justify-between font-semibold text-slate-200 border-b border-slate-800/80 pb-1.5">
                  <span>项目 (企业存款日记账调整)</span>
                  <span className="font-mono">金额 (元)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>企业银行存款日记账期末余额</span>
                  <span className="font-mono tabular-nums">¥{report.companyBookEndingBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>加: 银行已收、企业未收款项</span>
                  <span className="font-mono tabular-nums">+¥{report.plusBankReceivedCompanyUnrecorded.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>减: 银行已付、企业未付款项</span>
                  <span className="font-mono tabular-nums">-¥{report.lessBankPaidCompanyUnrecorded.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-cyan-300 pt-2 border-t border-slate-800">
                  <span>调节后企业银行存款余额</span>
                  <span className="font-mono tabular-nums">¥{report.adjustedCompanyBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Discrepancy Diagnosis & Action Recommendations */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                DeepSeek 识别出的未达账项与差异处置建议 ({report.discrepancies.length} 项)
              </span>
              <span className="text-[11px] text-slate-400">依据中国《企业内部控制规范》要求人工复核并及时索取回单入账</span>
            </div>

            <div className="space-y-2">
              {report.discrepancies.map((disc) => (
                <div
                  key={disc.id}
                  className={`p-3.5 rounded-lg border text-xs space-y-2 transition-all ${
                    disc.resolved
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span>{disc.title}</span>
                        <span className="font-mono text-cyan-400 tabular-nums">
                          ¥{disc.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">{disc.description}</p>
                    </div>

                    <button
                      onClick={() => onResolveDiscrepancy(disc.id)}
                      className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                        disc.resolved
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{disc.resolved ? '已标记解决' : '标记已处理'}</span>
                    </button>
                  </div>

                  <div className="p-2.5 bg-cyan-950/20 border border-cyan-900/30 rounded-md text-[11px] text-cyan-200/90 leading-relaxed flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-cyan-300">AI 会计处理方案：</span>
                      {disc.suggestedAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Transactions List View */
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">交易时间</th>
                <th className="px-3 py-2.5">对方户名</th>
                <th className="px-3 py-2.5">摘要/用途</th>
                <th className="px-3 py-2.5 text-right">交易金额</th>
                <th className="px-3 py-2.5 text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30">
                  <td className="px-3 py-2 font-mono text-slate-400">{tx.transactionTime}</td>
                  <td className="px-3 py-2 font-medium text-slate-200">{tx.counterpartyName}</td>
                  <td className="px-3 py-2 text-slate-400">{tx.summary}</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold tabular-nums">
                    <span className={tx.transactionType === 'inflow' ? 'text-emerald-400' : 'text-slate-100'}>
                      {tx.transactionType === 'inflow' ? '+' : '-'}¥{tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {tx.matchedVoucherId ? (
                      <span className="text-[11px] text-emerald-400 font-medium">已关联凭证</span>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-medium">未达账项</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
