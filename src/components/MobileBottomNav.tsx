import React from 'react';
import { 
  GitBranch, 
  Layers, 
  Sliders, 
  ShieldCheck
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'workflow' | 'scenarios' | 'designer' | 'compliance';
  setActiveTab: (tab: 'workflow' | 'scenarios' | 'designer' | 'compliance') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs = [
    {
      id: 'workflow' as const,
      label: '5步工作流',
      icon: <GitBranch className="w-5 h-5" />
    },
    {
      id: 'scenarios' as const,
      label: '业务场景',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'designer' as const,
      label: '流程编排',
      icon: <Sliders className="w-5 h-5" />
    },
    {
      id: 'compliance' as const,
      label: '合规准则',
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  return (
    <nav 
      aria-label="移动端底部导航"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 shadow-lg"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-4 items-center h-14">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all rounded-lg ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`transition-transform ${isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] tracking-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
