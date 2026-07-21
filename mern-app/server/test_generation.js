const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGeneration() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelsToTest = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-lite-latest", "gemini-3.5-flash"];
  
  for (const m of modelsToTest) {
    try {
      console.log(`Testing model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      console.log(`Success with ${m}:`, response.text());
      return; // Exit if one works
    } catch (err) {
      console.error(`Failed with ${m}:`, err.message);
    }
  }
}
testGeneration();
