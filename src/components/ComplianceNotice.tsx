import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  GitFork, 
  GraduationCap, 
  ArrowRight, 
  Sparkles,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const ComplianceNotice: React.FC = () => {
  const notices = [
    {
      icon: <Lock className="w-5 h-5 text-cyan-400" />,
      title: '确保数据安全与合规，避免敏感信息泄露',
      desc: '在调用任何公有云 AI 模型前，建立企业级隐私过滤器与数据脱敏规则（对客户名称、员工身份证号、具体银行卡号等进行加密掩码处理），严格恪守《数据安全法》与企业商业秘密保护制度。'
    },
    {
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      title: '先从简单、重复的任务开始，逐步扩展',
      desc: '切勿盲目求全求大。建议以发票 OCR 自动验真、常规差旅报销凭证生成等高频标准流程切入，沉淀最佳实践与 prompt 规则后，再逐步向复杂的银行未达账勾兑与财务报表分析延伸。'
    },
    {
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      title: '对 AI 生成的结果必须坚持人工复核 (Human-in-the-loop)',
      desc: 'AI 不是取代会计，而是提升效率的超级助手。关键会计科目划分、大额跨期支出、期末税费核算等必须设立严谨的主管会计复核岗与双人签章机制，确保凭证与报表真实合规、具有法律效力。'
    },
    {
      icon: <GitFork className="w-5 h-5 text-purple-400" />,
      title: '结合现有财务软件和工作习惯，定制化流程',
      desc: '将 AI 工作流输出无缝对接到企业现有的金蝶、用友、SAP 或 Excel 报表系统中，保持会计人员既有的做账与归档习惯，减少认知切换与组织协同摩擦。'
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
      title: '不断学习和尝试新的 AI 工具和功能',
      desc: '关注 DeepSeek、大模型推理以及财税领域专业微调模型的最新演进，持续迭代优化会计提示词与工作流触发条件，让企业财务始终保持敏捷与前沿竞争力。'
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            6. 会计 AI 工作流落地注意事项与合规准则
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            严守会计法与财税审计红线，实现技术赋能与合规风控的有机统一
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((item, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border bg-slate-900 border-slate-800 space-y-2.5 ${
              idx === 0 ? 'md:col-span-2 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/20' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                {item.icon}
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-1">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Summary Footer: 明确需求 -> 设计流程 -> 选择工具 -> 落地应用 -> 持续优化 */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-cyan-800/50 rounded-xl space-y-3 shadow-lg shadow-cyan-950/20">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              总结：打造高效专属会计工作流的 5 步实施闭环
            </span>
          </div>
          <span className="text-xs font-semibold text-cyan-400">
            用 AI 赋能，让会计工作更轻松、更准确、更有价值！
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
          {[
            { step: '01', title: '明确需求', desc: '梳理繁琐易错任务' },
            { step: '02', title: '设计流程', desc: '拆解触发·处理·输出' },
            { step: '03', title: '选择工具', desc: 'DeepSeek + OCR + RPA' },
            { step: '04', title: '落地应用', desc: '小步快跑·人工把关' },
            { step: '05', title: '持续优化', desc: '追踪指标·迭代提示词' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center space-y-1 hover:border-cyan-500/50 transition-colors"
            >
              <div className="font-mono text-cyan-400 text-[11px] font-semibold">{item.step}</div>
              <div className="font-bold text-slate-100">{item.title}</div>
              <div className="text-[11px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
