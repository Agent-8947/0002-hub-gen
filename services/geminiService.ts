
import { GoogleGenAI, Type } from "@google/genai";

// Проверяем наличие API ключа
const apiKey = process.env.API_KEY;
const isAIEnabled = Boolean(apiKey && apiKey.length > 0);

// Инициализируем AI только если есть ключ
let ai: GoogleGenAI | null = null;
if (isAIEnabled) {
  try {
    ai = new GoogleGenAI({ apiKey: apiKey! });
  } catch (e) {
    console.warn("Failed to initialize Gemini AI:", e);
  }
}

export const getWidgetAIAssistance = async (description: string) => {
  // Если AI не включен, возвращаем fallback данные
  if (!ai || !isAIEnabled) {
    console.log("AI assistance disabled: No API key configured");
    return {
      titles: [
        "Get in Touch Today!",
        "We're Here to Help",
        "Let's Connect"
      ],
      description: "Choose your preferred way to reach us. We typically respond within 24 hours."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given this widget description: "${description}", suggest 3 catchy call-to-action titles and 1 supportive sentence to increase conversion.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            description: { type: Type.STRING }
          },
          required: ["titles", "description"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Assistance Error:", error);
    return null;
  }
};

export const simulateTelegramSubmission = async (widgetName: string, channel: string, value: string) => {
  // Если AI не включен, возвращаем стандартный формат
  if (!ai || !isAIEnabled) {
    return `🚀 New Submission!\n\nWidget: ${widgetName}\nChannel: ${channel}\nContact: ${value}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Simulate a Telegram Bot notification for a new feedback submission.
      Widget: ${widgetName}
      Channel: ${channel}
      Value: ${value}
      Format the output as a professional Telegram message with emojis.`,
    });
    return response.text;
  } catch (error) {
    return `🚀 New Submission!\n\nWidget: ${widgetName}\nChannel: ${channel}\nContact: ${value}`;
  }
};
