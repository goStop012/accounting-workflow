import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Shield, 
  Cpu, 
  ExternalLink,
  Zap,
  Lock,
  Sparkles,
  Database,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Clipboard,
  ClipboardCheck
} from 'lucide-react';
import { DeepSeekConfig, DeepSeekModel } from '../types/deepseek';
import { 
  testDeepSeekKey, 
  saveStoredDeepSeekConfig, 
  clearStoredDeepSeekConfig 
} from '../services/deepseekClient';

interface DeepSeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DeepSeekConfig;
  onSaveConfig: (newConfig: DeepSeekConfig) => void;
}

export const DeepSeekModal: React.FC<DeepSeekModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [model, setModel] = useState<DeepSeekModel>(config.model || 'deepseek-chat');
  const [temperature, setTemperature] = useState(config.temperature ?? 0.3);
  const [maxTokens, setMaxTokens] = useState(config.maxTokens ?? 3000);
  const [isMasked, setIsMasked] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string; latencyMs: number } | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  // 当弹窗打开或外部配置变更时，同步最新持久化配置
  useEffect(() => {
    if (isOpen) {
      setApiKey(config.apiKey || '');
      setModel(config.model || 'deepseek-chat');
      setTemperature(config.temperature ?? 0.3);
      setMaxTokens(config.maxTokens ?? 3000);
      setTestResult(null);
      setSaveSuccessNotice(false);
      setPasteNotice(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setApiKey(text.trim());
          setPasteNotice('已成功从系统剪贴板粘贴 API Key！');
          setTimeout(() => setPasteNotice(null), 2500);
          return;
        }
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
    
    // 移动端安全限制未能直接读取时的交互提示
    setPasteNotice('已激活常规键盘，您可直接点击输入框并长按选择“粘贴”');
    setTimeout(() => setPasteNotice(null), 3500);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testDeepSeekKey(apiKey, model);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ valid: false, message: `测试发生错误: ${e.message}`, latencyMs: 0 });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const updated: DeepSeekConfig = {
      ...config,
      apiKey: apiKey.trim(),
      model,
      temperature,
      maxTokens
    };
    saveStoredDeepSeekConfig(updated);
    onSaveConfig(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClearKey = () => {
    clearStoredDeepSeekConfig();
    const updated: DeepSeekConfig = {
      ...config,
      apiKey: ''
    };
    setApiKey('');
    onSaveConfig(updated);
    setTestResult(null);
    setPasteNotice('已清除本地与服务端保存的 API Key');
    setTimeout(() => setPasteNotice(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-semibold text-white">DeepSeek AI 引擎与 Key 配置</h2>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                  <Database className="w-3 h-3 text-emerald-400" />
                  支持持久化
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">配置 DeepSeek API Key，保存后自动永久安全持久化</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {saveSuccessNotice && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>DeepSeek API Key 与模型参数已成功持久化至本地与安全会话！</span>
            </div>
          )}

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                DeepSeek API Key
              </label>
              <div className="flex items-center gap-3">
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                    title="从本地存储中彻底清除此 API Key"
                  >
                    <Trash2 className="w-3 h-3" />
                    清除已存 Key
                  </button>
                )}
                <a
                  href="https://platform.deepseek.com/api_keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  获取 API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Mobile Paste Notification Banner */}
            {pasteNotice && (
              <div className="p-2.5 bg-cyan-950/70 border border-cyan-700/80 rounded-lg text-xs text-cyan-200 flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{pasteNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPasteNotice(null)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                style={{
                  WebkitTextSecurity: isMasked ? 'disc' : 'none'
                } as React.CSSProperties}
                className="w-full pl-3.5 pr-24 py-2.5 bg-slate-950/70 border border-slate-700 rounded-lg text-sm font-mono text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 select-text"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* One-click Paste from Clipboard button */}
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="px-2 py-1 text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 rounded transition-colors flex items-center gap-1 shadow-sm active:scale-95"
                  title="从手机/电脑剪贴板一键粘贴"
                >
                  <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px]">粘贴</span>
                </button>

                {/* Mask / Unmask Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMasked(!isMasked)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
                  title={isMasked ? '显示明文' : '遮罩保密'}
                >
                  {isMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Persistence Guarantee & Mobile Optimization Notice */}
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>移动端已全面解除安全键盘限制与粘贴封锁：</span>
              </div>
              <p>
                已规避手机系统将输入框误判为密码框而强制调起的限制粘贴安全键盘；您可直接点击右侧<strong className="text-cyan-300">「粘贴」</strong>按钮或在输入框中长按调出系统菜单快速粘贴。保存后将自动持久化至本地数据库，无需再次重复输入。
              </p>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              AI 模型选择
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModel('deepseek-chat')}
                className={`flex flex-col p-3 rounded-lg border text-left transition-all ${
                  model === 'deepseek-chat'
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-sm text-cyan-300">DeepSeek-V3</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-xs text-slate-400">deepseek-chat</span>
                <span className="text-[11px] text-slate-400 mt-1.5">极速响应，适合批量发票识别、分录生成与常规对账</span>
              </button>

              <button
                type="button"
                onClick={() => setModel('deepseek-reasoner')}
                className={`flex flex-col p-3 rounded-lg border text-left transition-all ${
                  model === 'deepseek-reasoner'
                    ? 'bg-purple-950/50 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-sm text-purple-300">DeepSeek-R1</span>
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-xs text-slate-400">deepseek-reasoner</span>
                <span className="text-[11px] text-slate-400 mt-1.5">深度逻辑推理，具备完整思维链，适合复杂账目与税务合规审查</span>
              </button>
            </div>
          </div>

          {/* Advanced Hyperparameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">严谨度 (Temperature)</span>
                <span className="font-mono text-cyan-400">
                  {model === 'deepseek-reasoner' ? '模型默认 (自动推演)' : temperature}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                disabled={model === 'deepseek-reasoner'}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <span className="text-[11px] text-slate-400">
                {model === 'deepseek-reasoner' 
                  ? '官方规范: R1 思考模式由模型自主控制思维链温度' 
                  : '财务结构化建议 0.0 - 0.3，输出最精确稳定'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">最大 Token 数</span>
                <span className="font-mono text-cyan-400">{maxTokens}</span>
              </div>
              <input
                type="number"
                min="500"
                max="8000"
                step="500"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                className="w-full px-2.5 py-1.5 bg-slate-950/60 border border-slate-700 rounded-md text-xs font-mono text-slate-200"
              />
              <span className="text-[11px] text-slate-400">单次生成的最大上下文长度 (支持8K)</span>
            </div>
          </div>

          {/* Latest API Feature Badges */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
            <div className="font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                已全面对齐最新 DeepSeek API 核心特性
              </span>
              <a
                href="https://api-docs.deepseek.com"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                官方文档
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Vision 视觉多模态直传发票原图</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>JSON Object 严格结构化输出</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span>R1 深度思考推演链 (CoT)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Context Caching 缓存命中降费 90%</span>
              </div>
            </div>
          </div>

          {/* Connection Test Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">测试 API 连通性</span>
                {testResult && (
                  <span className="text-xs font-mono text-slate-400">
                    ({testResult.latencyMs}ms)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting || !apiKey.trim()}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isTesting && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
                <span>{isTesting ? '正在验证...' : '连通性测试'}</span>
              </button>
            </div>

            {testResult && (
              <div className={`mt-2 p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                testResult.valid
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-700/60 text-rose-300'
              }`}>
                {testResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-medium">{testResult.valid ? '验证通过' : '验证失败'}</div>
                  <div className="text-slate-300">{testResult.message}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-4 py-2 min-h-[44px] text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-initial px-5 py-2 min-h-[44px] text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/30 transition-colors flex items-center justify-center"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
