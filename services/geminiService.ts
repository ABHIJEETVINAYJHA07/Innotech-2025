import { GoogleGenAI, Chat } from "@google/genai";

// The API key MUST be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a short financial tip for a small business owner.
 */
export const generateFinancialTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Generate a short, actionable financial tip for a small business owner in India. The tip should be easy to understand and implement. Keep it under 50 words.",
    });
    
    // Access the 'text' property directly for the response string.
    return response.text;
  } catch (error) {
    console.error("Error generating financial tip:", error);
    throw new Error("Failed to generate a financial tip. Please check your connection or API key.");
  }
};

/**
 * Gets a response from the DhanMitra chatbot using a persistent chat session.
 * @param prompt The user's message.
 * @param history The conversation history.
 */
export const getDhanMitraResponse = async (prompt: string, history: any[]): Promise<string> => {
    try {
        const chat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "You are DhanMitra, a friendly and helpful AI assistant for Indian small business owners using the UDHAAR SETU app. Your goal is to provide clear, concise, and encouraging advice on financial matters. Keep your answers brief and easy to understand. Always respond in the context of micro-loans and small business finance in India. If asked about your identity, introduce yourself as DhanMitra."
            }
        });

        const response = await chat.sendMessage({ message: prompt });
        return response.text;

    } catch (error) {
        console.error("Error getting DhanMitra response:", error);
        throw new Error("DhanMitra is currently unavailable. Please try again later.");
    }
};
