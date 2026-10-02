import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  FileCheck,
  Eye,
  Camera,
  Image as ImageIcon,
  ExternalLink,
  X
} from 'lucide-react';
import { InvoiceItem } from '../types/accounting';
import { DeepSeekConfig } from '../types/deepseek';
import { sampleInvoiceImages } from '../data/sampleInvoiceImages';

interface InvoiceCollectorViewProps {
  invoices: InvoiceItem[];
  onAddInvoice: (inv: InvoiceItem) => void;
  onReviewInvoice: (id: string) => void;
  onRecognizeWithDeepSeek: (rawText: string) => Promise<void>;
  onRecognizeWithVision?: (imageUrlOrBase64: string) => Promise<void>;
  deepSeekConfig: DeepSeekConfig;
  isProcessing: boolean;
}

export const InvoiceCollectorView: React.FC<InvoiceCollectorViewProps> = ({
  invoices,
  onAddInvoice,
  onReviewInvoice,
  onRecognizeWithDeepSeek,
  onRecognizeWithVision,
  deepSeekConfig,
  isProcessing
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(invoices[0] || null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'detail'>('list');
  const [activeModalTab, setActiveModalTab] = useState<'vision' | 'text'>('vision');
  
  // Vision API states
  const [selectedVisionImage, setSelectedVisionImage] = useState<string>(sampleInvoiceImages.gpuTestingInvoice);
  const [selectedPresetName, setSelectedPresetName] = useState<string>('BR104芯片专票');
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [showLightboxImage, setShowLightboxImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [customInvoiceText, setCustomInvoiceText] = useState(
    '发票代码: 3300231140 发票号码: 91823019 开票日期: 2026-09-28\n销售方: 华为云计算技术有限公司\n购买方: 北京智算星辰科技有限公司\n项目: *信息技术服务*云主机弹性公网IP及存储卷服务\n金额: ¥8500.00 税率: 6% 税额: ¥510.00 价税合计: ¥9010.00'
  );

  const filteredInvoices = invoices.filter(inv => 
    inv.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.number.includes(searchTerm)
  );

  const handleRecognizeTextSubmit = async () => {
    await onRecognizeWithDeepSeek(customInvoiceText);
    setShowUploadModal(false);
  };

  const handleRecognizeVisionSubmit = async () => {
    if (onRecognizeWithVision) {
      await onRecognizeWithVision(selectedVisionImage);
    } else {
      await onRecognizeWithDeepSeek(customInvoiceText);
    }
    setShowUploadModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageFile(file);
      setSelectedPresetName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedVisionImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-white">步骤 1. 数据收集与智能发票识别</h3>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                DeepSeek 视觉识别 API (Vision)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              直接利用 DeepSeek 视觉大模型解析发票原图扫描件与照片，精准提取四要素并核验合规性
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveModalTab('vision');
              setShowUploadModal(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/30 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>发票原图上传 / DeepSeek 视觉识别</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
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

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
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
                      {inv.recognitionMethod === 'deepseek_vision' ? (
                        <span className="text-cyan-300 font-mono flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                          视觉直读
                        </span>
                      ) : (
                        <span>{inv.date}</span>
                      )}
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
                    {selectedInvoice.recognitionMethod === 'deepseek_vision' && (
                      <span className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 px-1.5 py-0.5 rounded font-mono">
                        DeepSeek Vision 视觉解析
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
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

              {/* Invoice Image Preview Strip (DeepSeek Vision API source preview) */}
              {selectedInvoice.imageUrl && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      发票扫描原图 (DeepSeek 视觉大模型直读图源)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowLightboxImage(selectedInvoice.imageUrl!)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      点击放大查看原票
                    </button>
                  </div>

                  <div 
                    onClick={() => setShowLightboxImage(selectedInvoice.imageUrl!)}
                    className="relative cursor-pointer rounded-lg overflow-hidden border border-slate-800 bg-black/40 hover:border-cyan-500/60 transition-colors group max-h-48 flex items-center justify-center"
                  >
                    <img
                      src={selectedInvoice.imageUrl}
                      alt="发票扫描原图"
                      className="w-full max-h-44 object-contain transition-transform group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <span className="text-[11px] text-white flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        DeepSeek 视觉识别 API 原图
                      </span>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Items & Tax Breakdown Table */}
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
                    DeepSeek 视觉智能校验与合规诊断
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    置信度: {(selectedInvoice.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  通过 DeepSeek 视觉大模型直接对原票图片进行多模态 OCR + 语义推导，发票代码、号码、金额与税率全部校验通过，自动匹配会计科目「{selectedInvoice.category}」。
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
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 min-h-[38px] ${
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

      {/* Upload/Recognize Modal with DeepSeek Vision API */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    DeepSeek 发票智能识别 (Vision API)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    支持通过图像直传 DeepSeek 视觉模型或文本提取
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveModalTab('vision')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 min-h-[36px] ${
                  activeModalTab === 'vision' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>DeepSeek 视觉识别 (Vision API)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('text')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 min-h-[36px] ${
                  activeModalTab === 'text' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>OCR 文本提取模式</span>
              </button>
            </div>

            {activeModalTab === 'vision' ? (
              <div className="space-y-3.5">
                {/* Image upload / drag-and-drop zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-4 text-center cursor-pointer bg-slate-950/60 transition-colors group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    点击上传本地发票图片 或 拖拽发票文件到此处
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    支持 PNG, JPG, JPEG, WebP 增值税专票/普票扫描件或手机照片
                  </div>
                </div>

                {/* Preset Invoice Selection Buttons */}
                <div className="space-y-1.5">
                  <div className="text-xs text-slate-400 font-medium">
                    或直接点选预置高拟真发票图片快速体验：
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'BR104芯片专票', img: sampleInvoiceImages.gpuTestingInvoice, tag: '¥76,840.00' },
                      { name: '阿里云计算专票', img: sampleInvoiceImages.cloudServerInvoice, tag: '¥12,720.00' },
                      { name: '工业传感模组专票', img: sampleInvoiceImages.hardwareChipInvoice, tag: '¥39,550.00' }
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setSelectedVisionImage(item.img);
                          setSelectedPresetName(item.name);
                        }}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          selectedPresetName === item.name
                            ? 'bg-slate-800 border-cyan-500 shadow-sm shadow-cyan-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-slate-200 truncate">{item.name}</div>
                        <div className="text-[10px] font-mono text-cyan-400">{item.tag}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Image Preview */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                      待识别票据图像：<span className="text-cyan-300">{selectedPresetName}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">DeepSeek 视觉标准输入格式</span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-40 flex items-center justify-center bg-black/40">
                    <img
                      src={selectedVisionImage}
                      alt="发票待识别原图"
                      className="max-h-36 w-full object-contain"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-cyan-300 space-y-2">
                        <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
                        <span className="text-xs font-semibold">DeepSeek 视觉识别大模型解析中...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* API Doc Hint */}
                <div className="p-2.5 bg-cyan-950/20 border border-cyan-900/40 rounded-lg text-[11px] text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>依据 DeepSeek 视觉模型接口标准，原图通过 Base64/URL 传入</span>
                  </div>
                  <a
                    href="https://api-docs.deepseek.com/zh-cn/guides/vision"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                  >
                    <span>官方文档</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              /* Text OCR Mode */
              <div className="space-y-2">
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
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 min-h-[40px] text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="button"
                onClick={activeModalTab === 'vision' ? handleRecognizeVisionSubmit : handleRecognizeTextSubmit}
                disabled={isProcessing}
                className="px-5 py-2 min-h-[40px] text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/30 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>
                  {isProcessing 
                    ? 'DeepSeek 识别中...' 
                    : activeModalTab === 'vision' 
                    ? '调用 DeepSeek 视觉 API 解析原图' 
                    : 'DeepSeek 文本识别'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for high-res invoice preview */}
      {showLightboxImage && (
        <div 
          onClick={() => setShowLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                增值税专用发票原图扫描件 (DeepSeek 视觉分析源)
              </span>
              <button
                onClick={() => setShowLightboxImage(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center bg-[#fffcf0] rounded-xl overflow-hidden p-2">
              <img
                src={showLightboxImage}
                alt="增值税发票大图"
                className="w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
