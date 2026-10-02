/**
 * 会计 AI 自动化工作流管线与架构状态定义
 * 对应图谱 6 大模块：
 * 1. 评估与明确需求
 * 2. 设计 AI 工作流 (触发 -> 处理 -> 输出)
 * 3. 选择合适的 AI 工具组合
 * 4. 5步标准会计工作流示例
 * 5. 实际应用场景
 * 6. 注意事项与合规复核
 */

export type PipelineStepId = 
  | 'step1_collection'      // 1. 收集数据 (OCR/导入)
  | 'step2_voucher'         // 2. 自动生成凭证
  | 'step3_reconciliation'  // 3. 自动对账
  | 'step4_report'          // 4. 生成报表
  | 'step5_analysis';       // 5. 分析与建议

export type StepStatus = 'idle' | 'running' | 'completed' | 'error' | 'awaiting_review';

export interface WorkflowLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'ai';
  message: string;
  payload?: any;
}

export interface PipelineStepMeta {
  id: PipelineStepId;
  stepNumber: number;
  title: string;
  subtitle: string;
  assignedTools: string[]; // 如: "OCR + DeepSeek", "DeepSeek + 财务软件"
  inputSummary: string;
  outputSummary: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  reviewedByHuman: boolean;
  deepSeekReasoning?: string;
  logs: WorkflowLogEntry[];
}

export interface WorkflowTriggerConfig {
  type: 'invoice_upload' | 'bank_sync' | 'scheduled_closing' | 'manual_batch';
  name: string;
  description: string;
  supportedFormats: string[]; // ['PDF', 'OFD', 'PNG', 'JPG', 'Excel', 'CSV']
  autoAdvance: boolean;
  requireHumanApprovalBeforePosting: boolean;
}

export interface WorkflowProcessRule {
  ocrConfidenceThreshold: number; // 默认 0.85
  taxRateMapping: Record<string, number>;
  defaultExpenseSubject: string;
  reconciliationToleranceAmount: number; // 允许的误差阈值 (如 0.00 元或角分级)
  strictDebitCreditEquality: boolean;
}

export interface WorkflowDesignSchema {
  trigger: {
    source: string;
    details: string;
    fileTypes: string[];
  };
  process: {
    aiEngine: string; // DeepSeek (deepseek-chat / deepseek-reasoner)
    ruleDescription: string;
    actions: string[];
  };
  output: {
    destination: string;
    formats: string[];
    deliverables: string[];
  };
}
