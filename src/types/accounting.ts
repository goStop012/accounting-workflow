/**
 * 会计自动化工作流核心业务数据模型
 * 遵循《企业会计准则》及中国增值税、企业所得税申报规范
 */

// 1. 发票与原始单据模型
export type InvoiceType = 'vat_special' | 'vat_common' | 'travel_expense' | 'bank_slip' | 'custom_bill';

export interface InvoiceItem {
  id: string;
  code: string; // 发票代码/流水号
  number: string; // 发票号码
  date: string; // 开票/发生日期
  buyerName: string; // 购买方
  buyerTaxNo: string; // 购买方税号
  sellerName: string; // 销售方
  sellerTaxNo: string; // 销售方税号
  serviceName: string; // 货物或应税劳务名称
  specification?: string; // 规格型号
  unitPrice: number; // 单价
  quantity: number; // 数量
  amountWithoutTax: number; // 不含税金额
  taxRate: number; // 税率 (如 0.13, 0.09, 0.06)
  taxAmount: number; // 税额
  totalAmount: number; // 价税合计
  invoiceType: InvoiceType;
  invoiceTypeName: string;
  category: string; // 费用归属: 原材料 / 销售费用 / 管理费用 / 研发费用 / 资产采购
  fileUrl?: string;
  imageUrl?: string; // 发票/单据原图 (Base64 或 预览链接)
  recognitionMethod?: 'deepseek_vision' | 'ocr_text'; // 识别途径: DeepSeek 视觉大模型直读 / OCR 文本解析
  rawOcrText?: string;
  confidence: number; // 识别置信度 (0-1)
  reviewed: boolean; // 是否已人工复核
}

// 2. 会计凭证与复式记账分录 (借贷平衡)
export type EntryDirection = '借' | '贷';

export interface VoucherEntry {
  id: string;
  summary: string; // 摘要 (如: 支付阿里云服务器托管费)
  subjectCode: string; // 会计科目编码 (如: 660201)
  subjectName: string; // 一级科目及二级科目名称 (如: 管理费用-办公费)
  direction: EntryDirection; // 借 / 贷
  debitAmount: number; // 借方金额
  creditAmount: number; // 贷方金额
  auxiliaryAccount?: string; // 辅助核算项 (部门/项目/供应商)
}

export interface AccountingVoucher {
  id: string;
  voucherWord: string; // 凭证字 (如: 记)
  voucherNumber: string; // 凭证号 (如: 0042)
  date: string; // 制单日期
  attachmentCount: number; // 附件张数
  creator: string; // 制单人 (如: DeepSeek-AI)
  auditor?: string; // 审核人
  bookkeeper?: string; // 记账人
  entries: VoucherEntry[];
  totalDebit: number; // 借方合计
  totalCredit: number; // 贷方合计
  isBalanced: boolean; // 是否借贷平衡
  sourceInvoiceIds: string[]; // 关联原始发票/单据
  aiReasoning: string; // AI 分录推导依据
  status: 'draft' | 'audited' | 'posted'; // 状态: 草稿/已审核/已记账
}

// 3. 银行流水与自动对账
export interface BankTransaction {
  id: string;
  transactionTime: string;
  bankAccount: string;
  transactionType: 'inflow' | 'outflow'; // 收入 / 支出
  amount: number;
  counterpartyName: string; // 对方户名
  counterpartyAccount: string;
  summary: string; // 交易用途/摘要
  matchedVoucherId?: string; // 已关联凭证
}

export interface DiscrepancyItem {
  id: string;
  type: 'bank_unrecorded_fee' | 'company_unrecorded' | 'amount_mismatch' | 'timing_difference';
  title: string;
  description: string;
  amount: number;
  direction: 'bank_has_company_no' | 'company_has_bank_no' | 'difference';
  suggestedAction: string; // AI建议处理方式
  resolved: boolean;
}

export interface BankReconciliationReport {
  period: string; // 对账所属期
  bankName: string;
  accountNumber: string;
  bankStatementEndingBalance: number; // 银行对账单期末余额
  companyBookEndingBalance: number; // 企业银行存款日记账期末余额
  // 银行存款余额调节表四项调节数
  plusCompanyReceivedBankUnrecorded: number; // 加: 企业已收、银行未收账项
  lessCompanyPaidBankUnrecorded: number; // 减: 企业已付、银行未付账项
  plusBankReceivedCompanyUnrecorded: number; // 加: 银行已收、企业未收账项
  lessBankPaidCompanyUnrecorded: number; // 减: 银行已付、企业未付账项
  adjustedBankBalance: number; // 调节后银行对账单余额
  adjustedCompanyBalance: number; // 调节后企业存款余额
  isBalanced: boolean; // 调节后余额是否相符
  matchedCount: number;
  unmatchedCount: number;
  discrepancies: DiscrepancyItem[];
}

// 4. 财务报表 (资产负债表与利润表)
export interface FinancialStatementRow {
  lineNo: number;
  item: string;
  beginningBalance: number; // 年初余额 / 上期金额
  endingBalance: number; // 期末余额 / 本期金额
}

export interface FinancialReportsData {
  period: string;
  companyName: string;
  balanceSheet: {
    assets: FinancialStatementRow[];
    liabilitiesAndEquity: FinancialStatementRow[];
    totalAssets: number;
    totalLiabilitiesAndEquity: number;
    isBalanced: boolean;
  };
  incomeStatement: {
    rows: FinancialStatementRow[];
    totalRevenue: number;
    totalCostAndExpense: number;
    operatingProfit: number;
    totalProfit: number;
    netProfit: number;
  };
}

// 5. 财务分析与经营风险建议 (AI Insight)
export interface FinancialInsight {
  category: 'risk' | 'tax' | 'efficiency' | 'cost_control';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  impactMetrics: string;
  recommendation: string;
}

export interface ComprehensiveAccountingState {
  currentScenario: ScenarioType;
  invoices: InvoiceItem[];
  vouchers: AccountingVoucher[];
  bankTransactions: BankTransaction[];
  reconciliationReport: BankReconciliationReport | null;
  reports: FinancialReportsData | null;
  insights: FinancialInsight[];
}

// 6. 业务应用场景类型 (Section 5 实际应用场景)
export type ScenarioType = 
  | 'invoice_processing' // 发票处理: 自动识别发票信息、生成凭证并分类
  | 'bank_reconciliation' // 银行对账: 自动匹配流水、生成对账报告
  | 'month_end_closing' // 月度结账: 自动汇总数据、生成财务报表
  | 'tax_filing'; // 税务申报: 计算税额、生成申报表
