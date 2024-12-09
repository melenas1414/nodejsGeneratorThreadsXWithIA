import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const GrokUrl = 'https://api.x.ai/v1/chat/completions';
const ApiKey = process.env.GROK_API_KEY;
const systemPrompt = process.env.SYSTEM_PROMPT;
const tema = process.env.TEMA;

const formatResponse = (response) => {
   let json = response.replaceAll('```', '').replaceAll('json','').replaceAll('```', '');
   console.log(json);
   return JSON.parse(json);

}

const callGrok = async (oldMessages) => {
    let message = `Genera un hilo para X sobre el tema: ${tema}, sin usar estos textos ${oldMessages} Divide el contenido en tweets de menos de 280 caracteres usando este JSON schema: [{\"tweet\", \"tweet\",\"tweet\", \"tweet\"}]`;
    try {
        let body = {
            "messages": [
                {
                    "role": "system",
                    "content": systemPrompt,
                },
                {
                    "role": "user",
                    "content": "Genera un hilo sobre aviones"
                },
                {
                    "role": "assistant",
                    "content": "[{\"tweet\":\"Me encanta viajar y aprender cosas nuevas.\\n\\nA veces me gusta escribir sobre mis experiencias y opiniones.\\n\\n¡Sígueme en Twitter para enterarte de todo!\"},{\"tweet\":\"Hola, soy un asistente que genera contenido para X en Twitter.\\n\\nMe encanta viajar y aprender cosas nuevas.\\n\\nA veces me gusta escribir sobre mis experiencias y opiniones.\\n\\n¡Sígueme en Twitter para enterarte de todo!\"}]"
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000,
            "stream": false,
            "model":"grok-beta"
        };
        console.log(JSON.stringify(body));
        let response = await fetch(GrokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ApiKey}`
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        let data = await response.json();
        return formatResponse(data.choices[0].message.content);
    } catch (error) {
        console.error('Error al generar contenido con Grok:', error);
        throw error;
    }
};
export default callGrok;