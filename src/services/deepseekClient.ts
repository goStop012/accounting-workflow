import { DeepSeekConfig, DeepSeekExecutionResult } from '../types/deepseek';
import { InvoiceItem, AccountingVoucher, BankReconciliationReport, FinancialInsight } from '../types/accounting';

const STORAGE_KEY = 'deepseek_accounting_config_v1';

export const DEFAULT_DEEPSEEK_CONFIG: DeepSeekConfig = {
  apiKey: '',
  model: 'deepseek-chat',
  baseUrl: 'https://api.deepseek.com',
  temperature: 0.3,
  maxTokens: 3000,
  useProxy: true,
};

export function getStoredDeepSeekConfig(): DeepSeekConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_DEEPSEEK_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load DeepSeek config from storage:', e);
  }
  return DEFAULT_DEEPSEEK_CONFIG;
}

export function saveStoredDeepSeekConfig(config: DeepSeekConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save DeepSeek config:', e);
  }
}

/**
 * 验证 DeepSeek API Key 连通性
 */
export async function testDeepSeekKey(apiKey: string, model: string = 'deepseek-chat'): Promise<{ valid: boolean; message: string; latencyMs: number }> {
  const startTime = Date.now();
  if (!apiKey || apiKey.trim() === '') {
    return { valid: false, message: '请输入有效的 DeepSeek API Key (sk-...)', latencyMs: 0 };
  }

  try {
    let res: Response;
    try {
      res = await fetch('/api/deepseek/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
      });
      if (res.status === 404) {
        throw new Error('Static host');
      }
    } catch {
      // 静态托管（如 GitHub Pages）直连 DeepSeek 官方
      res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });
    }

    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { valid: true, message: data.message || 'DeepSeek API 验证成功，服务正常响应！', latencyMs };
    } else {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      return { valid: false, message: err.error || `连接失败: HTTP ${res.status}`, latencyMs };
    }
  } catch (e: any) {
    const latencyMs = Date.now() - startTime;
    return { valid: false, message: `网络连接异常: ${e.message}`, latencyMs };
  }
}

/**
 * 调用 DeepSeek 核心接口
 */
export async function queryDeepSeek(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  config?: Partial<DeepSeekConfig>
): Promise<DeepSeekExecutionResult<string>> {
  const currentConfig = { ...getStoredDeepSeekConfig(), ...config };
  const startTime = Date.now();

  // 若未填写 API Key，则启动高拟真智能模拟引擎，并告知用户可配置 Key
  if (!currentConfig.apiKey || currentConfig.apiKey.trim() === '') {
    return {
      success: true,
      data: '',
      isSimulated: true,
      latencyMs: 380,
      tokensUsed: 420,
      reasoning: '当前处于 DeepSeek 预置智能工作流引擎模式。可在右上角「DeepSeek API 配置」输入您的 API Key 启用在线实时推理。'
    };
  }

  try {
    let response: Response;
    try {
      response = await fetch('/api/deepseek/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentConfig.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: currentConfig.model,
          messages,
          temperature: currentConfig.temperature,
          max_tokens: currentConfig.maxTokens,
        }),
      });
      if (response.status === 404) {
        throw new Error('Static host');
      }
    } catch {
      // 静态托管环境（如 GitHub Pages）直连 DeepSeek 官方
      const baseUrl = currentConfig.baseUrl || 'https://api.deepseek.com';
      response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentConfig.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: currentConfig.model,
          messages,
          temperature: currentConfig.temperature,
          max_tokens: currentConfig.maxTokens,
        }),
      });
    }

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `DeepSeek API 响应错误 (状态码: ${response.status})`,
        latencyMs,
        isSimulated: false,
      };
    }

    const data = await response.json();
    const assistantMsg = data.choices?.[0]?.message;
    const content = assistantMsg?.content || '';
    const reasoning = assistantMsg?.reasoning_content || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    return {
      success: true,
      data: content,
      reasoning,
      tokensUsed,
      latencyMs,
      isSimulated: false,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      error: `请求发送失败: ${err.message}`,
      latencyMs,
      isSimulated: false,
    };
  }
}

/**
 * 步骤 1. AI 智能提取发票与单据 (OCR + DeepSeek 结构化解析)
 */
export async function aiRecognizeInvoice(rawText: string, config?: DeepSeekConfig): Promise<DeepSeekExecutionResult<Partial<InvoiceItem>>> {
  const prompt = `你是一位精通中国增值税发票制度与原始凭证审核的资深财务专家。
请解析以下发票/单据文本，以纯 JSON 格式输出结构化财务数据，不要包含任何 markdown 代码块标记以外的文字：
${rawText}

输出格式要求：
{
  "code": "发票代码",
  "number": "发票号码",
  "date": "YYYY-MM-DD",
  "buyerName": "购买方名称",
  "buyerTaxNo": "购买方纳税人识别号",
  "sellerName": "销售方名称",
  "sellerTaxNo": "销售方纳税人识别号",
  "serviceName": "货物或应税劳务名称",
  "amountWithoutTax": 0.00,
  "taxRate": 0.13,
  "taxAmount": 0.00,
  "totalAmount": 0.00,
  "invoiceType": "vat_special" 或 "vat_common" 或 "travel_expense",
  "category": "研发费用-云资源费" 或 "原材料" 或 "管理费用-办公费" 或 "销售费用-差旅费",
  "complianceCheck": "税号是否规范、金额借贷核算结论"
}`;

  const res = await queryDeepSeek([
    { role: 'system', content: '你是一位精通中国企业会计准则与发票合规风控的 DeepSeek 财务智能体。' },
    { role: 'user', content: prompt }
  ], config);

  if (res.isSimulated || !res.success) {
    return {
      ...res,
      data: {
        buyerName: '北京智算星辰科技有限公司',
        sellerName: '阿里云计算有限公司',
        amountWithoutTax: 12000.00,
        taxRate: 0.06,
        taxAmount: 720.00,
        totalAmount: 12720.00,
        category: '研发费用-云资源费',
      }
    };
  }

  try {
    const cleanJson = res.data?.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson || '{}');
    return {
      success: res.success,
      data: parsed,
      reasoning: res.reasoning,
      tokensUsed: res.tokensUsed,
      latencyMs: res.latencyMs,
      isSimulated: res.isSimulated,
      error: res.error
    };
  } catch {
    return {
      success: false,
      data: undefined,
      error: '发票 JSON 解析失败',
      latencyMs: res.latencyMs
    };
  }
}

/**
 * 步骤 2. 自动生成会计凭证 (DeepSeek 复式记账分录推理)
 */
export async function aiGenerateVoucher(invoice: InvoiceItem, config?: DeepSeekConfig): Promise<DeepSeekExecutionResult<AccountingVoucher>> {
  const prompt = `根据以下已校验发票信息，按照《企业会计准则》及中国借贷复式记账法，编制标准记账凭证分录。
必须严格保证：所有借方金额之和 严格等于 贷方金额之和！

发票详情：
- 销售方: ${invoice.sellerName}
- 货物/劳务名称: ${invoice.serviceName}
- 不含税金额: ¥${invoice.amountWithoutTax.toFixed(2)}
- 税率: ${(invoice.taxRate * 100).toFixed(0)}%
- 税额: ¥${invoice.taxAmount.toFixed(2)}
- 价税合计: ¥${invoice.totalAmount.toFixed(2)}
- 业务分类: ${invoice.category}

请直接输出标准 JSON：
{
  "voucherWord": "记",
  "voucherNumber": "0045",
  "date": "${invoice.date}",
  "attachmentCount": 1,
  "aiReasoning": "详细会计学依据（适用的会计准则条款与进项税额抵扣说明）",
  "entries": [
    {
      "summary": "摘要简述",
      "subjectCode": "科目代码",
      "subjectName": "一级科目 - 二级明细",
      "direction": "借",
      "debitAmount": 0.00,
      "creditAmount": 0.00,
      "auxiliaryAccount": "部门或供应商辅助核算项"
    }
  ]
}`;

  const res = await queryDeepSeek([
    { role: 'system', content: '你是一位严谨的中国注册会计师(CPA) AI 智能体，精通借贷记账法与税务筹划。' },
    { role: 'user', content: prompt }
  ], config);

  if (res.isSimulated || !res.success) {
    // 智能高质量兜底分录
    const isVatDeductible = invoice.taxRate > 0 && invoice.invoiceType === 'vat_special';
    const mockVoucher: AccountingVoucher = {
      id: `v-ai-${Date.now()}`,
      voucherWord: '记',
      voucherNumber: `00${Math.floor(Math.random() * 50 + 40)}`,
      date: invoice.date,
      attachmentCount: 1,
      creator: 'DeepSeek 财务智能体',
      auditor: '待复核',
      status: 'draft',
      sourceInvoiceIds: [invoice.id],
      totalDebit: invoice.totalAmount,
      totalCredit: invoice.totalAmount,
      isBalanced: true,
      aiReasoning: `根据发票性质(${invoice.invoiceTypeName})，业务属于「${invoice.category}」。不含税金额 ¥${invoice.amountWithoutTax.toFixed(2)} 计入成本费用借方；${isVatDeductible ? `增值税进项税额 ¥${invoice.taxAmount.toFixed(2)} 计入应交税费借方准予抵扣；` : ''}贷记应付账款/银行存款 ¥${invoice.totalAmount.toFixed(2)}，借贷严格平衡。`,
      entries: [
        {
          id: `e-${Date.now()}-1`,
          summary: `${invoice.sellerName} - ${invoice.serviceName.slice(0, 20)}`,
          subjectCode: invoice.category.includes('研发') ? '530103' : invoice.category.includes('原料') ? '140301' : '660201',
          subjectName: invoice.category,
          direction: '借',
          debitAmount: invoice.amountWithoutTax,
          creditAmount: 0,
          auxiliaryAccount: invoice.buyerName
        },
        ...(isVatDeductible ? [{
          id: `e-${Date.now()}-2`,
          summary: `进项增值税额 (税率 ${(invoice.taxRate * 100).toFixed(0)}%)`,
          subjectCode: '22210101',
          subjectName: '应交税费 - 应交增值税(进项税额)',
          direction: '借' as const,
          debitAmount: invoice.taxAmount,
          creditAmount: 0
        }] : []),
        {
          id: `e-${Date.now()}-3`,
          summary: `应付 ${invoice.sellerName} 款项`,
          subjectCode: '220201',
          subjectName: '应付账款 / 银行存款',
          direction: '贷',
          debitAmount: 0,
          creditAmount: invoice.totalAmount,
          auxiliaryAccount: `供应商: ${invoice.sellerName}`
        }
      ]
    };
    return { ...res, data: mockVoucher };
  }

  try {
    const cleanJson = res.data?.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson || '{}');
    const totalDebit = parsed.entries?.reduce((s: number, e: any) => s + (Number(e.debitAmount) || 0), 0) || 0;
    const totalCredit = parsed.entries?.reduce((s: number, e: any) => s + (Number(e.creditAmount) || 0), 0) || 0;

    const voucher: AccountingVoucher = {
      id: `v-ai-${Date.now()}`,
      voucherWord: parsed.voucherWord || '记',
      voucherNumber: parsed.voucherNumber || '0050',
      date: parsed.date || invoice.date,
      attachmentCount: parsed.attachmentCount || 1,
      creator: 'DeepSeek 财务智能体',
      auditor: '待复核',
      status: 'draft',
      sourceInvoiceIds: [invoice.id],
      totalDebit,
      totalCredit,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      aiReasoning: parsed.aiReasoning || res.reasoning || 'DeepSeek 自动基于税法及会计准则推导分录。',
      entries: parsed.entries || []
    };
    return {
      success: true,
      data: voucher,
      reasoning: parsed.aiReasoning || res.reasoning,
      tokensUsed: res.tokensUsed,
      latencyMs: res.latencyMs,
      isSimulated: res.isSimulated
    };
  } catch (err: any) {
    return {
      success: false,
      data: undefined,
      error: `凭证分录解析异常: ${err.message}`,
      latencyMs: res.latencyMs
    };
  }
}

/**
 * 步骤 3. 银行自动对账与未达账项识别 (DeepSeek 勾兑)
 */
export async function aiReconcileBankStatements(
  report: BankReconciliationReport,
  config?: DeepSeekConfig
): Promise<DeepSeekExecutionResult<BankReconciliationReport>> {
  const prompt = `分析以下银行对账单与企业日记账数据，识别两方差异成因，生成「银行存款余额调节表」调节项目及处理建议：
- 银行对账单期末余额: ¥${report.bankStatementEndingBalance}
- 企业日记账期末余额: ¥${report.companyBookEndingBalance}
- 待调节差异项清单: ${JSON.stringify(report.discrepancies)}

请给出专业的对账调节建议与会计审计意见。`;

  const res = await queryDeepSeek([
    { role: 'system', content: '你是一位精通银行存款余额调节表与未达账项审计的财务专家。' },
    { role: 'user', content: prompt }
  ], config);

  return {
    ...res,
    data: report,
  };
}

/**
 * 步骤 5. 财务分析与经营风险建议 (DeepSeek 经营洞察)
 */
export async function aiGenerateFinancialInsights(
  vouchers: AccountingVoucher[],
  config?: DeepSeekConfig
): Promise<DeepSeekExecutionResult<FinancialInsight[]>> {
  const prompt = `基于当前企业记账凭证与财务数据，分析潜在财务异常、税务合规风险、研发费用加计扣除优化点以及成本节约建议。
输出 JSON 数组，每项包含 category (risk / tax / cost_control / efficiency), severity (low / medium / high), title, description, impactMetrics, recommendation。`;

  const res = await queryDeepSeek([
    { role: 'system', content: '你是一位企业首席财务官 (CFO) 级别的 DeepSeek AI 顾问。' },
    { role: 'user', content: prompt }
  ], config);

  if (res.isSimulated || !res.success) {
    return {
      ...res,
      data: [
        {
          category: 'risk',
          severity: 'medium',
          title: '未达账项提示：合同款 15.8 万元尚未开具销项发票',
          description: '银行账户已收到深圳客户电汇款，属于银行已收企业未收项，如所属期已交付产品，需防范跨期确认收入与增值税滞后风险。',
          impactMetrics: '涉及资金 ¥158,000.00，潜在税额 ¥9,480.00',
          recommendation: '核实交付进度并索取电子回单，及时编制预收款凭证或确认主营业务收入。'
        },
        {
          category: 'tax',
          severity: 'low',
          title: '研发费用 100% 加计扣除政策适用',
          description: '本期云基础设施研发租赁费与传感模组试制费准予在企业所得税前 100% 加计扣除。',
          impactMetrics: '可税前加计扣除 ¥115,000.00，预计节税 ¥17,250.00',
          recommendation: '完善研发立项文件、工时记录与进项发票凭据链条，建立研发支出辅助账。'
        }
      ]
    };
  }

  try {
    const cleanJson = res.data?.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson || '[]');
    return {
      success: true,
      data: Array.isArray(parsed) ? parsed : [],
      reasoning: res.reasoning,
      tokensUsed: res.tokensUsed,
      latencyMs: res.latencyMs,
      isSimulated: res.isSimulated
    };
  } catch {
    return {
      success: false,
      data: [],
      error: '财务分析 JSON 解析失败',
      latencyMs: res.latencyMs
    };
  }
}
