import React from 'react';
import { 
  Cpu, 
  Key, 
  SlidersHorizontal, 
  ShieldCheck, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { DeepSeekConfig } from '../types/deepseek';

interface HeaderProps {
  activeTab: 'workflow' | 'scenarios' | 'designer' | 'compliance';
  setActiveTab: (tab: 'workflow' | 'scenarios' | 'designer' | 'compliance') => void;
  deepSeekConfig: DeepSeekConfig;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  isExecutingAll: boolean;
  onRunFullWorkflow: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  deepSeekConfig,
  onOpenSettings,
  onOpenHelp,
  isExecutingAll,
  onRunFullWorkflow
}) => {
  const hasKey = Boolean(deepSeekConfig.apiKey && deepSeekConfig.apiKey.trim().length > 0);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20 shrink-0">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
            <span className="hidden sm:inline">AI 会计自动化工作流</span>
            <span className="sm:hidden truncate">AI 会计工作流</span>
            <span className="text-[10px] sm:text-xs font-normal text-cyan-400 font-mono shrink-0">DeepSeek</span>
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Desktop only, mobile uses MobileBottomNav) */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('workflow')}
          className={`transition-colors pb-0.5 whitespace-nowrap ${
            activeTab === 'workflow'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          核心工作流 (5步示例)
        </button>
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`transition-colors pb-0.5 whitespace-nowrap ${
            activeTab === 'scenarios'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          应用场景与数据集
        </button>
        <button
          onClick={() => setActiveTab('designer')}
          className={`transition-colors pb-0.5 whitespace-nowrap ${
            activeTab === 'designer'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          流程编排器 (触发·处理·输出)
        </button>
        <button
          onClick={() => setActiveTab('compliance')}
          className={`transition-colors pb-0.5 whitespace-nowrap ${
            activeTab === 'compliance'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
              : 'hover:text-slate-200'
          }`}
        >
          合规自查与复核准则
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* DeepSeek API Key Trigger */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[38px] text-xs font-medium rounded-lg border transition-all ${
            hasKey
              ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/50'
              : 'bg-amber-950/30 border-amber-700/50 text-amber-300 hover:bg-amber-900/40'
          }`}
          title={hasKey ? 'DeepSeek 在线模式' : '点击配置 DeepSeek API Key'}
        >
          <Key className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">
            {hasKey ? `DeepSeek: ${deepSeekConfig.model}` : '设置 DeepSeek Key'}
          </span>
          <span className="sm:hidden text-[11px] whitespace-nowrap">
            {hasKey ? 'Key 已配' : '配 Key'}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        </button>

        {/* 帮助指南 */}
        <button
          onClick={onOpenHelp}
          className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="查看会计 AI 工作流搭建指南"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* 一键全流程执行 CTA */}
        <button
          onClick={onRunFullWorkflow}
          disabled={isExecutingAll}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 min-h-[38px] text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-sm shadow-cyan-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isExecutingAll ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isExecutingAll ? '工作流流转中...' : '一键执行完整工作流'}</span>
          <span className="sm:hidden">{isExecutingAll ? '执行中...' : '一键执行'}</span>
        </button>
      </div>
    </header>
  );
};
