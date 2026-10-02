import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // DeepSeek API proxy route
  app.post('/api/deepseek/chat', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const userApiKey = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
      const apiKey = userApiKey || process.env.DEEPSEEK_API_KEY;

      if (!apiKey) {
        return res.status(401).json({
          error: '缺少 DeepSeek API Key。请在前端设置面板填入您的 DeepSeek API Key，或配置环境变量 DEEPSEEK_API_KEY。',
          code: 'MISSING_API_KEY'
        });
      }

      const { messages, model = 'deepseek-chat', temperature = 0.3, max_tokens = 4000, response_format } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: '无效的 messages 参数' });
      }

      const requestPayload: Record<string, unknown> = {
        model,
        messages,
        max_tokens,
      };

      // 遵循 DeepSeek 官方指南：deepseek-reasoner (R1) 不支持传入自定义 temperature / top_p
      if (model !== 'deepseek-reasoner' && typeof temperature === 'number') {
        requestPayload.temperature = temperature;
      }

      // 仅当 deepseek-chat 且显式要求 JSON 模式时传入 response_format
      if (response_format && model === 'deepseek-chat') {
        requestPayload.response_format = response_format;
      }

      const deepseekResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestPayload),
      });

      if (!deepseekResponse.ok) {
        const errorText = await deepseekResponse.text();
        let parsedError;
        try {
          parsedError = JSON.parse(errorText);
        } catch {
          parsedError = { raw: errorText };
        }
        return res.status(deepseekResponse.status).json({
          error: `DeepSeek API 调用失败 (${deepseekResponse.status})`,
          details: parsedError,
        });
      }

      const data = await deepseekResponse.json();
      return res.json(data);
    } catch (err: any) {
      console.error('DeepSeek Proxy Error:', err);
      return res.status(500).json({
        error: '服务器代理请求异常',
        message: err.message,
      });
    }
  });

  // DeepSeek API key verification route
  app.post('/api/deepseek/test', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const userApiKey = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';
      const apiKey = userApiKey || process.env.DEEPSEEK_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ valid: false, error: '未提供 API Key' });
      }

      const testResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });

      if (testResponse.ok) {
        return res.json({ valid: true, message: 'DeepSeek API Key 验证通过！' });
      } else {
        const errData = await testResponse.text();
        return res.status(testResponse.status).json({
          valid: false,
          error: `认证失败: ${testResponse.statusText}`,
          details: errData,
        });
      }
    } catch (err: any) {
      return res.status(500).json({ valid: false, error: err.message });
    }
  });

  // In production or when built, serve dist static files; otherwise attach Vite dev middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
