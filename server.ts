import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const SEERAH_SYSTEM_INSTRUCTION = `
You are the AI Seerah Assistant for "Seerah Quest" (Seerah Hub), an authoritative, respectful, and educational platform for studying the Life of Prophet Muhammad ﷺ through authentic historical and Islamic sources.

When answering queries:
1. Always maintain deep respect for Prophet Muhammad ﷺ, his family (Ahl al-Bayt), and noble Companions (Sahabah RA).
2. Use honorifics such as "ﷺ" (peace and blessings be upon him) after mentioning Prophet Muhammad, and "RA" (Radhi Allahu 'Anhu / 'Anha) after companions.
3. Quote and cite authentic sources whenever relevant:
   - Primary Seerah texts: Ar-Raheeq Al-Makhtum (The Sealed Nectar), Sirat Ibn Hisham, Fiqh-us-Seerah by Sheikh Muhammad al-Ghazali, Za'ad al-Ma'ad by Ibn al-Qayyim.
   - Primary Hadith collections: Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami' at-Tirmidhi.
   - Qur'anic verses with Surah name and verse number.
4. Provide structured, engaging answers formatted in clean Markdown (use headings, bullet points, bold text, and blockquotes for verses/hadith).
5. Include 2-3 reflection questions or practical moral takeaways at the end of every answer to inspire personal character development.
6. If asked about controversial or nuanced historical claims, explain the authentic consensus of Muslim historians and scholars clearly and balanced.
`;

// Model mappings for Groq
const GROQ_MODEL_MAP: Record<string, string> = {
  'llama-3.3-70b': 'llama-3.3-70b-versatile',
  'mixtral-8x7b': 'mixtral-8x7b-32768',
  'deepseek-r1': 'deepseek-r1-distill-llama-70b'
};

// API Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'llama-3.3-70b' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Try GROQ API if key is present
    if (groqKey && groqKey.trim().length > 5) {
      try {
        const groq = new Groq({ apiKey: groqKey });
        const targetModel = GROQ_MODEL_MAP[model] || 'llama-3.3-70b-versatile';

        const groqMessages = [
          { role: 'system', content: SEERAH_SYSTEM_INSTRUCTION },
          ...messages.map((m: { sender: string; text: string }) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        ];

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await groq.chat.completions.create({
          messages: groqMessages as any,
          model: targetModel,
          temperature: 0.7,
          max_tokens: 2048,
          stream: true
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            res.write(`data: ${JSON.stringify({ text: content, modelUsed: 'Seerah AI Scholar' })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        return res.end();
      } catch (groqErr: any) {
        console.warn('Groq API Error, attempting fallback:', groqErr.message || groqErr);
      }
    }

    // 2. Try Gemini API fallback
    if (geminiKey && geminiKey.trim().length > 5) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const lastUserMessage = messages[messages.length - 1]?.text || 'Tell me about Prophet Muhammad ﷺ';

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${SEERAH_SYSTEM_INSTRUCTION}\n\nUser Question: ${lastUserMessage}` }] }
          ]
        });

        for await (const chunk of responseStream) {
          const textChunk = chunk.text;
          if (textChunk) {
            res.write(`data: ${JSON.stringify({ text: textChunk, modelUsed: 'Gemini 2.5 Flash' })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        return res.end();
      } catch (geminiErr: any) {
        console.warn('Gemini API Error, falling back to local Seerah knowledge:', geminiErr.message || geminiErr);
      }
    }

    // 3. Fallback Smart Static Response Generator if API keys are not provided
    const lastMsg = (messages[messages.length - 1]?.text || '').toLowerCase();
    let fallbackText = `### Seerah Knowledge Hub

Thank you for your question regarding the blessed life of Prophet Muhammad ﷺ.

**Key Seerah Perspective:**
The life of Prophet Muhammad ﷺ serves as a comprehensive light (*Siraj munit*) for all aspects of human existence—personal character, worship, family dynamics, social justice, and leadership.

> *"There has certainly been for you in the Messenger of Allah an excellent pattern for anyone whose hope is in Allah and the Last Day and [who] remembers Allah often."* (Surah Al-Ahzab 33:21)

**Recommended Classical Literature:**
- **Ar-Raheeq Al-Makhtum (The Sealed Nectar)** by Sheikh Safi-ur-Rahman Mubarakpuri
- **Fiqh-us-Seerah** by Sheikh Muhammad al-Ghazali
- **Sirat Ibn Hisham** (Primary Classical Record)
`;

    if (lastMsg.includes('badr') || lastMsg.includes('battle')) {
      fallbackText = `### The Battle of Badr (17 Ramadan 2 AH / 624 CE)

The Battle of Badr is known in the Qur'an as **Yawm al-Furqan** (*The Day of Criterion*) because it decisively separated truth from falsehood and established the young Muslim state in Medina as a formidable presence.

#### Key Highlights:
1. **Numbers**: 313 ill-equipped Muslims faced 1,000 heavily armored Makkan warriors.
2. **Prophetic Prayer**: The Prophet ﷺ spent the night prior in intense supplication (*Du'a*) until his mantle fell from his shoulders.
3. **Divine Support**: Allah sent 1,000 angels led by Archangel Jibril (AS) to strengthen the believers.
4. **Treatment of Captives**: Captives were treated with unprecedented humanity. Captives who could read were freed if they taught 10 Muslim children in Medina to read and write.

> *"And Allah has already given you victory at Badr while you were few in number. So fear Allah; perhaps you will be grateful."* (Surah Ali 'Imran 3:123)

#### Moral Reflection:
- Physical odds do not dictate outcome when faith, sincere effort, and ethical righteousness align.
`;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`data: ${JSON.stringify({ text: fallbackText, modelUsed: 'Seerah Quest Knowledge Base (Fallback)' })}\n\n`);
    res.write('data: [DONE]\n\n');
    return res.end();

  } catch (err: any) {
    console.error('API Error in /api/chat:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Seerah Quest' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Seerah Quest running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
