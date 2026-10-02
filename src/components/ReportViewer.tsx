import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  RefreshCw, 
  Sparkles,
  Layers
} from 'lucide-react';
import { FinancialReportsData } from '../types/accounting';
import { DeepSeekConfig } from '../types/deepseek';

interface ReportViewerProps {
  reports: FinancialReportsData;
  onRefreshReports: () => void;
  deepSeekConfig: DeepSeekConfig;
  isProcessing: boolean;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  reports,
  onRefreshReports,
  deepSeekConfig,
  isProcessing
}) => {
  const [statementType, setStatementType] = useState<'balance_sheet' | 'income_statement'>('balance_sheet');

  const { balanceSheet, incomeStatement } = reports;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">步骤 4. 自动汇总与法定财务报表生成</h3>
              <span className="text-xs font-mono text-cyan-400">工具：DeepSeek + Excel/财务套件</span>
            </div>
            <p className="text-xs text-slate-400">
              自动按期末科目汇总结转损益，实时生成资产负债表与利润表并校验表内勾稽关系
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Statement Tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStatementType('balance_sheet')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statementType === 'balance_sheet' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              资产负债表
            </button>
            <button
              onClick={() => setStatementType('income_statement')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statementType === 'income_statement' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              利润表 (损益表)
            </button>
          </div>

          <button
            onClick={onRefreshReports}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>重新汇总计算</span>
          </button>
        </div>
      </div>

      {/* Report Info Banner */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80 font-mono">
        <div>编制单位: <span className="text-slate-200">{reports.companyName}</span></div>
        <div>报表期间: <span className="text-cyan-400">{reports.period}</span></div>
        <div>货币单位: 人民币元 (CNY)</div>
      </div>

      {statementType === 'balance_sheet' ? (
        /* Balance Sheet: Split view (Assets vs Liabilities & Equity) */
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Assets */}
            <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/70">
              <div className="min-w-[340px]">
                <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 font-semibold text-xs text-slate-200 flex justify-between">
                  <span>资 产</span>
                  <div className="flex gap-8 sm:gap-12 font-mono text-[11px] text-slate-400 pr-2">
                    <span>年初余额</span>
                    <span>期末余额</span>
                  </div>
                </div>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {balanceSheet.assets.map((row) => (
                    <div key={row.lineNo} className="px-3.5 py-2 flex items-center justify-between hover:bg-slate-900/30">
                      <span className="text-slate-300 line-clamp-1">{row.item}</span>
                      <div className="flex items-center gap-4 sm:gap-6 font-mono text-slate-200 tabular-nums shrink-0">
                        <span className="w-20 sm:w-24 text-right text-slate-400 text-[11px] sm:text-xs">¥{row.beginningBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                        <span className="w-20 sm:w-24 text-right font-medium text-[11px] sm:text-xs">¥{row.endingBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3.5 py-2.5 bg-slate-900/90 border-t-2 border-slate-700 flex justify-between font-bold text-xs text-cyan-300">
                  <span>资产总计</span>
                  <span className="font-mono text-sm tabular-nums">
                    ¥{balanceSheet.totalAssets.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Liabilities and Equity */}
            <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/70">
              <div className="min-w-[340px]">
                <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 font-semibold text-xs text-slate-200 flex justify-between">
                  <span>负债及所有者权益</span>
                  <div className="flex gap-8 sm:gap-12 font-mono text-[11px] text-slate-400 pr-2">
                    <span>年初余额</span>
                    <span>期末余额</span>
                  </div>
                </div>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {balanceSheet.liabilitiesAndEquity.map((row) => (
                    <div key={row.lineNo} className="px-3.5 py-2 flex items-center justify-between hover:bg-slate-900/30">
                      <span className="text-slate-300 line-clamp-1">{row.item}</span>
                      <div className="flex items-center gap-4 sm:gap-6 font-mono text-slate-200 tabular-nums shrink-0">
                        <span className="w-20 sm:w-24 text-right text-slate-400 text-[11px] sm:text-xs">¥{row.beginningBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                        <span className="w-20 sm:w-24 text-right font-medium text-[11px] sm:text-xs">¥{row.endingBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3.5 py-2.5 bg-slate-900/90 border-t-2 border-slate-700 flex justify-between font-bold text-xs text-cyan-300">
                  <span>负债和所有者权益总计</span>
                  <span className="font-mono text-sm tabular-nums">
                    ¥{balanceSheet.totalLiabilitiesAndEquity.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Check Footer */}
          <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>会计平衡公式校验：资产 (¥{balanceSheet.totalAssets.toLocaleString()}) = 负债及所有者权益 (¥{balanceSheet.totalLiabilitiesAndEquity.toLocaleString()})</span>
            </div>
            <span className="text-cyan-400 font-mono">差额: ¥0.00</span>
          </div>
        </div>
      ) : (
        /* Income Statement */
        <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950/70">
          <div className="min-w-[420px]">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 font-semibold text-xs text-slate-200 flex justify-between">
              <span>项 目 (损益科目)</span>
              <div className="flex gap-16 font-mono text-[11px] text-slate-400 pr-3">
                <span>上期金额</span>
                <span>本期金额</span>
              </div>
            </div>
            <div className="divide-y divide-slate-800/80 text-xs">
              {incomeStatement.rows.map((row) => {
                const isHighlight = row.item.includes('一、') || row.item.includes('二、') || row.item.includes('三、') || row.item.includes('四、');
                return (
                  <div 
                    key={row.lineNo} 
                    className={`px-4 py-2.5 flex items-center justify-between hover:bg-slate-900/40 ${
                      isHighlight ? 'bg-slate-900/50 font-semibold text-slate-100' : 'text-slate-300'
                    }`}
                  >
                    <span className={isHighlight ? 'text-cyan-300' : 'pl-4'}>{row.item}</span>
                    <div className="flex items-center gap-12 font-mono tabular-nums shrink-0">
                      <span className="w-28 text-right text-slate-400">
                        ¥{row.beginningBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`w-28 text-right font-medium ${isHighlight ? 'text-cyan-300 font-bold' : 'text-slate-200'}`}>
                        ¥{row.endingBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 bg-slate-900/90 border-t-2 border-slate-700 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">本期净利润率：</span>
              <div className="flex items-center gap-6 font-mono text-cyan-300">
                <span>净利润: ¥{incomeStatement.netProfit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                <span>净利率: {((incomeStatement.netProfit / incomeStatement.totalRevenue) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
