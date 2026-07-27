export const config = {
  runtime: 'edge',
};

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

const GROQ_MODEL_MAP: Record<string, string> = {
  'llama-3.3-70b': 'llama-3.3-70b-versatile',
  'mixtral-8x7b': 'mixtral-8x7b-32768',
  'deepseek-r1': 'deepseek-r1-distill-llama-70b'
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { messages, model = 'llama-3.3-70b' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    let targetModel = GROQ_MODEL_MAP[model] || 'llama-3.3-70b-versatile';

    if (groqKey && groqKey.trim().length > 5) {
      try {
        const groqMessages = [
          { role: 'system', content: SEERAH_SYSTEM_INSTRUCTION },
          ...messages.map((m: any) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: targetModel,
            messages: groqMessages,
            temperature: 0.7,
            max_tokens: 2048,
            stream: true
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Groq API error:", errorData);
          throw new Error("Groq API error: " + response.status);
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const readableStream = new ReadableStream({
          async start(controller) {
            const reader = response.body?.getReader();
            if (!reader) {
              controller.close();
              return;
            }
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                  if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    const dataStr = line.replace('data: ', '').trim();
                    if (dataStr) {
                      try {
                        const parsed = JSON.parse(dataStr);
                        const content = parsed.choices?.[0]?.delta?.content || '';
                        if (content) {
                          const payload = `data: ${JSON.stringify({ text: content, modelUsed: `Groq (${targetModel})` })}\n\n`;
                          controller.enqueue(encoder.encode(payload));
                        }
                      } catch (e) {
                         // parse error
                      }
                    }
                  }
                }
              }
            } catch (err) {
              controller.error(err);
            } finally {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            }
          }
        });

        return new Response(readableStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        });
      } catch (groqErr: any) {
        console.warn('Groq fetch Error, falling back:', groqErr.message || groqErr);
      }
    }

    const lastMsg = (messages[messages.length - 1]?.text || '').toLowerCase();
    let fallbackText = `### Seerah Knowledge Hub\n\nThank you for your question regarding the blessed life of Prophet Muhammad ﷺ.\n\n**Key Seerah Perspective:**\nThe life of Prophet Muhammad ﷺ serves as a comprehensive light (*Siraj munir*) for all aspects of human existence—personal character, worship, family dynamics, social justice, and leadership.\n\n> *"There has certainly been for you in the Messenger of Allah an excellent pattern for anyone whose hope is in Allah and the Last Day and [who] remembers Allah often."* (Surah Al-Ahzab 33:21)\n\n**Recommended Classical Literature:**\n- **Ar-Raheeq Al-Makhtum (The Sealed Nectar)** by Sheikh Safi-ur-Rahman Mubarakpuri\n- **Fiqh-us-Seerah** by Sheikh Muhammad al-Ghazali\n- **Sirat Ibn Hisham** (Primary Classical Record)\n\n*Tip: To activate dynamic AI generation with Llama 3.3 70B, Mixtral, or DeepSeek R1, configure your GROQ_API_KEY in the Secrets menu.*\n`;

    if (lastMsg.includes('badr') || lastMsg.includes('battle')) {
      fallbackText = `### The Battle of Badr (17 Ramadan 2 AH / 624 CE)\n\nThe Battle of Badr is known in the Qur'an as **Yawm al-Furqan** (*The Day of Criterion*) because it decisively separated truth from falsehood and established the young Muslim state in Medina as a formidable presence.\n\n#### Key Highlights:\n1. **Numbers**: 313 ill-equipped Muslims faced 1,000 heavily armored Makkan warriors.\n2. **Prophetic Prayer**: The Prophet ﷺ spent the night prior in intense supplication (*Du'a*) until his mantle fell from his shoulders.\n3. **Divine Support**: Allah sent 1,000 angels led by Archangel Jibril (AS) to strengthen the believers.\n4. **Treatment of Captives**: Captives were treated with unprecedented humanity. Captives who could read were freed if they taught 10 Muslim children in Medina to read and write.\n\n> *"And Allah has already given you victory at Badr while you were few in number. So fear Allah; perhaps you will be grateful."* (Surah Ali 'Imran 3:123)\n\n#### Moral Reflection:\n- Physical odds do not dictate outcome when faith, sincere effort, and ethical righteousness align.\n`;
    }

    const fallbackStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallbackText, modelUsed: 'Seerah Quest Knowledge Base (Fallback)' })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });
    return new Response(fallbackStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (err: any) {
    console.error('Edge API Error in /api/chat:', err);
    return new Response(JSON.stringify({ error: 'Failed to process chat message' }), { status: 500 });
  }
}
