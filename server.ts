/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { generateRandomizedExam } from './src/data/questions';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxWVgEyVIs_j3PrCbE4XgrVzYuXkkgj48aehGmZegaLDZiULK9yo0IplAylQniD1uC8dA/exec';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API: Get randomized exam questions (ensuring secure & diverse test selection)
  app.get('/api/questions', (req, res) => {
    try {
      const examQuestions = generateRandomizedExam();
      res.json({ success: true, questions: examQuestions });
    } catch (error: any) {
      console.error('Error generating questions:', error);
      res.status(500).json({ success: false, error: 'No se pudieron generar las preguntas del examen.' });
    }
  });

  // API: Save exam results by proxying to the Google Apps Script Web App
  app.post('/api/results', async (req, res) => {
    try {
      const resultData = req.body;
      const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_GAS_URL;

      console.log('Enviando resultados a Google Apps Script:', gasUrl);

      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      const responseText = await response.text();
      console.log('Respuesta del Apps Script:', responseText);

      let parsedResponse;
      let isSuccess = false;

      if (response.ok && responseText) {
        const trimmedText = responseText.trim();
        if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
          try {
            parsedResponse = JSON.parse(trimmedText);
            // Standard Apps Script JSON responses:
            // e.g., { status: "success" }, { result: "success" }, { success: true }, etc.
            if (
              parsedResponse.status === 'success' ||
              parsedResponse.result === 'success' ||
              parsedResponse.success === true ||
              parsedResponse.status === 'ok' ||
              parsedResponse.result === 'ok'
            ) {
              isSuccess = true;
            } else if (
              parsedResponse.status === 'error' ||
              parsedResponse.success === false ||
              parsedResponse.result === 'error'
            ) {
              isSuccess = false;
            } else {
              // If it's a valid JSON but has other properties, let's treat it as success
              isSuccess = true;
            }
          } catch (e) {
            parsedResponse = { status: 'unknown', raw: responseText };
            isSuccess = false;
          }
        } else {
          // It's plain text. Check if it equals "success", "ok", "true", or contains them
          const lowerText = trimmedText.toLowerCase();
          if (
            lowerText === 'success' ||
            lowerText === 'ok' ||
            lowerText === 'true' ||
            lowerText.includes('success') ||
            (lowerText.includes('ok') && trimmedText.length < 50)
          ) {
            isSuccess = true;
            parsedResponse = { status: 'success', raw: responseText };
          } else {
            parsedResponse = { status: 'unknown', raw: responseText };
            isSuccess = false;
          }
        }
      } else {
        parsedResponse = { status: 'failed', raw: responseText };
        isSuccess = false;
      }

      res.json({
        success: isSuccess,
        status: response.status,
        data: parsedResponse,
      });
    } catch (error: any) {
      console.error('Error al enviar resultados a Google Sheets:', error);
      res.status(500).json({
        success: false,
        error: 'Error de servidor al intentar registrar el examen en Google Sheets.',
        details: error.message,
      });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Servidor] Ejecutándose en http://0.0.0.0:${PORT} en modo ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
