import React, { useState } from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Cpu, 
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Shield
} from 'lucide-react';
import { FinancialInsight } from '../types/accounting';
import { DeepSeekConfig } from '../types/deepseek';

interface AnalysisViewerProps {
  insights: FinancialInsight[];
  onRefreshInsights: () => void;
  deepSeekConfig: DeepSeekConfig;
  isProcessing: boolean;
}

export const AnalysisViewer: React.FC<AnalysisViewerProps> = ({
  insights,
  onRefreshInsights,
  deepSeekConfig,
  isProcessing
}) => {
  const [showReasoning, setShowReasoning] = useState(true);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'risk':
        return { label: '合规与审计风险', color: 'text-rose-400 bg-rose-950/40 border-rose-800/60' };
      case 'tax':
        return { label: '税务筹划与加计扣除', color: 'text-amber-400 bg-amber-950/40 border-amber-800/60' };
      case 'cost_control':
        return { label: '成本控制与预算', color: 'text-blue-400 bg-blue-950/40 border-blue-800/60' };
      case 'efficiency':
        return { label: 'AI 工作流效率评估', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60' };
      default:
        return { label: '财务分析', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60' };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white">步骤 5. 财务分析、异常诊断与决策建议</h3>
              <span className="text-xs font-mono text-cyan-400">工具：DeepSeek (CFO 决策级)</span>
            </div>
            <p className="text-xs text-slate-400">
              通过 DeepSeek 深度分析经营指标与分录数据，自动挖掘税务优化点、未达账风险与节支空间
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshInsights}
          disabled={isProcessing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/20 transition-colors disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? 'DeepSeek 深度研判中...' : '重新生成 CFO 诊断建议'}</span>
        </button>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            自动化节约工时比率
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            85.6%
          </div>
          <span className="text-[11px] text-slate-400">单笔记账时间从 8min 降至 12s</span>
        </div>

        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
            研发费用加计扣除节税
          </span>
          <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
            ¥17,250.00
          </div>
          <span className="text-[11px] text-slate-400">政策加计扣除额 ¥115,000.00</span>
        </div>

        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            待处置合规风险项
          </span>
          <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
            1 笔
          </div>
          <span className="text-[11px] text-slate-400">跨期未开票入账电汇款项</span>
        </div>
      </div>

      {/* DeepSeek-R1 Chain of Thought Reasoning Panel */}
      <div className="p-3.5 bg-purple-950/20 border border-purple-900/50 rounded-xl space-y-2.5">
        <div 
          onClick={() => setShowReasoning(!showReasoning)}
          className="flex items-center justify-between cursor-pointer select-none min-h-[36px]"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs font-semibold text-purple-200">
              DeepSeek-R1 深度思考推演链 (Reasoning Content)
            </span>
            <span className="text-[10px] bg-purple-900/60 text-purple-300 border border-purple-700/60 px-1.5 py-0.5 rounded font-mono shrink-0">
              thinking mode
            </span>
          </div>
          <button 
            type="button"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0"
          >
            <span>{showReasoning ? '收起思考' : '展开推演'}</span>
            {showReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showReasoning && (
          <div className="p-3 bg-slate-950/80 rounded-lg border border-purple-950/80 font-mono text-xs text-purple-200/90 leading-relaxed whitespace-pre-line">
            {`> 思考：针对北京智算星辰科技有限公司2026年9月会计凭证、银行对账单及利润表进行穿透式审计。
> 1. 增值税加计扣除考量：本期进项发票涵盖云服务器租赁（6%税率）与芯片物料（13%税率），符合《企业所得税研发费用加计扣除政策》，确认加计扣除基数 ¥115,000.00，节税收益明显。
> 2. 银行未达账项排查：发现建设银行账户存在一笔15.8万元电汇入账，但销售部门尚未开具增值税发票，存在跨期收入与增值税滞纳金风险。
> 3. 经营效率评估：当前5步工作流全部由 DeepSeek 自动化链路闭环，相较传统手工记账减少 85.6% 人工复核耗时，借贷试算平衡率达到 100%。`}
          </div>
        )}

        {/* DeepSeek API Cache & Performance Telemetry */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-purple-950/80 font-mono gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
              提示词缓存命中 (Cache Hit): 512 tokens (优惠 90%)
            </span>
            <span>·</span>
            <span>模型: {deepSeekConfig.model}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span>响应延迟: ~640ms</span>
            <span>·</span>
            <span className="text-cyan-400">严格 JSON 对齐</span>
          </div>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-3 pt-1">
        {insights.map((item, idx) => {
          const badge = getCategoryBadge(item.category);
          return (
            <div
              key={idx}
              className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${badge.color}`}>
                    {badge.label}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-100">{item.title}</h4>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-medium">
                  {item.impactMetrics}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="p-2.5 bg-cyan-950/20 border border-cyan-900/30 rounded-lg text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-cyan-200/90 leading-relaxed">
                  <span className="font-semibold text-cyan-300">优化落地建议：</span>
                  {item.recommendation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
