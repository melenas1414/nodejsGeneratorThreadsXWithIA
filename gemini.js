import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;
const tema = process.env.TEMA;
const systemPrompt = process.env.SYSTEM_PROMPT;

const callGemini = async (oldMessages) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        const result = await model.generateContent(
            `${systemPrompt}.
            Genera un hilo para X sobre el tema: ${tema}, sin usar estos textos ${oldMessages} Divide el contenido en tweets de menos de 280 caracteres usando este JSON schema: 
            tweet = string
            Return: Array<tweet>`,
        );


        const response = result.response;
        const text = response.text();

        const textoCompleto = JSON.parse(result.response.text()); // Ajusta según la respuesta real de Gemini Pro

        return textoCompleto;
      } catch (error) {
        console.error('Error al generar contenido con Gemini Pro:', error);
        throw error;
      }
}
export default callGemini;