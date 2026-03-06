import { GoogleGenAI } from "@google/genai";
import { BusinessInsightResponse } from "../types";

export const getBusinessInsights = async (dashboardType: string, data: any): Promise<BusinessInsightResponse> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  try {
    const prompt = `
      Act as a senior strategic business analyst and retail consultant specialized in the Indian market. 
      Analyze the following ${dashboardType} data for an Indian retail vendor:
      ${JSON.stringify(data)}
      
      Tasks:
      1. Provide a concise summary of business health.
      2. Identify 3 key internal strengths.
      3. Identify 3 actionable recommendations.
      4. Search for current Indian market trends in this retail category and suggest how the vendor can capitalize on them right now.
      
      Constraints:
      - Use Indian Rupee (₹) for all currency mentions.
      - Use the Indian numbering system (Lakhs/Crores) where appropriate.
      - Format as clean Markdown. Use bold for key metrics.
      - Maintain a professional, executive tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Unable to generate insights at this time.";

    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return {
      text,
      sources: Array.from(new Map(sources.map(s => [s.uri, s])).values())
    };
  } catch (error) {
    console.error("Analysis Engine Error:", error);
    return {
      text: "Error connecting to strategic hub. Please try again later."
    };
  }
};

export const getSupportResponse = async (userMessage: string, chatHistory: { role: string, parts: string }[]): Promise<string> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  try {
    const prompt = `
      You are the Vyaparmitra Strategic Consultant, a digital assistant for Indian retail vendors.
      Your goal is to help users understand how to use the platform and answer business growth questions.
      Platform features: Executive Summary, Customer Analytics, Inventory Management (Aging, Supplier Matrix), Strategic Insights.
      User asked: "${userMessage}"
      Be helpful, concise, and professional. Use Indian business context. Avoid mentioning you are an AI; speak as a part of the platform's intelligence system.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Directly access the text property as per extracted properties guideline
    return response.text || "I'm sorry, I'm having trouble connecting right now. How else can I help you?";
  } catch (error) {
    console.error("Support API Error:", error);
    return "The consultant module is currently offline. Please try again in a moment.";
  }
};