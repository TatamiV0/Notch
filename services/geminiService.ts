import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const streamGeminiResponse = async (
  prompt: string,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContentStream({
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        systemInstruction: "You are a helpful, concise AI assistant living in a small notch on a user's screen. Keep answers brief and witty.",
      }
    });

    let fullText = '';
    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMessage = "Sorry, I encountered an error.";
    onChunk(errorMessage);
    return errorMessage;
  }
};