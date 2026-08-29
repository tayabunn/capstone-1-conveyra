const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Say hello world in json',
      config: { responseMimeType: 'application/json' }
    });
    console.log('SUCCESS:', response.text);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

run();
