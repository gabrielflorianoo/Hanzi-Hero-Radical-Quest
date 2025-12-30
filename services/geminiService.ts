
import { GoogleGenAI } from "@google/genai";
import { Radical } from "../types";

export const getMnemonicForRadical = async (radical: Radical): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const variantInfo = radical.variant && radical.variant !== radical.character 
      ? `Important: It also appears as the variant form "${radical.variant}" (the 'side' or 'radical' version).` 
      : "";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert Chinese etymology teacher. Create a rich, detailed mnemonic story to help remember the Chinese radical "${radical.character}" (${radical.pinyin}), which means "${radical.meaning}". 
      ${variantInfo}
      RULES:
      1. The story must be at least 150 characters long.
      2. Explain the visual shape of the character and how it relates to the meaning.
      3. Mention how it transforms into "${radical.variant || radical.character}" in actual characters.
      4. Use at least one of these example characters in your story explanation: ${radical.examples.join(', ')}.
      5. Make the tone helpful, encouraging, and slightly legendary.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 1000,
      }
    });

    return response.text || "Desculpe, não consegui gerar a história agora. Tente novamente!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Os espíritos dos radicais estão quietos hoje. Por favor, tente novamente mais tarde.";
  }
};
