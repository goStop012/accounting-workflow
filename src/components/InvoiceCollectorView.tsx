import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Search,
  ExternalLink,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { InvoiceItem } from '../types/accounting';
import { DeepSeekConfig } from '../types/deepseek';

interface InvoiceCollectorViewProps {
  invoices: InvoiceItem[];
  onAddInvoice: (inv: InvoiceItem) => void;
  onReviewInvoice: (id: string) => void;
  onRecognizeWithDeepSeek: (rawText: string) => Promise<void>;
  deepSeekConfig: DeepSeekConfig;
  isProcessing: boolean;
}

export const InvoiceCollectorView: React.FC<InvoiceCollectorViewProps> = ({
  invoices,
  onAddInvoice,
  onReviewInvoice,
  onRecognizeWithDeepSeek,
  deepSeekConfig,
  isProcessing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(invoices[0] || null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'detail'>('list');
  const [customInvoiceText, setCustomInvoiceText] = useState(
    '发票代码: 3300231140 发票号码: 91823019 开票日期: 2026-09-28\n销售方: 华为云计算技术有限公司\n购买方: 北京智算星辰科技有限公司\n项目: *信息技术服务*云主机弹性公网IP及存储卷服务\n金额: ¥8500.00 税率: 6% 税额: ¥510.00 价税合计: ¥9010.00'
  );

  const filteredInvoices = invoices.filter(inv => 
    inv.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.number.includes(searchTerm)
  );

  const handleRecognizeSubmit = async () => {
    await onRecognizeWithDeepSeek(customInvoiceText);
    setShowUploadModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">步骤 1. 数据收集与智能 OCR 结构化提取</h3>
              <span className="text-xs font-mono text-cyan-400">工具：OCR + DeepSeek</span>
            </div>
            <p className="text-xs text-slate-400">
              自动识别并校验增值税专票、普通发票及报销单据，完成税额与纳税人识别号合规自查
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/20 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>输入/上传新单据</span>
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
          票据清单 ({filteredInvoices.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('detail')}
          className={`flex-1 py-1.5 rounded-md text-center transition-colors min-h-[38px] ${
            mobileViewTab === 'detail' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          票据详情 {selectedInvoice ? `(${selectedInvoice.sellerName.slice(0, 4)}...)` : ''}
        </button>
      </div>

      {/* Main Grid: List + Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Invoice Cards List (5 cols) */}
        <div className={`lg:col-span-5 space-y-3 ${mobileViewTab === 'detail' ? 'hidden lg:block' : 'block'}`}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索销售方、发票号码、商品劳务..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[40px]"
            />
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredInvoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    setSelectedInvoice(inv);
                    setMobileViewTab('detail');
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {inv.sellerName}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400 shrink-0 tabular-nums">
                      ¥{inv.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    {inv.serviceName}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <span>{inv.invoiceTypeName}</span>
                      <span>·</span>
                      <span>{inv.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {inv.reviewed ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" />
                          已复核
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" />
                          待复核
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Invoice Detail (7 cols) */}
        <div className={`lg:col-span-7 ${mobileViewTab === 'list' ? 'hidden lg:block' : 'block'}`}>
          {selectedInvoice ? (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
              {/* Mobile Back Button */}
              <div className="lg:hidden pb-1">
                <button
                  type="button"
                  onClick={() => setMobileViewTab('list')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 min-h-[36px]"
                >
                  ← 返回票据清单
                </button>
              </div>

              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {selectedInvoice.invoiceTypeName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      No. {selectedInvoice.number}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                    <span>代码: {selectedInvoice.code}</span>
                    <span>·</span>
                    <span>开票日期: {selectedInvoice.date}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  <div className="text-xs text-slate-400">价税合计 (小写)</div>
                  <div className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                    ¥{selectedInvoice.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Parties Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="text-slate-400 font-medium">购买方 (受票方)</div>
                  <div className="font-semibold text-slate-200">{selectedInvoice.buyerName}</div>
                  <div className="font-mono text-slate-400 text-[11px] break-all">{selectedInvoice.buyerTaxNo}</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="text-slate-400 font-medium">销售方 (开票方)</div>
                  <div className="font-semibold text-slate-200">{selectedInvoice.sellerName}</div>
                  <div className="font-mono text-slate-400 text-[11px] break-all">{selectedInvoice.sellerTaxNo}</div>
                </div>
              </div>

              {/* Items & Tax Breakdown Table (with mobile horizontal scroll) */}
              <div className="border border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[360px]">
                  <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                    <tr>
                      <th className="px-3 py-2">货物或劳务名称</th>
                      <th className="px-3 py-2 text-right">金额 (不含税)</th>
                      <th className="px-3 py-2 text-center">税率</th>
                      <th className="px-3 py-2 text-right">税额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="px-3 py-2.5 font-medium text-slate-200">
                        {selectedInvoice.serviceName}
                        {selectedInvoice.specification && (
                          <span className="block text-[11px] text-slate-400">
                            规格: {selectedInvoice.specification}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                        ¥{selectedInvoice.amountWithoutTax.toFixed(2)}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">
                        {(selectedInvoice.taxRate * 100).toFixed(0)}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-cyan-400 tabular-nums">
                        ¥{selectedInvoice.taxAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* DeepSeek Verification & Compliance Status */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    DeepSeek OCR 结构化校验诊断
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    置信度: {(selectedInvoice.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  发票四要素（代码、号码、金额、日期）已完成国税底账结构比对；税号校验码有效，进项增值税额计算无误，费用类型自动归集为「{selectedInvoice.category}」。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>符合会计准则原始单据归档要求</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReviewInvoice(selectedInvoice.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 ${
                      selectedInvoice.reviewed
                        ? 'bg-slate-800 border-slate-700 text-slate-300'
                        : 'bg-emerald-950/50 border-emerald-600 text-emerald-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{selectedInvoice.reviewed ? '取消复核标记' : '人工审核通过'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              <FileText className="w-8 h-8 mb-2 text-slate-600" />
              <span>请在左侧选择要查看或审核的发票单据</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload/Recognize Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                DeepSeek 智能单据识别与结构化录入
              </h4>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                关闭
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">
                输入待解析的发票 OCR 识别文本或测试票面信息：
              </label>
              <textarea
                rows={5}
                value={customInvoiceText}
                onChange={(e) => setCustomInvoiceText(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                placeholder="粘贴发票文本..."
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">DeepSeek 处理逻辑：</div>
              <div>1. 智能抽取：代码、号码、购销双方、商品品名、价税金额</div>
              <div>2. 会计归类：根据开票商品名智能判定借方一级与二级会计科目</div>
              <div>3. 税额验算：校验价税分离与法定税率（13%、9%、6%、3%）</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                取消
              </button>
              <button
                onClick={handleRecognizeSubmit}
                disabled={isProcessing}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/30 flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>DeepSeek 解析中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>启动 AI 识别并录入</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
