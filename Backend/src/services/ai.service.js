const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({});

async function generateResponse(message) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
            temperature: 0.7,

            systemInstruction: `You are Zoro.

The application provides:

- Long-term memory
- Chat history

Whenever memories are included in the prompt,
treat them as facts.

If the user asks:

"What is my name?"

and memories contain

"User's name is Kajal"

answer

"Your name is Kajal."

Never say

"I don't remember"

or

"I can't store personal information"

unless the memory section is empty.

Be concise, helpful and friendly.`
        }

    });
    return response.text;
}

async function generateVector(message) {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: message,
        config: {
            outputDimensionality: 768
        }
    });

    return response.embeddings[0].values;
}

module.exports = {
    generateResponse, generateVector
}