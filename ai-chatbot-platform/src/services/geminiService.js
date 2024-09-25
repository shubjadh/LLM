const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Initializing GeminiService. API Key present:', !!apiKey);
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(message) {
    console.log('GeminiService: Generating response for message:', message);
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    try {
      console.log('Calling Gemini API...');
      const startTime = Date.now();
      const result = await model.generateContent(message);
      const response = await result.response;
      const endTime = Date.now();
      console.log(`GeminiService: Response generated successfully in ${endTime - startTime}ms`);
      return response.text();
    } catch (error) {
      console.error('GeminiService: Error generating response:', error);
      throw error;
    }
  }
}

module.exports = new GeminiService();