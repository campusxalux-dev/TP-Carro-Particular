import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ExamResult } from '../types';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add required Workspace scopes
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If we have a user but no cached token, they might have refreshed or were already signed in.
        // In client-only flows with popup, we should ideally sign in again or prompt
        // since Firebase Auth token doesn't directly expose the Google OAuth Access Token on refresh.
        // However, we'll keep the cache or trigger sign-in.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Start Google sign-in flow
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Sign-In.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Error during Google Sign-In:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * GOOGLE DRIVE API FUNCTIONS
 */

// List spreadsheet files in user's Drive
export const listSpreadsheetsInDrive = async (token: string): Promise<{ id: string; name: string }[]> => {
  try {
    const q = encodeURIComponent("mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Drive API error: ${response.status}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error listing spreadsheets from Drive:', error);
    throw error;
  }
};

// Create a new spreadsheet in user's Drive with headers
export const createSpreadsheetInDrive = async (token: string, title: string): Promise<string> => {
  try {
    // 1. Create spreadsheet file using Sheets API v4
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: title,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Sheets creation error: ${response.status}`);
    }

    const spreadsheet = await response.json();
    const spreadsheetId = spreadsheet.spreadsheetId;
    const sheetName = spreadsheet.sheets?.[0]?.properties?.title || 'Sheet1';

    // 2. Initialize headers in the first sheet
    const headers = [
      'Fecha',
      'Hora',
      'Tipo Documento',
      'Identificación',
      'Nombre Completo',
      'Edad',
      'Empresa',
      'Antigüedad (años)',
      'Licencia',
      'Correctas',
      'Incorrectas',
      'Puntaje %',
      'Resultado',
      'Tiempo Empleado'
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:N1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headers],
      }),
    });

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating spreadsheet in Drive:', error);
    throw error;
  }
};

// Save a certificate / text report to Google Drive
export const saveReportToDrive = async (token: string, fileName: string, fileContent: string): Promise<string> => {
  try {
    const metadata = {
      name: fileName,
      mimeType: 'text/plain',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileContent], { type: 'text/plain' }));

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Drive File upload error: ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error saving report to Google Drive:', error);
    throw error;
  }
};

/**
 * GOOGLE SHEETS API FUNCTIONS
 */

// Get actual spreadsheet sheet (tab) names dynamically
export const getSpreadsheetTabs = async (token: string, spreadsheetId: string): Promise<string[]> => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(title))`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Sheets metadata error: ${response.status}`);
    }

    const data = await response.json();
    return data.sheets?.map((sheet: any) => sheet.properties?.title).filter(Boolean) || ['Sheet1'];
  } catch (error) {
    console.error('Error getting spreadsheet tabs:', error);
    return ['Sheet1'];
  }
};

// Read results from Google Sheet
export const readResultsFromSheet = async (token: string, spreadsheetId: string): Promise<any[]> => {
  try {
    const tabs = await getSpreadsheetTabs(token, spreadsheetId);
    const activeTab = tabs[0] || 'Sheet1';

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(activeTab)}!A2:N1000`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Sheets Read error: ${response.status}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    // Parse back to structural objects for the UI
    return rows.map((row: any, index: number) => ({
      id: `row_${index}`,
      fecha: row[0] || '',
      hora: row[1] || '',
      tipoIdentificacion: row[2] || '',
      numeroIdentificacion: row[3] || '',
      nombreCompleto: row[4] || '',
      edad: Number(row[5]) || 0,
      empresa: row[6] || '',
      antiguedad: Number(row[7]) || 0,
      tipoLicencia: row[8] || '',
      correctas: Number(row[9]) || 0,
      incorrectas: Number(row[10]) || 0,
      puntaje: parseFloat(row[11]?.replace('%', '')) || 0,
      resultado: row[12] || '',
      tiempoEmpleado: row[13] || '',
    }));
  } catch (error) {
    console.error('Error reading results from Google Sheet:', error);
    throw error;
  }
};

// Append a result row to Google Sheet
export const appendResultToSheet = async (token: string, spreadsheetId: string, result: ExamResult): Promise<any> => {
  try {
    const tabs = await getSpreadsheetTabs(token, spreadsheetId);
    const activeTab = tabs[0] || 'Sheet1';

    const rowValue = [
      result.fecha,
      result.hora,
      result.tipoIdentificacion,
      result.numeroIdentificacion,
      result.nombreCompleto,
      result.edad,
      result.empresa,
      result.antiguedad,
      result.tipoLicencia,
      result.correctas,
      result.incorrectas,
      `${result.puntaje}%`,
      result.resultado,
      result.tiempoEmpleado
    ];

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(activeTab)}!A:N:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValue],
      }),
    });

    if (!response.ok) {
      throw new Error(`Sheets Append error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error appending result to Google Sheet:', error);
    throw error;
  }
};
