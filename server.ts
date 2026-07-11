/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { generateRandomizedExam } from './src/data/questions';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbjgMVJJdfgAwWhXKX4kI-1qlIMS-r8xhRuduQx5sLXRhTWk59rFi8Eaw7f6xUtJ3jV1w/exec';

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

  // API: Get all saved results (locally)
  app.get('/api/results', (req, res) => {
    try {
      const resultsFilePath = path.join(process.cwd(), 'results.json');
      if (fs.existsSync(resultsFilePath)) {
        const fileData = fs.readFileSync(resultsFilePath, 'utf-8');
        res.json({ success: true, results: JSON.parse(fileData) });
      } else {
        res.json({ success: true, results: [] });
      }
    } catch (error: any) {
      console.error('Error reading results:', error);
      res.status(500).json({ success: false, error: 'No se pudieron leer los resultados.' });
    }
  });

  // API: Save exam results by proxying to the Google Apps Script Web App
  app.post('/api/results', async (req, res) => {
    const resultData = req.body;
    const gasUrl = process.env.GOOGLE_APPS_SCRIPT_URL || DEFAULT_GAS_URL;

    // 1. Always save results locally as a secure backup first
    const resultsFilePath = path.join(process.cwd(), 'results.json');
    let currentResults = [];
    try {
      if (fs.existsSync(resultsFilePath)) {
        const fileData = fs.readFileSync(resultsFilePath, 'utf-8');
        currentResults = JSON.parse(fileData);
      }
    } catch (err) {
      console.error('Error al leer results.json backup:', err);
    }

    currentResults.push(resultData);

    let localSaveSuccess = false;
    try {
      fs.writeFileSync(resultsFilePath, JSON.stringify(currentResults, null, 2), 'utf-8');
      console.log('Resultados guardados localmente con éxito en results.json');
      localSaveSuccess = true;
    } catch (err) {
      console.error('Error al escribir en results.json:', err);
    }

    // 2. Try proxying to Google Apps Script (but proceed/succeed anyway if local backup is saved)
    try {
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
            if (
              parsedResponse.status === 'success' ||
              parsedResponse.result === 'success' ||
              parsedResponse.success === true ||
              parsedResponse.status === 'ok' ||
              parsedResponse.result === 'ok'
            ) {
              isSuccess = true;
            } else {
              // If we saved locally, we can still say success is true
              isSuccess = localSaveSuccess;
            }
          } catch (e) {
            parsedResponse = { status: 'unknown', raw: responseText };
            isSuccess = localSaveSuccess;
          }
        } else {
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
            isSuccess = localSaveSuccess;
          }
        }
      } else {
        parsedResponse = { status: 'failed', raw: responseText, note: 'Saved locally as backup' };
        isSuccess = localSaveSuccess;
      }

      res.json({
        success: isSuccess,
        status: response ? response.status : 200,
        data: parsedResponse,
      });
    } catch (error: any) {
      console.error('Error al enviar resultados a Google Sheets (usando respaldo local):', error);
      if (localSaveSuccess) {
        // Return success if we backed it up locally
        res.json({
          success: true,
          status: 200,
          data: { status: 'local_save_only', message: 'Resultados guardados localmente, falló conexión a Google Sheets.', error: error.message }
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Error de servidor al intentar registrar el examen localmente y en Google Sheets.',
          details: error.message,
        });
      }
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
