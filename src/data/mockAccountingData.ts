import { 
  InvoiceItem, 
  AccountingVoucher, 
  BankTransaction, 
  BankReconciliationReport, 
  FinancialReportsData, 
  FinancialInsight 
} from '../types/accounting';
import { sampleInvoiceImages } from './sampleInvoiceImages';

// 场景 1 初始发票数据集 (支持直接体验或上传新票据)
export const initialInvoices: InvoiceItem[] = [
  {
    id: 'inv-2026-001',
    code: '1100234130',
    number: '88392014',
    date: '2026-09-15',
    buyerName: '北京智算星辰科技有限公司',
    buyerTaxNo: '91110108MA01XXXX78',
    sellerName: '阿里云计算有限公司',
    sellerTaxNo: '91330100799655058B',
    serviceName: '*信息技术服务*云服务器ECS及弹性公网带宽季度租用费',
    specification: '8C32G 高性能型',
    unitPrice: 12000.00,
    quantity: 1,
    amountWithoutTax: 12000.00,
    taxRate: 0.06,
    taxAmount: 720.00,
    totalAmount: 12720.00,
    invoiceType: 'vat_special',
    invoiceTypeName: '增值税专用发票',
    category: '研发费用-云资源费',
    confidence: 0.99,
    reviewed: false,
    imageUrl: sampleInvoiceImages.cloudServerInvoice,
    recognitionMethod: 'deepseek_vision',
    rawOcrText: '发票代码: 1100234130 发票号码: 88392014 开票日期: 2026年09月15日 购买方: 北京智算星辰科技有限公司 销售方: 阿里云计算有限公司 服务名称: *信息技术服务*云服务器 金额: 12000.00 税率: 6% 税额: 720.00 价税合计: 12720.00'
  },
  {
    id: 'inv-2026-002',
    code: '3100223140',
    number: '04918231',
    date: '2026-09-18',
    buyerName: '北京智算星辰科技有限公司',
    buyerTaxNo: '91110108MA01XXXX78',
    sellerName: '苏州精工微纳元器件制造有限公司',
    sellerTaxNo: '91320500MA1TXXXX22',
    serviceName: '*电子元器件*工业级传感核心模组芯片',
    specification: 'TX-900',
    unitPrice: 350.00,
    quantity: 100,
    amountWithoutTax: 35000.00,
    taxRate: 0.13,
    taxAmount: 4550.00,
    totalAmount: 39550.00,
    invoiceType: 'vat_special',
    invoiceTypeName: '增值税专用发票',
    category: '原材料-传感模组',
    confidence: 0.98,
    reviewed: false,
    imageUrl: sampleInvoiceImages.hardwareChipInvoice,
    recognitionMethod: 'deepseek_vision',
    rawOcrText: '发票代码: 3100223140 发票号码: 04918231 开票日期: 2026年09月18日 货物名称: *电子元器件*工业级传感核心模组芯片 单价: 350 数量: 100 金额: 35000.00 税率: 13% 税额: 4550.00 价税合计: 39550.00'
  },
  {
    id: 'inv-2026-003',
    code: '4403230100',
    number: '19028344',
    date: '2026-09-21',
    buyerName: '北京智算星辰科技有限公司',
    buyerTaxNo: '91110108MA01XXXX78',
    sellerName: '深圳卓越商旅大酒店有限公司',
    sellerTaxNo: '91440300MA5EXXXX99',
    serviceName: '*住宿服务*客房住宿费 (技术总监深圳客户现场支持)',
    unitPrice: 1850.00,
    quantity: 1,
    amountWithoutTax: 1745.28,
    taxRate: 0.06,
    taxAmount: 104.72,
    totalAmount: 1850.00,
    invoiceType: 'vat_special',
    invoiceTypeName: '增值税专用发票',
    category: '销售费用-差旅费',
    confidence: 0.97,
    reviewed: false,
    rawOcrText: '发票代码: 4403230100 发票号码: 19028344 服务名称: *住宿服务*客房住宿费 金额: 1745.28 税额: 104.72 价税合计: 1850.00'
  },
  {
    id: 'inv-2026-004',
    code: '0110022001',
    number: '67204911',
    date: '2026-09-24',
    buyerName: '北京智算星辰科技有限公司',
    buyerTaxNo: '91110108MA01XXXX78',
    sellerName: '北京得力办公文化用品专营店',
    sellerTaxNo: '91110108MA00YYYY33',
    serviceName: '*办公用品*打印纸、碳粉硒鼓及档案整理夹',
    unitPrice: 860.00,
    quantity: 1,
    amountWithoutTax: 761.06,
    taxRate: 0.13,
    taxAmount: 98.94,
    totalAmount: 860.00,
    invoiceType: 'vat_common',
    invoiceTypeName: '增值税电子普通发票',
    category: '管理费用-办公费',
    confidence: 0.96,
    reviewed: false,
    rawOcrText: '货物名称: *办公用品*办公耗材 金额: 761.06 税额: 98.94 价税合计: 860.00'
  }
];

// 预置已生成的凭证集
export const initialVouchers: AccountingVoucher[] = [
  {
    id: 'v-2026-0901',
    voucherWord: '记',
    voucherNumber: '0041',
    date: '2026-09-15',
    attachmentCount: 1,
    creator: 'DeepSeek-V3 (AI Assistant)',
    auditor: '张敏 (财务主管)',
    status: 'audited',
    sourceInvoiceIds: ['inv-2026-001'],
    totalDebit: 12720.00,
    totalCredit: 12720.00,
    isBalanced: true,
    aiReasoning: '依据财税〔2016〕36号文，云服务属于信息技术服务，一般纳税人取得增值税专用发票进项税额6%准予全额抵扣；借方计入研发费用-云资源费，进项税额计入应交税费-应交增值税(进项税额)，贷记银行存款。',
    entries: [
      {
        id: 'e-1',
        summary: '支付阿里云服务器及带宽季度租用费',
        subjectCode: '530103',
        subjectName: '研发费用 - 云资源服务费',
        direction: '借',
        debitAmount: 12000.00,
        creditAmount: 0,
        auxiliaryAccount: '研发部 / 智算基础设施'
      },
      {
        id: 'e-2',
        summary: '阿里云云服务进项增值税',
        subjectCode: '22210101',
        subjectName: '应交税费 - 应交增值税(进项税额)',
        direction: '借',
        debitAmount: 720.00,
        creditAmount: 0
      },
      {
        id: 'e-3',
        summary: '银行网银转账支付阿里云账单',
        subjectCode: '100201',
        subjectName: '银行存款 - 招行基本户',
        direction: '贷',
        debitAmount: 0,
        creditAmount: 12720.00
      }
    ]
  },
  {
    id: 'v-2026-0902',
    voucherWord: '记',
    voucherNumber: '0042',
    date: '2026-09-18',
    attachmentCount: 2,
    creator: 'DeepSeek-V3 (AI Assistant)',
    auditor: '待复核',
    status: 'draft',
    sourceInvoiceIds: ['inv-2026-002'],
    totalDebit: 39550.00,
    totalCredit: 39550.00,
    isBalanced: true,
    aiReasoning: '采购核心传感模组100套，取得13%增值税专票，货品经验收入库。借记原材料-传感模组35000.00，借记应交税费-应交增值税(进项税额)4550.00，贷记应付账款-苏州精工微纳39550.00。',
    entries: [
      {
        id: 'e-4',
        summary: '采购传感核心模组100套验收入库',
        subjectCode: '140301',
        subjectName: '原材料 - 传感模组',
        direction: '借',
        debitAmount: 35000.00,
        creditAmount: 0,
        auxiliaryAccount: '供应链仓储中心'
      },
      {
        id: 'e-5',
        summary: '采购模组增值税进项税额',
        subjectCode: '22210101',
        subjectName: '应交税费 - 应交增值税(进项税额)',
        direction: '借',
        debitAmount: 4550.00,
        creditAmount: 0
      },
      {
        id: 'e-6',
        summary: '应付苏州精工微纳元器件货款',
        subjectCode: '220201',
        subjectName: '应付账款 - 苏州精工微纳',
        direction: '贷',
        debitAmount: 0,
        creditAmount: 39550.00,
        auxiliaryAccount: '供应商: 苏州精工微纳'
      }
    ]
  }
];

// 银行对账流水数据集
export const initialBankTransactions: BankTransaction[] = [
  {
    id: 'bt-1',
    transactionTime: '2026-09-15 14:22:10',
    bankAccount: '招商银行北京分行 88392100827361',
    transactionType: 'outflow',
    amount: 12720.00,
    counterpartyName: '阿里云计算有限公司',
    counterpartyAccount: '33001613535050000000',
    summary: '网银跨行对公转账 - 云服务费',
    matchedVoucherId: 'v-2026-0901'
  },
  {
    id: 'bt-2',
    transactionTime: '2026-09-20 09:15:30',
    bankAccount: '招商银行北京分行 88392100827361',
    transactionType: 'inflow',
    amount: 158000.00,
    counterpartyName: '未来智联系统科技(深圳)有限公司',
    counterpartyAccount: '755912382910283',
    summary: '汇入合同首期款 - 智能控制系统软件交付款',
    matchedVoucherId: undefined // 银行已收、企业未收 (未达账项)
  },
  {
    id: 'bt-3',
    transactionTime: '2026-09-25 18:00:00',
    bankAccount: '招商银行北京分行 88392100827361',
    transactionType: 'outflow',
    amount: 150.00,
    counterpartyName: '招商银行股份有限公司',
    counterpartyAccount: '999900001',
    summary: '单位电子银行账户服务费与短信通知季度年费',
    matchedVoucherId: undefined // 银行已付、企业未入账
  },
  {
    id: 'bt-4',
    transactionTime: '2026-09-28 11:40:15',
    bankAccount: '招商银行北京分行 88392100827361',
    transactionType: 'outflow',
    amount: 1850.00,
    counterpartyName: '深圳卓越商旅大酒店有限公司',
    counterpartyAccount: '440301827361928',
    summary: '商务差旅客房住宿结账款'
  }
];

// 银行存款余额调节表 (Section 4 Step 3)
export const initialReconciliationReport: BankReconciliationReport = {
  period: '2026年09月',
  bankName: '招商银行北京分行大运村支行',
  accountNumber: '88392100827361',
  bankStatementEndingBalance: 742100.00, // 银行对账单余额
  companyBookEndingBalance: 584250.00, // 企业日记账余额
  plusCompanyReceivedBankUnrecorded: 0, // 企业已收银行未收
  lessCompanyPaidBankUnrecorded: 0, // 企业已付银行未付
  plusBankReceivedCompanyUnrecorded: 158000.00, // 银行已收企业未收 (深圳客户汇入首付款)
  lessBankPaidCompanyUnrecorded: 150.00, // 银行已扣手续费
  adjustedBankBalance: 742100.00, // 调节后余额
  adjustedCompanyBalance: 742100.00, // 调节后余额 (584250 + 158000 - 150 = 742100)
  isBalanced: true,
  matchedCount: 38,
  unmatchedCount: 2,
  discrepancies: [
    {
      id: 'disc-1',
      type: 'company_unrecorded',
      title: '客户电汇转入款 158,000.00 元',
      description: '未来智联系统科技电汇首期合同款已到账，企业日记账未见记账凭证。',
      amount: 158000.00,
      direction: 'bank_has_company_no',
      suggestedAction: '请索取银行电子回单，编制会计分录：借 银行存款 158,000.00 / 贷 预收账款/合同负债 158,000.00。',
      resolved: false
    },
    {
      id: 'disc-2',
      type: 'bank_unrecorded_fee',
      title: '银行代扣账户服务费 150.00 元',
      description: '招行扣收企业网银数字证书与账户管家季度服务费，企业未收到单据。',
      amount: 150.00,
      direction: 'bank_has_company_no',
      suggestedAction: '建议自动生成记账凭证：借 财务费用-金融服务费 150.00 / 贷 银行存款 150.00。',
      resolved: false
    }
  ]
};

// 财务报表数据集 (Section 4 Step 4)
export const initialFinancialReports: FinancialReportsData = {
  period: '2026年09月30日 (第3季度末)',
  companyName: '北京智算星辰科技有限公司',
  balanceSheet: {
    assets: [
      { lineNo: 1, item: '货币资金 (库存现金+银行存款)', beginningBalance: 420000.00, endingBalance: 742100.00 },
      { lineNo: 2, item: '应收账款', beginningBalance: 280000.00, endingBalance: 345000.00 },
      { lineNo: 3, item: '预付款项', beginningBalance: 45000.00, endingBalance: 28000.00 },
      { lineNo: 4, item: '存货 (原材料+在产品+库存商品)', beginningBalance: 160000.00, endingBalance: 195000.00 },
      { lineNo: 5, item: '流动资产合计', beginningBalance: 905000.00, endingBalance: 1310100.00 },
      { lineNo: 6, item: '固定资产原价及净值', beginningBalance: 480000.00, endingBalance: 456000.00 },
      { lineNo: 7, item: '无形资产 (知识产权及软件著作)', beginningBalance: 120000.00, endingBalance: 110000.00 },
      { lineNo: 8, item: '非流动资产合计', beginningBalance: 600000.00, endingBalance: 566000.00 },
      { lineNo: 9, item: '资产总计', beginningBalance: 1505000.00, endingBalance: 1876100.00 }
    ],
    liabilitiesAndEquity: [
      { lineNo: 10, item: '短期借款', beginningBalance: 200000.00, endingBalance: 150000.00 },
      { lineNo: 11, item: '应付账款', beginningBalance: 140000.00, endingBalance: 179550.00 },
      { lineNo: 12, item: '合同负债 (预收账款)', beginningBalance: 80000.00, endingBalance: 238000.00 },
      { lineNo: 13, item: '应付职工薪酬', beginningBalance: 95000.00, endingBalance: 102000.00 },
      { lineNo: 14, item: '应交税费 (增值税+企业所得税)', beginningBalance: 32000.00, endingBalance: 44550.00 },
      { lineNo: 15, item: '负债合计', beginningBalance: 547000.00, endingBalance: 714100.00 },
      { lineNo: 16, item: '实收资本 (股本)', beginningBalance: 800000.00, endingBalance: 800000.00 },
      { lineNo: 17, item: '未分配利润 (累计盈余)', beginningBalance: 158000.00, endingBalance: 362000.00 },
      { lineNo: 18, item: '所有者权益合计', beginningBalance: 958000.00, endingBalance: 1162000.00 },
      { lineNo: 19, item: '负债和所有者权益总计', beginningBalance: 1505000.00, endingBalance: 1876100.00 }
    ],
    totalAssets: 1876100.00,
    totalLiabilitiesAndEquity: 1876100.00,
    isBalanced: true
  },
  incomeStatement: {
    rows: [
      { lineNo: 1, item: '一、营业收入', beginningBalance: 520000.00, endingBalance: 860000.00 },
      { lineNo: 2, item: '减：营业成本', beginningBalance: 210000.00, endingBalance: 335000.00 },
      { lineNo: 3, item: '税金及附加', beginningBalance: 6200.00, endingBalance: 9800.00 },
      { lineNo: 4, item: '销售费用', beginningBalance: 48000.00, endingBalance: 62000.00 },
      { lineNo: 5, item: '管理费用', beginningBalance: 65000.00, endingBalance: 78000.00 },
      { lineNo: 6, item: '研发费用', beginningBalance: 82000.00, endingBalance: 115000.00 },
      { lineNo: 7, item: '财务费用 (利息收支及手续费)', beginningBalance: -2800.00, endingBalance: -3600.00 },
      { lineNo: 8, item: '二、营业利润', beginningBalance: 111600.00, endingBalance: 263800.00 },
      { lineNo: 9, item: '三、利润总额', beginningBalance: 111600.00, endingBalance: 263800.00 },
      { lineNo: 10, item: '减：所得税费用 (高新/小微优惠税率)', beginningBalance: 16740.00, endingBalance: 39570.00 },
      { lineNo: 11, item: '四、净利润', beginningBalance: 94860.00, endingBalance: 224230.00 }
    ],
    totalRevenue: 860000.00,
    totalCostAndExpense: 596200.00,
    operatingProfit: 263800.00,
    totalProfit: 263800.00,
    netProfit: 224230.00
  }
};

// 财务分析与异常建议 (Section 4 Step 5)
export const initialInsights: FinancialInsight[] = [
  {
    category: 'risk',
    severity: 'medium',
    title: '未达账项提示：合同首期款 15.8 万元尚未开票入账',
    description: '招行账户 9月20日 收到来自深圳客户 15.8 万元汇款，当前作为未达账项挂账，若所属期内确认收入但未及时计提增值税销项税，可能存在跨期税务风险。',
    impactMetrics: '涉及资金 ¥158,000.00，潜在增值税税额 ¥9,480.00',
    recommendation: '建议业务部门核实项目交付里程碑，若符合收入确认条件应尽快开具增值税专用发票并确认主营业务收入；若为预付款则计入「合同负债」。'
  },
  {
    category: 'tax',
    severity: 'low',
    title: '高新技术企业研发费用加计扣除优化空间',
    description: '本期研发费用发生额达 11.5 万元，包含阿里云服务器算力租赁费及传感器芯片试制支出。依据现行企业所得税加计扣除政策（扣除比例 100%），可在税前额外加计扣除 11.5 万元。',
    impactMetrics: '预计直接减少企业所得税应纳税所得额 ¥115,000.00，节税约 ¥17,250.00',
    recommendation: '确保研发工单、测试日志与费用凭证附件链条完整，设立研发支出辅助账备查。'
  },
  {
    category: 'cost_control',
    severity: 'medium',
    title: '云资源弹性算力成本环比上涨 32%',
    description: '三季度云服务基础设施账单（1.2 万元/季）较二季度上升较为明显，主要由突发分布式训练任务产生。',
    impactMetrics: '月均 IT 支出增加 ¥1,400.00',
    recommendation: '建议与运维团队对接，采用阿里云抢占式实例或包年包月折扣券，预计可降低 25% 算力支出。'
  },
  {
    category: 'efficiency',
    severity: 'low',
    title: 'AI 全自动凭证化率已达 88.5%',
    description: '当前批次 4 张发票与 4 笔银行流水中，7 笔已实现规则化自动匹配与一键生成凭证，节约记账手工录入时间约 85%。',
    impactMetrics: '单笔凭证平均处理耗时从 8 分钟压缩至 12 秒',
    recommendation: '对已生成分录执行快速抽检，点击一键过账即可同步至总账科目。'
  }
];
