/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewHero } from './components/OverviewHero';
import { WorkflowPipeline } from './components/WorkflowPipeline';
import { InvoiceCollectorView } from './components/InvoiceCollectorView';
import { VoucherDetailViewer } from './components/VoucherDetailViewer';
import { ReconciliationViewer } from './components/ReconciliationViewer';
import { ReportViewer } from './components/ReportViewer';
import { AnalysisViewer } from './components/AnalysisViewer';
import { ScenarioSelector } from './components/ScenarioSelector';
import { WorkflowDesigner } from './components/WorkflowDesigner';
import { ComplianceNotice } from './components/ComplianceNotice';
import { DeepSeekModal } from './components/DeepSeekModal';
import { MobileBottomNav } from './components/MobileBottomNav';

import { 
  InvoiceItem, 
  AccountingVoucher, 
  BankTransaction, 
  BankReconciliationReport, 
  FinancialReportsData, 
  FinancialInsight, 
  ScenarioType 
} from './types/accounting';
import { DeepSeekConfig } from './types/deepseek';
import { PipelineStepMeta, PipelineStepId } from './types/workflow';
import { 
  getStoredDeepSeekConfig, 
  aiRecognizeInvoice, 
  aiGenerateVoucher, 
  aiReconcileBankStatements, 
  aiGenerateFinancialInsights 
} from './services/deepseekClient';
import { 
  initialInvoices, 
  initialVouchers, 
  initialBankTransactions, 
  initialReconciliationReport, 
  initialFinancialReports, 
  initialInsights 
} from './data/mockAccountingData';

export default function App() {
  // Navigation & Config States
  const [activeTab, setActiveTab] = useState<'workflow' | 'scenarios' | 'designer' | 'compliance'>('workflow');
  const [deepSeekConfig, setDeepSeekConfig] = useState<DeepSeekConfig>(getStoredDeepSeekConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('invoice_processing');

  // Business Data States
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [vouchers, setVouchers] = useState<AccountingVoucher[]>(initialVouchers);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(initialBankTransactions);
  const [reconciliationReport, setReconciliationReport] = useState<BankReconciliationReport>(initialReconciliationReport);
  const [financialReports, setFinancialReports] = useState<FinancialReportsData>(initialFinancialReports);
  const [insights, setInsights] = useState<FinancialInsight[]>(initialInsights);

  // Workflow Pipeline Steps (Section 4 in Infographic)
  const [currentStepId, setCurrentStepId] = useState<PipelineStepId>('step1_collection');
  const [isExecutingAll, setIsExecutingAll] = useState(false);
  const [isProcessingStep, setIsProcessingStep] = useState(false);

  const initialSteps: PipelineStepMeta[] = [
    {
      id: 'step1_collection',
      stepNumber: 1,
      title: '收集数据',
      subtitle: '发票扫描/OCR 识别',
      assignedTools: ['OCR', 'DeepSeek-V3'],
      inputSummary: '增值税专用发票、普通发票及报销单据',
      outputSummary: '提取发票代码、号码、金额、税率等四要素并校验合规',
      status: 'completed',
      reviewedByHuman: true,
      logs: []
    },
    {
      id: 'step2_voucher',
      stepNumber: 2,
      title: '自动生成凭证',
      subtitle: '借贷分录/科目自动带出',
      assignedTools: ['DeepSeek', '财务软件'],
      inputSummary: '已校验发票票面信息与业务归类',
      outputSummary: '根据发票内容自动生成借贷复式记账分录，确保借贷平衡',
      status: 'completed',
      reviewedByHuman: true,
      logs: []
    },
    {
      id: 'step3_reconciliation',
      stepNumber: 3,
      title: '自动对账',
      subtitle: '匹配银行流水/差异提示',
      assignedTools: ['RPA', 'Excel', 'DeepSeek'],
      inputSummary: '银行对公网银流水与企业日记账',
      outputSummary: '自动勾兑并识别未达账项，生成银行存款余额调节表',
      status: 'completed',
      reviewedByHuman: false,
      logs: []
    },
    {
      id: 'step4_report',
      stepNumber: 4,
      title: '生成报表',
      subtitle: '自动汇总/负债利润表',
      assignedTools: ['DeepSeek', 'Excel'],
      inputSummary: '期末科目汇总数据与已过账凭证',
      outputSummary: '自动出具资产负债表与利润表，校验表内勾稽关系',
      status: 'completed',
      reviewedByHuman: true,
      logs: []
    },
    {
      id: 'step5_analysis',
      stepNumber: 5,
      title: '分析与建议',
      subtitle: '识别异常/提供优化建议',
      assignedTools: ['DeepSeek-R1 / V3'],
      inputSummary: '全套报表、往来对账与税负数据',
      outputSummary: '诊断跨期入账风险，核算研发加计扣除并提供节支建议',
      status: 'completed',
      reviewedByHuman: false,
      logs: []
    }
  ];

  const [steps, setSteps] = useState<PipelineStepMeta[]>(initialSteps);

  // 一键执行完整工作流 (5步流转)
  const handleRunFullWorkflow = async () => {
    setIsExecutingAll(true);
    // 依次将所有步骤重置为运行中状态，并逐步流转
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStepId(step.id);
      
      // 更新步骤状态为运行中
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s));
      
      // 模拟每一步处理微耗时，真实调用 DeepSeek
      await new Promise(r => setTimeout(r, 650));

      if (step.id === 'step1_collection') {
        // 执行发票校验
        setInvoices(prev => prev.map(inv => ({ ...inv, reviewed: true })));
      } else if (step.id === 'step2_voucher') {
        // 生成或刷新凭证
        const pendingInvoice = invoices[0];
        if (pendingInvoice) {
          const res = await aiGenerateVoucher(pendingInvoice, deepSeekConfig);
          if (res.data) {
            setVouchers(prev => [res.data!, ...prev.filter(v => v.id !== res.data!.id)]);
          }
        }
      } else if (step.id === 'step3_reconciliation') {
        // 对账勾兑
        await aiReconcileBankStatements(reconciliationReport, deepSeekConfig);
      } else if (step.id === 'step4_report') {
        // 报表汇总
        setFinancialReports(prev => ({ ...prev }));
      } else if (step.id === 'step5_analysis') {
        // 智能分析建议
        const res = await aiGenerateFinancialInsights(vouchers, deepSeekConfig);
        if (res.data && res.data.length > 0) {
          setInsights(res.data);
        }
      }

      // 标记该步骤已完成
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s));
    }

    setIsExecutingAll(false);
  };

  // 单独执行特定步骤
  const handleExecuteSingleStep = async (stepId: PipelineStepId) => {
    setIsProcessingStep(true);
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'running' } : s));

    try {
      if (stepId === 'step1_collection') {
        await new Promise(r => setTimeout(r, 500));
        setInvoices(prev => prev.map(inv => ({ ...inv, reviewed: true })));
      } else if (stepId === 'step2_voucher') {
        const target = invoices[1] || invoices[0];
        const res = await aiGenerateVoucher(target, deepSeekConfig);
        if (res.data) {
          setVouchers(prev => [res.data!, ...prev.filter(v => v.id !== res.data!.id)]);
        }
      } else if (stepId === 'step3_reconciliation') {
        await aiReconcileBankStatements(reconciliationReport, deepSeekConfig);
      } else if (stepId === 'step4_report') {
        await new Promise(r => setTimeout(r, 400));
      } else if (stepId === 'step5_analysis') {
        const res = await aiGenerateFinancialInsights(vouchers, deepSeekConfig);
        if (res.data && res.data.length > 0) {
          setInsights(res.data);
        }
      }

      setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'completed' } : s));
    } finally {
      setIsProcessingStep(false);
    }
  };

  // 发票 OCR 识别提交
  const handleRecognizeInvoiceText = async (rawText: string) => {
    setIsProcessingStep(true);
    try {
      const res = await aiRecognizeInvoice(rawText, deepSeekConfig);
      if (res.data) {
        const newInv: InvoiceItem = {
          id: `inv-${Date.now()}`,
          code: res.data.code || '3300231140',
          number: res.data.number || `${Math.floor(Math.random() * 90000000 + 10000000)}`,
          date: res.data.date || new Date().toISOString().slice(0, 10),
          buyerName: res.data.buyerName || '北京智算星辰科技有限公司',
          buyerTaxNo: res.data.buyerTaxNo || '91110108MA01XXXX78',
          sellerName: res.data.sellerName || '华为云计算技术有限公司',
          sellerTaxNo: res.data.sellerTaxNo || '91440300MA5EXXXX77',
          serviceName: res.data.serviceName || '*信息技术服务*云主机服务',
          unitPrice: res.data.amountWithoutTax || 8500.00,
          quantity: 1,
          amountWithoutTax: res.data.amountWithoutTax || 8500.00,
          taxRate: res.data.taxRate || 0.06,
          taxAmount: res.data.taxAmount || 510.00,
          totalAmount: res.data.totalAmount || 9010.00,
          invoiceType: (res.data.invoiceType as any) || 'vat_special',
          invoiceTypeName: '增值税专用发票',
          category: res.data.category || '研发费用-云资源费',
          confidence: 0.98,
          reviewed: false,
          rawOcrText: rawText
        };
        setInvoices(prev => [newInv, ...prev]);
      }
    } finally {
      setIsProcessingStep(false);
    }
  };

  // 凭证审核签章切换
  const handleApproveVoucher = (id: string) => {
    setVouchers(prev => prev.map(v => {
      if (v.id === id) {
        const isAudited = v.status === 'audited';
        return {
          ...v,
          status: isAudited ? 'draft' : 'audited',
          auditor: isAudited ? '待复核' : '许立国 (主审会计师)'
        };
      }
      return v;
    }));
  };

  // 生成新凭证
  const handleGenerateNewVoucher = async () => {
    setIsProcessingStep(true);
    try {
      const inv = invoices[Math.floor(Math.random() * invoices.length)] || invoices[0];
      const res = await aiGenerateVoucher(inv, deepSeekConfig);
      if (res.data) {
        setVouchers(prev => [res.data!, ...prev]);
      }
    } finally {
      setIsProcessingStep(false);
    }
  };

  // 发票人工复核切换
  const handleReviewInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, reviewed: !inv.reviewed } : inv));
  };

  // 对账差异标记解决
  const handleResolveDiscrepancy = (id: string) => {
    setReconciliationReport(prev => ({
      ...prev,
      discrepancies: prev.discrepancies.map(d => d.id === id ? { ...d, resolved: !d.resolved } : d)
    }));
  };

  // 场景选择切换
  const handleSelectScenario = (scenario: ScenarioType) => {
    setCurrentScenario(scenario);
    setActiveTab('workflow');
    if (scenario === 'invoice_processing') {
      setCurrentStepId('step1_collection');
    } else if (scenario === 'bank_reconciliation') {
      setCurrentStepId('step3_reconciliation');
    } else if (scenario === 'month_end_closing') {
      setCurrentStepId('step4_report');
    } else if (scenario === 'tax_filing') {
      setCurrentStepId('step5_analysis');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deepSeekConfig={deepSeekConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setActiveTab('compliance')}
        isExecutingAll={isExecutingAll}
        onRunFullWorkflow={handleRunFullWorkflow}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-28 md:pb-8">
        {/* Concept Hero matching top of infographic */}
        <OverviewHero />

        {/* Tab 1: 核心 5 步工作流 */}
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            {/* Visual 5-Step Pipeline Card */}
            <WorkflowPipeline
              steps={steps}
              currentStepId={currentStepId}
              onSelectStep={setCurrentStepId}
              onExecuteStep={handleExecuteSingleStep}
              isExecutingAll={isExecutingAll}
            />

            {/* Active Step Viewer */}
            <div className="transition-all">
              {currentStepId === 'step1_collection' && (
                <InvoiceCollectorView
                  invoices={invoices}
                  onAddInvoice={(inv) => setInvoices(prev => [inv, ...prev])}
                  onReviewInvoice={handleReviewInvoice}
                  onRecognizeWithDeepSeek={handleRecognizeInvoiceText}
                  deepSeekConfig={deepSeekConfig}
                  isProcessing={isProcessingStep}
                />
              )}

              {currentStepId === 'step2_voucher' && (
                <VoucherDetailViewer
                  vouchers={vouchers}
                  onApproveVoucher={handleApproveVoucher}
                  onGenerateNewVoucher={handleGenerateNewVoucher}
                  deepSeekConfig={deepSeekConfig}
                  isGenerating={isProcessingStep}
                />
              )}

              {currentStepId === 'step3_reconciliation' && (
                <ReconciliationViewer
                  report={reconciliationReport}
                  transactions={bankTransactions}
                  onResolveDiscrepancy={handleResolveDiscrepancy}
                  onRunReconciliationAI={() => handleExecuteSingleStep('step3_reconciliation')}
                  deepSeekConfig={deepSeekConfig}
                  isProcessing={isProcessingStep}
                />
              )}

              {currentStepId === 'step4_report' && (
                <ReportViewer
                  reports={financialReports}
                  onRefreshReports={() => handleExecuteSingleStep('step4_report')}
                  deepSeekConfig={deepSeekConfig}
                  isProcessing={isProcessingStep}
                />
              )}

              {currentStepId === 'step5_analysis' && (
                <AnalysisViewer
                  insights={insights}
                  onRefreshInsights={() => handleExecuteSingleStep('step5_analysis')}
                  deepSeekConfig={deepSeekConfig}
                  isProcessing={isProcessingStep}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 实际应用场景 (Section 5) */}
        {activeTab === 'scenarios' && (
          <ScenarioSelector
            currentScenario={currentScenario}
            onSelectScenario={handleSelectScenario}
          />
        )}

        {/* Tab 3: 设计 AI 工作流 (Section 2 & 3) */}
        {activeTab === 'designer' && (
          <WorkflowDesigner
            deepSeekConfig={deepSeekConfig}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Tab 4: 合规自查与注意事项 (Section 6 & 总结) */}
        {activeTab === 'compliance' && (
          <ComplianceNotice />
        )}
      </main>

      {/* DeepSeek API Key & Configuration Modal */}
      <DeepSeekModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={deepSeekConfig}
        onSaveConfig={(updated) => setDeepSeekConfig(updated)}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500 mb-16 md:mb-0">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>AI 会计自动化工作流系统</span>
          <span>·</span>
          <span>遵循中国《企业会计准则》及现行税收法规</span>
          <span>·</span>
          <span>驱动引擎: DeepSeek API (deepseek-chat / deepseek-reasoner)</span>
        </div>
      </footer>

      {/* Mobile Ergonomic Bottom Tab Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
