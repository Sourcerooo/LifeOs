import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize only if key exists to prevent crashes in environments without keys
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
  if (!ai) {
    console.warn("Gemini API Key missing");
    return ["Add API Key to use AI features", "Break down task manually"];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Break down the following task into 3-5 smaller, actionable subtasks. Return only the subtasks strings in a JSON array. Task: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return ["Failed to generate subtasks. Try again."];
  }
};

export const suggestScheduleOptimization = async (schedule: any, tasks: any): Promise<string> => {
    if (!ai) return "AI Key missing.";

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Review this weekly schedule and todo list. Give one short, punchy motivational tip (max 20 words) to improve productivity based on this data. Schedule: ${JSON.stringify(schedule)}, Tasks: ${JSON.stringify(tasks)}`,
        });
        return response.text || "Keep pushing forward!";
    } catch (e) {
        return "Stay focused and conquer the day.";
    }
}