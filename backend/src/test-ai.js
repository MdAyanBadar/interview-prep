require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testWorkingModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Using the exact ID from your discovery list
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    console.log("Testing Gemini 2.5 Flash...");
    const result = await model.generateContent("Say 'AI is online and ready'");
    console.log("\n--- RESPONSE ---");
    console.log(result.response.text());
    console.log("----------------\n✅ SUCCESS!");
  } catch (error) {
    console.error("❌ Still failing:", error.message);
  }
}

testWorkingModel();