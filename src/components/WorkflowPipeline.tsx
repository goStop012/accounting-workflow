import React from 'react';
import { 
  FileText, 
  BookOpen, 
  Scale, 
  BarChart3, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Play, 
  RefreshCw,
  Eye,
  Bot
} from 'lucide-react';
import { PipelineStepMeta, PipelineStepId } from '../types/workflow';

interface WorkflowPipelineProps {
  steps: PipelineStepMeta[];
  currentStepId: PipelineStepId;
  onSelectStep: (stepId: PipelineStepId) => void;
  onExecuteStep: (stepId: PipelineStepId) => void;
  isExecutingAll: boolean;
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({
  steps,
  currentStepId,
  onSelectStep,
  onExecuteStep,
  isExecutingAll
}) => {
  const getStepIcon = (id: PipelineStepId, className: string = 'w-5 h-5') => {
    switch (id) {
      case 'step1_collection':
        return <FileText className={className} />;
      case 'step2_voucher':
        return <BookOpen className={className} />;
      case 'step3_reconciliation':
        return <Scale className={className} />;
      case 'step4_report':
        return <BarChart3 className={className} />;
      case 'step5_analysis':
        return <Lightbulb className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      {/* Pipeline Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">4. 建立具体的 AI 会计工作流示例</h2>
            <span className="text-xs text-slate-400">· 5步自动化闭环</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            将传统会计繁琐易错环节转化为标准化 AI 协同链路，全流程支持人工复核与修改
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            处理中
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            已完成
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            待处理
          </span>
        </div>
      </div>

      {/* 5-Step Pipeline: Mobile Horizontal Snap Scroller / Desktop 5-Col Grid */}
      <div className="flex md:grid md:grid-cols-5 gap-3.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scroll-smooth snap-x snap-mandatory -mx-1 px-1">
        {steps.map((step, idx) => {
          const isSelected = step.id === currentStepId;
          const isRunning = step.status === 'running';
          const isDone = step.status === 'completed';

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`group relative flex flex-col p-4 rounded-xl border transition-all cursor-pointer min-w-[260px] sm:min-w-[280px] md:min-w-0 snap-start shrink-0 md:shrink ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Step Number & Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-cyan-400">
                  {step.stepNumber}. {step.title}
                </span>
                <div>
                  {isRunning && (
                    <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  )}
                  {isDone && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                  {!isRunning && !isDone && (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Icon & Subtitle */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className={`p-2 rounded-lg border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : isDone
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {getStepIcon(step.id)}
                </div>
                <div className="text-xs font-medium text-slate-200">
                  {step.subtitle}
                </div>
              </div>

              {/* Tasks description */}
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">
                {step.outputSummary}
              </p>

              {/* Assigned Tools */}
              <div className="mt-auto pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Bot className="w-3 h-3 text-cyan-400" />
                    {step.assignedTools.join(' + ')}
                  </span>
                </div>
              </div>

              {/* Step Action Buttons */}
              <div className="mt-3 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExecuteStep(step.id);
                  }}
                  disabled={isRunning || isExecutingAll}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                    isDone
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>处理中...</span>
                    </>
                  ) : isDone ? (
                    <>
                      <RefreshCw className="w-3 h-3" />
                      <span>重新执行</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>执行此步</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStep(step.id);
                  }}
                  className="px-2 py-1.5 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded-md"
                  title="查看详情"
                >
                  <Eye className="w-3 h-3" />
                </button>
              </div>

              {/* Desktop connector arrow (between steps) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-600 pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
