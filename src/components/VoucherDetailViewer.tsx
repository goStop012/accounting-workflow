import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Printer, 
  Download, 
  Check, 
  FileCheck,
  Edit2
} from 'lucide-react';
import { AccountingVoucher, VoucherEntry } from '../types/accounting';
import { DeepSeekConfig } from '../types/deepseek';

interface VoucherDetailViewerProps {
  vouchers: AccountingVoucher[];
  onApproveVoucher: (id: string) => void;
  onGenerateNewVoucher: () => void;
  deepSeekConfig: DeepSeekConfig;
  isGenerating: boolean;
}

export const VoucherDetailViewer: React.FC<VoucherDetailViewerProps> = ({
  vouchers,
  onApproveVoucher,
  onGenerateNewVoucher,
  deepSeekConfig,
  isGenerating
}) => {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>(vouchers[0]?.id || '');
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'detail'>('list');
  const [isEditing, setIsEditing] = useState(false);
  const [editedAuditor, setEditedAuditor] = useState('王强 (主审会计师)');

  const currentVoucher = vouchers.find(v => v.id === selectedVoucherId) || vouchers[0];

  // 人民币大写转换辅助函数
  const numberToChineseCurrency = (money: number): string => {
    if (money === 0) return '零元整';
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const cnIntRadice = ['', '拾', '佰', '仟'];
    const cnIntUnits = ['', '万', '亿', '兆'];
    const cnDecUnits = ['角', '分'];
    const integerNum = Math.floor(money);
    const decimalNum = Math.round((money - integerNum) * 100);

    let chineseStr = '';
    if (integerNum > 0) {
      let zeroCount = 0;
      const intStr = integerNum.toString();
      for (let i = 0; i < intStr.length; i++) {
        const n = intStr.charAt(i);
        const p = intStr.length - i - 1;
        const q = p / 4;
        const m = p % 4;
        if (n === '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n, 10)] + cnIntRadice[m];
        }
        if (m === 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[Math.floor(q)];
        }
      }
      chineseStr += '元';
    }
    if (decimalNum > 0) {
      const jiao = Math.floor(decimalNum / 10);
      const fen = decimalNum % 10;
      if (jiao > 0) chineseStr += cnNums[jiao] + cnDecUnits[0];
      if (fen > 0) chineseStr += cnNums[fen] + cnDecUnits[1];
    } else {
      chineseStr += '整';
    }
    return chineseStr;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">步骤 2. 自动生成会计凭证</h3>
              <span className="text-xs font-mono text-cyan-400">工具：DeepSeek + 财务软件核心</span>
            </div>
            <p className="text-xs text-slate-400">
              根据发票内容自动生成借贷记账分录，匹配会计科目、进项税额并校验借贷平衡
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateNewVoucher}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/20 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'AI 推导分录中...' : 'DeepSeek 智能生成新凭证'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible on mobile only) */}
      <div className="flex lg:hidden bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setMobileViewTab('list')}
          className={`flex-1 py-1.5 rounded-md text-center transition-colors min-h-[38px] ${
            mobileViewTab === 'list' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          凭证列表 ({vouchers.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('detail')}
          className={`flex-1 py-1.5 rounded-md text-center transition-colors min-h-[38px] ${
            mobileViewTab === 'detail' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          凭证详情 {currentVoucher ? `(${currentVoucher.voucherWord}-${currentVoucher.voucherNumber})` : ''}
        </button>
      </div>

      {/* Main Grid: Voucher Tabs / List + Detail Voucher Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Vouchers Directory (4 cols) */}
        <div className={`lg:col-span-4 space-y-2.5 ${mobileViewTab === 'detail' ? 'hidden lg:block' : 'block'}`}>
          <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
            <span>已生成凭证列表 ({vouchers.length} 张)</span>
            <span className="text-[11px] text-cyan-400">借贷必须平衡</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {vouchers.map((v) => {
              const isSelected = v.id === (currentVoucher?.id || '');
              return (
                <div
                  key={v.id}
                  onClick={() => {
                    setSelectedVoucherId(v.id);
                    setMobileViewTab('detail');
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {v.voucherWord}字 第 {v.voucherNumber} 号
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-200 tabular-nums">
                      ¥{v.totalDebit.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    {v.entries[0]?.summary || '日常业务会计分录'}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                    <span>{v.date}</span>
                    <div className="flex items-center gap-1.5">
                      {v.isBalanced ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          借贷平
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          借贷不平
                        </span>
                      )}
                      <span>·</span>
                      <span className={v.status === 'audited' ? 'text-emerald-400' : 'text-amber-400'}>
                        {v.status === 'audited' ? '已审核' : '待复核'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Chinese Standard Accounting Voucher (8 cols) */}
        <div className={`lg:col-span-8 ${mobileViewTab === 'list' ? 'hidden lg:block' : 'block'}`}>
          {currentVoucher ? (
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              {/* Mobile Back Button */}
              <div className="lg:hidden pb-1">
                <button
                  type="button"
                  onClick={() => setMobileViewTab('list')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 min-h-[36px]"
                >
                  ← 返回凭证列表
                </button>
              </div>

              {/* Voucher Top Header */}
              <div className="text-center relative pb-3 border-b border-slate-800">
                <h2 className="text-base sm:text-lg font-bold tracking-wider text-slate-100">
                  记 账 凭 证
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 mt-2 gap-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span>核算单位: 北京智算星辰</span>
                    <span>日期: {currentVoucher.date}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                    <span className="text-cyan-400 font-semibold">
                      编号: {currentVoucher.voucherWord}-{currentVoucher.voucherNumber}
                    </span>
                    <span>附单据: {currentVoucher.attachmentCount} 张</span>
                  </div>
                </div>
              </div>

              {/* Accounting Entries Table (with horizontal scroll for narrow screens) */}
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                  <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                    <tr>
                      <th className="px-3 py-2 w-1/4">摘要</th>
                      <th className="px-3 py-2 w-1/3">会计科目及核算项目</th>
                      <th className="px-3 py-2 text-right w-1/5">借方金额</th>
                      <th className="px-3 py-2 text-right w-1/5">贷方金额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {currentVoucher.entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-900/40">
                        <td className="px-3 py-2.5 text-slate-300 font-normal">
                          {entry.summary}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-slate-100">{entry.subjectName}</div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                            <span>代码: {entry.subjectCode}</span>
                            {entry.auxiliaryAccount && (
                              <span>[{entry.auxiliaryAccount}]</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-100">
                          {entry.debitAmount > 0 ? (
                            `¥${entry.debitAmount.toFixed(2)}`
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono tabular-nums text-slate-100">
                          {entry.creditAmount > 0 ? (
                            `¥${entry.creditAmount.toFixed(2)}`
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* Summary & Balance Check Row */}
                  <tfoot className="bg-slate-900/90 font-semibold border-t-2 border-slate-700 text-xs">
                    <tr>
                      <td className="px-3 py-2.5 text-slate-300" colSpan={2}>
                        <div className="flex items-center gap-2">
                          <span>合计 (大写):</span>
                          <span className="text-cyan-300 font-normal">
                            {numberToChineseCurrency(currentVoucher.totalDebit)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-cyan-400 tabular-nums">
                        ¥{currentVoucher.totalDebit.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-cyan-400 tabular-nums">
                        ¥{currentVoucher.totalCredit.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures & Auditor Block (符合中国财务规范：制单、审核、出纳、记账) */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-5">
                  <span>财务主管: 许立国 (CPA)</span>
                  <span>
                    审核人: <span className="text-slate-200">{currentVoucher.auditor || '待复核'}</span>
                  </span>
                  <span>出纳: 刘薇</span>
                  <span>
                    制单人: <span className="text-cyan-400 font-mono">{currentVoucher.creator}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {currentVoucher.isBalanced ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-mono text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      借贷平衡校验通过
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-mono text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      借贷不平，差额: ¥{Math.abs(currentVoucher.totalDebit - currentVoucher.totalCredit).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* DeepSeek Reasoning & Professional Notes */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  DeepSeek 准则推导依据与税务核算说明
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentVoucher.aiReasoning}
                </p>
              </div>

              {/* Action Buttons: 人工复核批准 / 打印导出 */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  状态: {currentVoucher.status === 'audited' ? '凭证已人工复核锁定' : '等待主审会计师复核签章'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApproveVoucher(currentVoucher.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                      currentVoucher.status === 'audited'
                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                        : 'bg-emerald-950/50 border-emerald-600 text-emerald-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{currentVoucher.status === 'audited' ? '撤销审核状态' : '复核并通过记账凭证'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              <BookOpen className="w-8 h-8 mb-2 text-slate-600" />
              <span>暂无凭证数据，请点击左上方生成</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
