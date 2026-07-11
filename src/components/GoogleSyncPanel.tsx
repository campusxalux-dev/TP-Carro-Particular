import React, { useState, useEffect } from 'react';
import {
  googleSignIn,
  logout,
  initAuth,
  listSpreadsheetsInDrive,
  createSpreadsheetInDrive,
  readResultsFromSheet
} from '../lib/googleApi';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Cloud,
  Database,
  FileSpreadsheet,
  Plus,
  CheckCircle,
  LogOut,
  RefreshCw,
  Info,
  History,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface GoogleSyncPanelProps {
  onSpreadsheetSelected: (id: string | null) => void;
  selectedSpreadsheetId: string | null;
}

export default function GoogleSyncPanel({
  onSpreadsheetSelected,
  selectedSpreadsheetId
}: GoogleSyncPanelProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
  // Google Drive & Sheets States
  const [spreadsheets, setSpreadsheets] = useState<{ id: string; name: string }[]>([]);
  const [isCreatingSheet, setIsCreatingSheet] = useState<boolean>(false);
  const [sheetHistory, setSheetHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setIsLoading(false);
        loadUserSpreadsheets(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync selected sheet history when selection or token changes
  useEffect(() => {
    if (token && selectedSpreadsheetId) {
      loadSheetHistory(token, selectedSpreadsheetId);
    } else {
      setSheetHistory([]);
    }
  }, [selectedSpreadsheetId, token]);

  // Fetch Spreadsheets from Google Drive
  const loadUserSpreadsheets = async (accessToken: string) => {
    try {
      setSyncError(null);
      const list = await listSpreadsheetsInDrive(accessToken);
      setSpreadsheets(list);
      
      // Auto-select "Historial de Simulacros VIAL" if it exists
      if (list.length > 0 && !selectedSpreadsheetId) {
        const found = list.find(s => s.name.includes('Historial de Simulacros VIAL'));
        if (found) {
          onSpreadsheetSelected(found.id);
        } else {
          // Fallback to first sheet found
          onSpreadsheetSelected(list[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error auto-loading spreadsheets:', err);
      setSyncError('No se pudieron listar los archivos de Google Drive.');
    }
  };

  // Fetch historical data from the selected Google Sheet
  const loadSheetHistory = async (accessToken: string, spreadsheetId: string) => {
    setIsLoadingHistory(true);
    setSyncError(null);
    try {
      const history = await readResultsFromSheet(accessToken, spreadsheetId);
      // Sort history descending by row/date
      setSheetHistory(history.reverse());
    } catch (err: any) {
      console.warn('Error fetching history (might be empty or header-only):', err);
      setSheetHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Google Login Trigger
  const handleLogin = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        await loadUserSpreadsheets(result.accessToken);
      }
    } catch (err: any) {
      setSyncError('Error de autenticación con Google.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Google Logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setSpreadsheets([]);
      onSpreadsheetSelected(null);
      setSheetHistory([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Create a brand new formatted Google Sheet inside their Google Drive
  const handleCreateNewSheet = async () => {
    if (!token) return;
    setIsCreatingSheet(true);
    setSyncError(null);
    try {
      const name = `Historial de Simulacros VIAL - ${user?.displayName || 'Usuario'}`;
      const newId = await createSpreadsheetInDrive(token, name);
      onSpreadsheetSelected(newId);
      
      // Refresh files list
      await loadUserSpreadsheets(token);
    } catch (err: any) {
      setSyncError('No se pudo crear la hoja de cálculo en tu Google Drive.');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center h-28">
        <RefreshCw size={20} className="text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
        <div className="flex items-center gap-2">
          <Cloud size={16} className="text-blue-600" />
          <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
            Nube Personal (Drive & Sheets)
          </h3>
        </div>
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-50 hover:bg-red-100/80 px-2 py-0.5 rounded transition-all cursor-pointer"
            title="Desconectar cuenta"
          >
            <LogOut size={10} />
            <span>Salir</span>
          </button>
        )}
      </div>

      {syncError && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-[9px] text-red-600 font-medium">
          {syncError}
        </div>
      )}

      {/* Auth State Router */}
      {!user ? (
        <div className="space-y-3 py-1 text-center">
          <p className="text-[10px] text-slate-500 leading-normal max-w-xs mx-auto">
            ¿Quieres guardar tus intentos en tu propia cuenta de Google Drive y Google Sheets? Conéctala de manera segura en un clic.
          </p>
          <button
            onClick={handleLogin}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:bg-slate-50/80 text-slate-700 hover:text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs shadow-xs hover:shadow-sm cursor-pointer transition-all active:scale-98"
          >
            {isSyncing ? (
              <RefreshCw size={14} className="animate-spin text-blue-600" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            )}
            <span>Vincular Cuenta de Google</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* User Info & Connection Badge */}
          <div className="flex items-center gap-2 bg-blue-50/60 p-2 rounded-xl border border-blue-100/60 text-xs">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Google User'}
                className="w-7 h-7 rounded-full object-cover border border-blue-200 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                {user.displayName?.charAt(0) || 'G'}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-slate-800 text-[10px] leading-tight truncate">
                {user.displayName}
              </p>
              <p className="text-[8px] text-slate-400 font-medium truncate">
                {user.email}
              </p>
            </div>
            <div className="ml-auto bg-green-500/10 text-green-700 text-[7px] font-bold px-1.5 py-0.5 rounded-full border border-green-500/20 uppercase tracking-wider select-none shrink-0">
              Activo
            </div>
          </div>

          {/* Spreadsheet Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Database size={10} className="text-blue-600" />
                Hoja de Destino
              </label>
              
              <button
                onClick={handleCreateNewSheet}
                disabled={isCreatingSheet}
                className="text-[8px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                {isCreatingSheet ? (
                  <RefreshCw size={8} className="animate-spin" />
                ) : (
                  <Plus size={8} />
                )}
                <span>Nueva Hoja VIAL</span>
              </button>
            </div>

            {spreadsheets.length === 0 ? (
              <div className="text-[10px] text-slate-400 bg-white p-3 rounded-xl border border-slate-150 text-center">
                No tienes hojas en Drive. ¡Crea una nueva arriba!
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedSpreadsheetId || ''}
                  onChange={(e) => onSpreadsheetSelected(e.target.value || null)}
                  className="w-full h-9 pl-8 pr-3 bg-white border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="" disabled>Selecciona una hoja de cálculo...</option>
                  {spreadsheets.map((sheet) => (
                    <option key={sheet.id} value={sheet.id}>
                      {sheet.name}
                    </option>
                  ))}
                </select>
                <FileSpreadsheet size={12} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Live History Dashboard (loaded directly from their sheet) */}
          {selectedSpreadsheetId && (
            <div className="border-t border-slate-200/60 pt-3 space-y-2.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <History size={10} className="text-blue-600" />
                  Intentos en esta Hoja
                </span>
                <span className="bg-blue-100 text-blue-800 text-[8px] px-1.5 py-0.2 rounded-full font-mono">
                  {sheetHistory.length} totales
                </span>
              </div>

              {isLoadingHistory ? (
                <div className="flex justify-center py-4 bg-white rounded-xl border border-slate-100">
                  <RefreshCw size={12} className="text-blue-600 animate-spin" />
                </div>
              ) : sheetHistory.length === 0 ? (
                <div className="text-[9px] text-slate-400 bg-white p-4 rounded-xl border border-slate-150 text-center leading-normal">
                  No hay intentos registrados en esta hoja aún. Tus próximos resultados se guardarán automáticamente aquí.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
                  {sheetHistory.slice(0, 4).map((attempt, idx) => {
                    const isPassed = attempt.resultado === 'Aprobado';
                    return (
                      <div
                        key={attempt.id || idx}
                        className="bg-white p-2 rounded-lg border border-slate-150 flex items-center justify-between text-[10px]"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">
                            {attempt.nombreCompleto}
                          </p>
                          <p className="text-[8px] text-slate-400 font-mono">
                            {attempt.fecha} • {attempt.tiempoEmpleado}
                          </p>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-1.5">
                          <div>
                            <p className={`font-bold font-mono text-[9px] ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                              {attempt.puntaje}%
                            </p>
                            <p className="text-[7px] text-slate-400 uppercase font-bold tracking-tight">
                              {attempt.resultado}
                            </p>
                          </div>
                          {isPassed ? (
                            <CheckCircle size={10} className="text-green-500 shrink-0" />
                          ) : (
                            <div className="w-2.5 h-2.5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[7px] font-bold shrink-0">✕</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {sheetHistory.length > 4 && (
                    <p className="text-center text-[8px] font-semibold text-slate-400 uppercase font-mono pt-1">
                      + ver {sheetHistory.length - 4} intentos más en Google Sheets
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
