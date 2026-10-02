import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface OverviewHeroProps {
  onQuickFilterDemand?: (demand: string) => void;
}

export const OverviewHero: React.FC<OverviewHeroProps> = ({ onQuickFilterDemand }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const commonDemands = [
    '发票识别与验真',
    '会计凭证自动生成',
    '银行流水智能对账',
    '财务报表一键生成',
    '税务筹划与合规分析',
    '异常账项自动诊断'
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Main Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI 驱动会计工作流新范式</span>
            <span>·</span>
            <span className="font-mono">DeepSeek 赋能</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            如何建立 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">AI 工作流</span> 来提升会计工作效率？
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-white font-semibold">AI 不是取代会计</strong>，而是帮你把重复、繁琐、耗时的工作自动化，让你把更多时间用在分析、决策和高价值的工作上。
          </p>
        </div>

        {/* Right side badge card */}
        <div className="p-4 bg-slate-950/70 border border-cyan-800/40 rounded-xl space-y-1.5 shrink-0 self-stretch lg:self-auto flex flex-col justify-center">
          <div className="text-xs text-slate-400">核心目标</div>
          <div className="text-base font-bold text-cyan-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            用 AI 搭建你的专属工作流
          </div>
          <div className="text-xs text-emerald-400 font-medium">让会计全流程效率翻倍！</div>
        </div>
      </div>

      {/* Section 1: 评估与明确需求 */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">
              1
            </div>
            <h2 className="text-sm font-bold text-white">
              评估与明确需求：先梳理目前的会计工作流程，找出可以用 AI 优化的环节
            </h2>
          </div>
          <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <span>{isExpanded ? '收起指导' : '展开方法论'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-300">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>列出日常工作</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                梳理凭证录入、银行对账、期末报表、发票处理、税务申报等日常高频事务。
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>找出痛点环节</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                聚焦耗时长、机械重复、易产生手工输入错误的痛点任务，作为 AI 首批改造点。
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>明确核心目标</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                是追求录入提效、减少借贷不平错误，还是深入挖掘经营数据进行税务筹划？
              </p>
            </div>
          </div>
        )}

        {/* Quick Demand Tags */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/40 text-xs">
          <span className="text-slate-400 font-medium">常见落地需求：</span>
          {commonDemands.map((demand, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-300 text-[11px]"
            >
              {demand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
