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

export type DeepSeekMessageContentPart = 
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export type DeepSeekMessageContent = string | DeepSeekMessageContentPart[];

export interface DeepSeekChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: DeepSeekMessageContent;
}

export interface DeepSeekTokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_cache_hit_tokens?: number; // DeepSeek 提示词缓存命中 (节省 90% 费用)
  prompt_cache_miss_tokens?: number; // 提示词缓存未命中
}

export interface DeepSeekFunctionCall {
  name: string;
  arguments: string;
}

export interface DeepSeekToolCall {
  id: string;
  type: 'function';
  function: DeepSeekFunctionCall;
}

export interface DeepSeekChatChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string;
    reasoning_content?: string; // DeepSeek-R1 (deepseek-reasoner) 思考链 (Chain-of-Thought)
    tool_calls?: DeepSeekToolCall[];
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
  reasoning?: string; // DeepSeek-R1 深度思考推理过程
  tokensUsed?: number;
  promptTokens?: number;
  completionTokens?: number;
  cacheHitTokens?: number; // 缓存命中 Token 数
  latencyMs?: number;
  error?: string;
  isSimulated?: boolean;
  modelUsed?: DeepSeekModel;
}
