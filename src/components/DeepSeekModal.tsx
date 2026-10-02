import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { DeepSeekConfig, DeepSeekModel } from '../types/deepseek';
import { testDeepSeekKey, saveStoredDeepSeekConfig } from '../services/deepseekClient';

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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string; latencyMs: number } | null>(null);

  if (!isOpen) return null;

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">DeepSeek AI 引擎配置</h2>
              <p className="text-xs text-slate-400">配置 DeepSeek API Key 驱动会计全流程自动化</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                DeepSeek API Key
              </label>
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
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-lg text-sm font-mono text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              API Key 仅安全储存于本地浏览器或后端会话，直接与 DeepSeek 官方 API 接口通讯。未填入时系统将自动以预置的高拟真会计智能引擎运行。
            </p>
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
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">严谨度 (Temperature)</span>
                <span className="font-mono text-cyan-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">数值越低越严谨，符合会计准则</span>
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
              <span className="text-[11px] text-slate-400">单次生成的最大上下文长度</span>
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
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-600/30 transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
