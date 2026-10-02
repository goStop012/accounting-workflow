import React from 'react';
import { 
  Receipt, 
  Building2, 
  CalendarDays, 
  FileCheck2, 
  ArrowRight, 
  Sparkles, 
  Layers,
  Check
} from 'lucide-react';
import { ScenarioType } from '../types/accounting';

interface ScenarioSelectorProps {
  currentScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  currentScenario,
  onSelectScenario
}) => {
  const scenarios: Array<{
    id: ScenarioType;
    title: string;
    icon: React.ReactNode;
    subtitle: string;
    points: string[];
    deepSeekRole: string;
    presetDataSummary: string;
  }> = [
    {
      id: 'invoice_processing',
      title: '场景一：发票处理',
      icon: <Receipt className="w-5 h-5 text-cyan-400" />,
      subtitle: '自动识别发票信息 · 生成凭证并分类',
      points: [
        '增值税专用发票、普通发票、报销单 OCR 解析',
        '自动判定进项税率 (13%、9%、6%) 与抵扣合规性',
        '生成标准借贷复式记账凭证并自动过账'
      ],
      deepSeekRole: 'DeepSeek-V3 提取四要素 + CPA 分录自动生成',
      presetDataSummary: '包含云服务器租用、芯片元器件采购、差旅费等 4 张企业典型发票'
    },
    {
      id: 'bank_reconciliation',
      title: '场景二：银行对账',
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
      subtitle: '自动匹配流水 · 生成对账报告与调节表',
      points: [
        '银行网银对账单与企业银行存款日记账智能匹配',
        '自动甄别未达账项（客户跨期汇款、银行扣取网银年费）',
        '出具符合审计准则的《银行存款余额调节表》'
      ],
      deepSeekRole: 'DeepSeek 识别未达账项成因并生成入账方案',
      presetDataSummary: '招商银行基本户对账流水 4 笔，期末余额 ¥742,100.00，含 2 项未达账'
    },
    {
      id: 'month_end_closing',
      title: '场景三：月度结账',
      icon: <CalendarDays className="w-5 h-5 text-purple-400" />,
      subtitle: '自动汇总数据 · 生成资产负债表与利润表',
      points: [
        '固定资产折旧计提、无形资产摊销核算',
        '结转损益类科目至「本年利润」，科目借贷平衡校验',
        '自动出具资产负债表与利润表并校验表内勾稽关系'
      ],
      deepSeekRole: 'DeepSeek 校验报表勾稽平衡与损益结转逻辑',
      presetDataSummary: '资产总计 ¥1,876,100.00，营业收入 ¥860,000.00，净利润 ¥224,230.00'
    },
    {
      id: 'tax_filing',
      title: '场景四：税务申报',
      icon: <FileCheck2 className="w-5 h-5 text-amber-400" />,
      subtitle: '计算应纳税额 · 生成增值税与所得税申报表',
      points: [
        '自动归集当期增值税销项税额与进项税额',
        '测算企业所得税研发费用 100% 加计扣除优惠',
        '合规自查排查进项税额转出与跨期收入申报风险'
      ],
      deepSeekRole: 'DeepSeek 自动核算法定税款与小微/高新税收优惠政策',
      presetDataSummary: '增值税进项抵扣 ¥5,374.72，研发加计扣除 ¥115,000.00 节税 ¥17,250.00'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            5. 实际应用场景 (不同业务场景下的工作流示例)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            切换不同会计业务场景，体验针对性深度调优的 DeepSeek 自动化链路与预置真实企业数据
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => {
          const isSelected = sc.id === currentScenario;
          return (
            <div
              key={sc.id}
              onClick={() => onSelectScenario(sc.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      {sc.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{sc.title}</h3>
                      <p className="text-xs text-slate-400">{sc.subtitle}</p>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="flex items-center gap-1 text-xs text-cyan-400 font-medium bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800">
                      <Check className="w-3.5 h-3.5" />
                      当前选中
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 hover:text-slate-300">
                      点击切换
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5 my-3.5 text-xs text-slate-300">
                  {sc.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{sc.deepSeekRole}</span>
                </div>
                <div className="text-slate-400">
                  预置数据: {sc.presetDataSummary}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
