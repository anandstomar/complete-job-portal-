import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:'AIzaSyDG8F_9sg3vSTk5cGp3JqkN4wAz6KldRH4'});

export  async function main(contents) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  });
  return response;
}
