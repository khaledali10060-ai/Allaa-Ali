import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateStyleImages() {
  const prompts = [
    "Hand-drawn sketch illustration of a founder celebrating their first sale with a small team, warm paper texture background, friendly cartoon characters, soft colors, ink outlines, infographic style, notebook sketch aesthetic.",
    "Hand-drawn sketch illustration of a detailed startup roadmap blueprint with icons for branding, tech, and marketing, warm paper texture background, soft colors, ink outlines, infographic style, notebook sketch aesthetic.",
    "Hand-drawn sketch illustration of a balance scale showing 'Zero Risk' on one side and 'Success' on the other, warm paper texture background, friendly cartoon characters, soft colors, ink outlines, infographic style, notebook sketch aesthetic."
  ];

  const results = [];
  for (const prompt of prompts) {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        results.push(`data:image/png;base64,${part.inlineData.data}`);
      }
    }
  }
  return results;
}

// This is just for my reference to get the URLs if I could, 
// but I'll implement the generation logic in the component or just use placeholders for now and let the user see them.
// Actually, I'll just use the placeholders in the code and describe them.
