import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  UploadCloud, 
  Cpu, 
  FileCheck2, 
  ShieldAlert, 
  Save, 
  Check, 
  Zap,
  Bot
} from 'lucide-react';
import { DeepSeekConfig } from '../types/deepseek';

interface WorkflowDesignerProps {
  deepSeekConfig: DeepSeekConfig;
  onOpenSettings: () => void;
}

export const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({
  deepSeekConfig,
  onOpenSettings
}) => {
  const [triggerSource, setTriggerSource] = useState('invoice_upload');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(90);
  const [exportFormat, setExportFormat] = useState('standard_voucher');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            2. 设计 AI 会计工作流 (触发 → 处理 → 输出)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            将传统会计业务拆解为自动化事件驱动链路，深度定制 DeepSeek 规则与人工审核把关节点
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/30 transition-colors"
        >
          {savedNotice ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
          <span>{savedNotice ? '配置已保存生效' : '保存工作流规则'}</span>
        </button>
      </div>

      {/* 3-Stage Workflow Architecture Diagram (触发 -> 处理 -> 输出) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Stage 1: 触发 (Trigger) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 font-semibold">第一阶段</span>
              <h3 className="text-sm font-bold text-white">触发 (数据/文件输入)</h3>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            定义进入自动化工作流的业务单据来源与摄入模式。
          </p>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-medium">触发方式选择：</label>
            <div className="space-y-1.5">
              {[
                { id: 'invoice_upload', title: '发票原图拍照/扫描件拖拽上传 (Vision API)', desc: '支持 PNG, JPG, WebP 原图直传 DeepSeek 视觉模型' },
                { id: 'bank_sync', title: '银行银企直联/网银流水导入', desc: '支持 Excel, CSV, XML 银行对账明细' },
                { id: 'scheduled', title: '每月末定时自动结账任务', desc: '每月最后一日 23:00 自动触发试算平衡' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    triggerSource === item.id
                      ? 'bg-slate-800/90 border-cyan-500 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="trigger"
                    checked={triggerSource === item.id}
                    onChange={() => setTriggerSource(item.id)}
                    className="mt-0.5 accent-cyan-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Stage 2: 处理 (Process) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-purple-400 font-semibold">第二阶段</span>
              <h3 className="text-sm font-bold text-white">处理 (AI 分析与执行)</h3>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            基于 DeepSeek 最新 API 规范：支持 Vision 视觉直读、JSON Object 严格输出与 Context Caching 提示词缓存降本。
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">当前 AI 核心引擎</div>
                <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
                  <span>{deepSeekConfig.model}</span>
                  <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1 rounded text-[10px]">
                    缓存优惠 90%
                  </span>
                </div>
              </div>
              <button
                onClick={onOpenSettings}
                className="px-2.5 py-1 text-[11px] text-cyan-300 hover:text-white bg-slate-800 rounded border border-slate-700"
              >
                调整参数
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>OCR 与凭证置信度阈值</span>
                <span className="font-mono text-cyan-400">{aiConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">低于此阈值的发票将强制提醒人工重点抽检</span>
            </div>

            <div className="pt-1 space-y-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded accent-cyan-500"
                />
                <span>识别成功后自动流转至下一处理节点</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireHumanApproval}
                  onChange={(e) => setRequireHumanApproval(e.target.checked)}
                  className="rounded accent-cyan-500"
                />
                <span className="text-amber-300 font-medium">过账前必须由主管会计人工复核签章</span>
              </label>
            </div>
          </div>
        </div>

        {/* Stage 3: 输出 (Output) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">第三阶段</span>
              <h3 className="text-sm font-bold text-white">输出 (结果/应用交付)</h3>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            生成符合用友/金蝶/浪潮等主流软件标准的数据格式与审计底稿。
          </p>

          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-medium">输出交付物形态：</label>
            <div className="space-y-1.5">
              {[
                { id: 'standard_voucher', title: '标准用友/金蝶记账凭证 XML/Excel', desc: '符合国标财务接口 GB/T 19581-2004' },
                { id: 'reconciliation_sheet', title: '银行存款余额调节表 (PDF/Excel)', desc: '含差异清单与电子回单匹配附件' },
                { id: 'cfo_dashboard', title: '资产负债表与 CFO 经营决策简报', desc: '含异常风险警示与节税筹划建议' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    exportFormat === item.id
                      ? 'bg-slate-800/90 border-cyan-500 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="export"
                    checked={exportFormat === item.id}
                    onChange={() => setExportFormat(item.id)}
                    className="mt-0.5 accent-cyan-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Tools Combination Matrix (Section 3: 选择合适的 AI 工具) */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              3. 选择合适的 AI 工具组合与技术选型
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              根据业务场景选择最适工具，或多工具组合联动以达到最高的准确率与执行效率
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
            <div className="font-semibold text-cyan-300">DeepSeek (大语言模型)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              负责复杂凭证推导、借贷复式记账、税法合规判断、会计准则解释与经营数据洞察。
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
            <div className="font-semibold text-emerald-300">OCR 工具 (票据识别)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              负责发票代码、发票号码、税率、金额等文字图象精准切片与版面版式分析提取。
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
            <div className="font-semibold text-purple-300">RPA 工具 (自动化流程)</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              负责银行网银批量对账流水下载、国税申报网页自动填报、跨系统重复数据搬运。
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
            <div className="font-semibold text-amber-300">财务软件 AI 原生功能</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              负责科目期末损益结转、总账试算平衡表出具、法定会计账簿与凭证防篡改留痕。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
