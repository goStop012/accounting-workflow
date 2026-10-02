/**
 * 生成符合中国国家税务总局发票版式规范的高拟真增值税发票 SVG Data URL
 * 用于发票原图预览以及直接提供给 DeepSeek 视觉识别 API (Vision API) 解析
 */

function createInvoiceSvg({
  title = '北京增值税专用发票',
  code = '1100234130',
  number = '88392014',
  date = '2026-09-15',
  buyerName = '北京智算星辰科技有限公司',
  buyerTaxNo = '91110108MA01XXXX78',
  sellerName = '阿里云计算有限公司',
  sellerTaxNo = '91330100799655058B',
  serviceName = '*信息技术服务*云服务器ECS及弹性公网带宽季度租用费',
  specification = '8C32G 高性能型',
  amount = '12,000.00',
  taxRate = '6%',
  taxAmount = '720.00',
  totalAmount = '12,720.00',
  totalChinese = '壹万贰仟柒佰贰拾元整'
}: {
  title?: string;
  code?: string;
  number?: string;
  date?: string;
  buyerName?: string;
  buyerTaxNo?: string;
  sellerName?: string;
  sellerTaxNo?: string;
  serviceName?: string;
  specification?: string;
  amount?: string;
  taxRate?: string;
  taxAmount?: string;
  totalAmount?: string;
  totalChinese?: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500" style="background:#fffcf0; font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;">
    <!-- Outer Border -->
    <rect x="15" y="15" width="770" height="470" fill="none" stroke="#7a5538" stroke-width="2" />
    <rect x="18" y="18" width="764" height="464" fill="none" stroke="#7a5538" stroke-width="0.8" />

    <!-- Top Header -->
    <text x="400" y="55" font-size="22" font-weight="bold" fill="#7a421b" text-anchor="middle" letter-spacing="4">${title}</text>
    
    <!-- Red Stamp / 监制章 -->
    <ellipse cx="400" cy="55" rx="55" ry="24" fill="none" stroke="#c92a2a" stroke-width="1.5" opacity="0.85"/>
    <text x="400" y="52" font-size="9" fill="#c92a2a" text-anchor="middle" font-weight="bold">全国统一发票监制章</text>
    <text x="400" y="65" font-size="8" fill="#c92a2a" text-anchor="middle">国家税务总局监制</text>

    <!-- Top Info -->
    <text x="540" y="42" font-size="12" fill="#5c3818" font-family="monospace">发票代码：<tspan font-weight="bold" fill="#111">${code}</tspan></text>
    <text x="540" y="60" font-size="12" fill="#5c3818" font-family="monospace">发票号码：<tspan font-weight="bold" fill="#111">${number}</tspan></text>
    <text x="540" y="78" font-size="12" fill="#5c3818">开票日期：${date}</text>

    <!-- Buyer Box -->
    <rect x="25" y="90" width="460" height="75" fill="none" stroke="#7a5538" stroke-width="1" />
    <text x="35" y="108" font-size="11" fill="#7a421b">购 称：<tspan fill="#111" font-weight="bold">${buyerName}</tspan></text>
    <text x="35" y="126" font-size="11" fill="#7a421b">买 码：<tspan fill="#111" font-family="monospace">${buyerTaxNo}</tspan></text>
    <text x="35" y="144" font-size="11" fill="#7a421b">方 址：北京市海淀区中关村南大街1号</text>
    <text x="35" y="158" font-size="11" fill="#7a421b">户 行：招商银行北京中关村支行 110908823101</text>

    <!-- Password Box -->
    <rect x="485" y="90" width="290" height="75" fill="none" stroke="#7a5538" stroke-width="1" />
    <text x="495" y="106" font-size="11" fill="#7a421b">密 码 区</text>
    <text x="500" y="125" font-size="10" font-family="monospace" fill="#555">01&lt;78/92+&gt;41&gt;&gt;01&lt;321+*9148&lt;14</text>
    <text x="500" y="140" font-size="10" font-family="monospace" fill="#555">451&gt;89-14+*542&gt;1045&lt;789*145&lt;</text>
    <text x="500" y="155" font-size="10" font-family="monospace" fill="#555">78&lt;1401&gt;984+*142&lt;7891+4012&gt;0</text>

    <!-- Items Table Header -->
    <rect x="25" y="170" width="750" height="25" fill="#fdf3e7" stroke="#7a5538" stroke-width="1" />
    <text x="35" y="187" font-size="11" font-weight="bold" fill="#7a421b">货物或应税劳务、服务名称</text>
    <text x="360" y="187" font-size="11" font-weight="bold" fill="#7a421b">规格型号</text>
    <text x="490" y="187" font-size="11" font-weight="bold" fill="#7a421b" text-anchor="end">金 额</text>
    <text x="560" y="187" font-size="11" font-weight="bold" fill="#7a421b" text-anchor="middle">税率</text>
    <text x="730" y="187" font-size="11" font-weight="bold" fill="#7a421b" text-anchor="end">税 额</text>

    <!-- Table Rows -->
    <rect x="25" y="195" width="750" height="110" fill="none" stroke="#7a5538" stroke-width="1" />
    <text x="35" y="220" font-size="11" fill="#111" font-weight="bold">${serviceName}</text>
    <text x="360" y="220" font-size="11" fill="#444">${specification}</text>
    <text x="490" y="220" font-size="12" font-family="monospace" fill="#111" text-anchor="end">¥${amount}</text>
    <text x="560" y="220" font-size="12" font-family="monospace" fill="#111" text-anchor="middle">${taxRate}</text>
    <text x="730" y="220" font-size="12" font-family="monospace" fill="#c92a2a" text-anchor="end" font-weight="bold">¥${taxAmount}</text>

    <!-- Total Row -->
    <rect x="25" y="305" width="750" height="32" fill="#fdf3e7" stroke="#7a5538" stroke-width="1" />
    <text x="35" y="326" font-size="12" font-weight="bold" fill="#7a421b">价税合计（大写）</text>
    <text x="170" y="326" font-size="12" font-weight="bold" fill="#111">${totalChinese}</text>
    <text x="520" y="326" font-size="12" font-weight="bold" fill="#7a421b">（小写）</text>
    <text x="730" y="326" font-size="14" font-weight="bold" font-family="monospace" fill="#c92a2a" text-anchor="end">¥${totalAmount}</text>

    <!-- Seller Box -->
    <rect x="25" y="342" width="460" height="75" fill="none" stroke="#7a5538" stroke-width="1" />
    <text x="35" y="360" font-size="11" fill="#7a421b">销 称：<tspan fill="#111" font-weight="bold">${sellerName}</tspan></text>
    <text x="35" y="378" font-size="11" fill="#7a421b">售 码：<tspan fill="#111" font-family="monospace">${sellerTaxNo}</tspan></text>
    <text x="35" y="396" font-size="11" fill="#7a421b">方 址：杭州市余杭区文一西路969号</text>
    <text x="35" y="410" font-size="11" fill="#7a421b">户 行：中国工商银行杭州支行 3301041928310</text>

    <!-- Note Box -->
    <rect x="485" y="342" width="290" height="75" fill="none" stroke="#7a5538" stroke-width="1" />
    <text x="495" y="360" font-size="11" fill="#7a421b">备 注：</text>
    <text x="495" y="380" font-size="10" fill="#666">季度云计算资源与弹性公网IP抵扣专票</text>
    <text x="495" y="396" font-size="10" fill="#666">可抵扣增值税进项税额</text>

    <!-- Footer Signatures -->
    <text x="35" y="440" font-size="11" fill="#7a421b">收款人：张晓琳</text>
    <text x="210" y="440" font-size="11" fill="#7a421b">复 核：钱立明</text>
    <text x="380" y="440" font-size="11" fill="#7a421b">开票人：系统自动开具</text>
    <text x="560" y="440" font-size="11" fill="#7a421b">销售方：（章）</text>

    <!-- Red Electronic Invoice Stamp (Bottom Right) -->
    <ellipse cx="680" cy="425" rx="45" ry="32" fill="none" stroke="#c92a2a" stroke-width="1.8" opacity="0.85"/>
    <text x="680" y="420" font-size="9" fill="#c92a2a" text-anchor="middle" font-weight="bold">${sellerName.slice(0, 8)}</text>
    <text x="680" y="435" font-size="8" fill="#c92a2a" text-anchor="middle">发票专用章</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const sampleInvoiceImages = {
  cloudServerInvoice: createInvoiceSvg({
    title: '北京增值税专用发票',
    code: '1100234130',
    number: '88392014',
    date: '2026-09-15',
    buyerName: '北京智算星辰科技有限公司',
    buyerTaxNo: '91110108MA01XXXX78',
    sellerName: '阿里云计算有限公司',
    sellerTaxNo: '91330100799655058B',
    serviceName: '*信息技术服务*云服务器ECS及弹性公网带宽季度租用费',
    specification: '8C32G 高性能型',
    amount: '12,000.00',
    taxRate: '6%',
    taxAmount: '720.00',
    totalAmount: '12,720.00',
    totalChinese: '壹万贰仟柒佰贰拾元整'
  }),

  hardwareChipInvoice: createInvoiceSvg({
    title: '上海增值税专用发票',
    code: '3100223140',
    number: '04918231',
    date: '2026-09-18',
    buyerName: '北京智算星辰科技有限公司',
    buyerTaxNo: '91110108MA01XXXX78',
    sellerName: '苏州精工微纳元器件制造有限公司',
    sellerTaxNo: '91320500MA1TXXXX22',
    serviceName: '*电子元器件*工业级传感核心模组芯片',
    specification: 'TX-900',
    amount: '35,000.00',
    taxRate: '13%',
    taxAmount: '4,550.00',
    totalAmount: '39,550.00',
    totalChinese: '叁万玖仟伍佰伍拾元整'
  }),

  gpuTestingInvoice: createInvoiceSvg({
    title: '上海增值税专用发票',
    code: '011002300111',
    number: '92841029',
    date: '2026-09-28',
    buyerName: '北京智算星辰科技有限公司',
    buyerTaxNo: '91110108MA01XXXX78',
    sellerName: '上海壁仞智能科技有限公司',
    sellerTaxNo: '91310115MA1HXXXX92',
    serviceName: '*计算芯片*BR104通用GPU加速卡与配套测试板卡',
    specification: 'BR104-PCIe-64G',
    amount: '68,000.00',
    taxRate: '13%',
    taxAmount: '8,840.00',
    totalAmount: '76,840.00',
    totalChinese: '柒万陆仟捌佰肆拾元整'
  })
};
