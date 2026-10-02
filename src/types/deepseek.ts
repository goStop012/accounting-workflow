/**
 * DeepSeek AI API 类型定义与配置规范
 */

export type DeepSeekModel = 'deepseek-chat' | 'deepseek-reasoner';

export interface DeepSeekConfig {
  apiKey: string;
  model: DeepSeekModel;
  baseUrl?: string; // 默认使用 https://api.deepseek.com
  temperature: number;
  maxTokens: number;
  useProxy: boolean; // 是否优先通过本地 /api/deepseek/chat 安全代理
}

export interface DeepSeekChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekTokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface DeepSeekChatChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string;
    reasoning_content?: string; // DeepSeek-R1 (deepseek-reasoner) 推理过程
  };
  finish_reason: string;
}

export interface DeepSeekApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: DeepSeekChatChoice[];
  usage?: DeepSeekTokenUsage;
}

export interface DeepSeekExecutionResult<T> {
  success: boolean;
  data?: T;
  rawText?: string;
  reasoning?: string;
  tokensUsed?: number;
  latencyMs?: number;
  error?: string;
  isSimulated?: boolean;
}
