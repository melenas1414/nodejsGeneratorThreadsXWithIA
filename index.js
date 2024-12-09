// index.js
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import callGrok from './grok.js';
import callGemini from './gemini.js';

import { TwitterApi } from 'twitter-api-v2';

const ultimoshilos = getFileMessages();

// Configuración de Twitter
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Función para generar contenido con Gemini Pro
async function generarContenido(tema) {
  try {
    let textoCompleto = [];
    let ultimoshilosString = JSON.stringify(ultimoshilos)
    switch (process.env.IA) {
      case 'GROK':
        textoCompleto = await callGrok(ultimoshilosString);
        break;
      case 'GEMINI':
        textoCompleto = await callGemini(ultimoshilosString);
        break;
      default:
        console.log('API no reconocida');
        throw new Error('API no reconocida');
    }
    ultimoshilos.push(textoCompleto);
    saveFileWithMessages(ultimoshilos);
    return textoCompleto;
  } catch (error) {
    console.error('Error al generar contenido con Gemini Pro:', error);
    throw error;
  }
}

// Función para publicar el hilo en Twitter
async function publicarHilo(tweets) {
  try {
    let respuesta = await twitterClient.v2.tweet(tweets[0].tweet);
    for (let i = 1; i < tweets.length; i++) {
      respuesta = await twitterClient.v2.reply(tweets[i].tweet, respuesta.data.id);
    }
    console.log('Hilo publicado exitosamente.');
  } catch (error) {
    console.error('Error al publicar el hilo en Twitter:', error);
    throw error;
  }
}

// Función principal para generar y publicar el hilo
async function generarYPublicarHilo() {
  const tema = process.env.TEMA; // Reemplaza esto con el tema que desees

  try {
    const tweets = await generarContenido(tema);
    await publicarHilo(tweets);
    console.log('Duermiendo');
    await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 60 * 12));
    generarYPublicarHilo();
  } catch (error) {
    console.error('Error en generarYPublicarHilo:', error);
  }
}

// Si deseas ejecutar la función inmediatamente al iniciar el script, descomenta la siguiente línea:
generarYPublicarHilo();

function saveFileWithMessages(ultimoshilos) {
  fs.writeFileSync('ultimoshilos.json', JSON.stringify(ultimoshilos, null, 2));
}
function getFileMessages() {
  try {
    const data = fs.readFileSync('ultimoshilos.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}
