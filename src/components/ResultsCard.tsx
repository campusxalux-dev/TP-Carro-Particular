/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Participant, AnswerDetail, ExamResult } from '../types';
import { CheckCircle, XCircle, Calendar, Clock, Award, Briefcase, FileText, User, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsCardProps {
  participant: Participant;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  score: number; // 0 - 100
  timeElapsed: string;
  answerDetails: AnswerDetail[];
  isSubmitting: boolean;
  submissionError: string | null;
  submissionSuccess: boolean;
  onRetrySubmit: () => void;
  onFinish: () => void;
}

export default function ResultsCard({
  participant,
  correctCount,
  incorrectCount,
  totalQuestions,
  score,
  timeElapsed,
  answerDetails,
  isSubmitting,
  submissionError,
  submissionSuccess,
  onRetrySubmit,
  onFinish,
}: ResultsCardProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const isApproved = score >= 80; // 80% passing grade is the standard for driving exams

  // Get current Date and Time
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  return (
    <div id="results-card-container" className="space-y-5 pt-1">
      {/* Top Approval Banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-5 rounded-2xl border text-center space-y-2.5 shadow-sm ${
          isApproved
            ? 'bg-green-50 border-green-200 text-slate-800 shadow-green-500/5'
            : 'bg-orange-50 border-orange-200 text-slate-800 shadow-orange-500/5'
        }`}
      >
        <div className="flex justify-center">
          {isApproved ? (
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">✓</div>
          ) : (
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold">✕</div>
          )}
        </div>
        <h2 className={`text-lg font-black tracking-tight uppercase font-display ${
          isApproved ? 'text-green-700' : 'text-orange-700'
        }`}>
          {isApproved ? 'Aprobado' : 'No aprobado'}
        </h2>
        <p className="text-xs font-semibold text-slate-600 max-w-xs mx-auto leading-relaxed">
          {isApproved
            ? '¡Felicitaciones! Cumple con los requisitos teóricos obligatorios de seguridad vial.'
            : 'No se alcanzó el puntaje mínimo requerido (80%). Le sugerimos repasar el banco de preguntas e intentar nuevamente.'}
        </p>
      </motion.div>

      {/* Main Scorecard */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
          <FileText size={12} className="text-blue-600" />
          Resumen de la Evaluación
        </h3>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nota Final</span>
            <span className={`text-xl font-extrabold font-mono ${isApproved ? 'text-green-600' : 'text-orange-600'}`}>
              {score}/100
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-2xs">
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tiempo</span>
            <span className="text-sm font-extrabold text-slate-700 font-mono flex h-6 items-center justify-center">
              {timeElapsed}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              ✓
            </div>
            <div>
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Correctas</span>
              <span className="text-xs font-bold text-slate-700 font-mono">{correctCount}/{totalQuestions}</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              ✕
            </div>
            <div>
              <span className="block text-[8px] font-bold text-slate-400 uppercase">Malas</span>
              <span className="text-xs font-bold text-slate-700 font-mono">{incorrectCount}/{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Participant Profile info */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <User size={12} className="text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-slate-400 uppercase block text-[8px] tracking-wider">Aspirante</span>
              <span className="font-bold text-slate-800 tracking-wide uppercase text-2xs">{participant.nombreCompleto}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-400 uppercase block text-[8px] tracking-wider">Identificación</span>
              <span className="font-semibold text-slate-700 text-3xs">{participant.tipoIdentificacion}: {participant.numeroIdentificacion}</span>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase block text-[8px] tracking-wider">Edad / Antigüedad</span>
              <span className="font-semibold text-slate-700 text-3xs">{participant.edad} años / {participant.antiguedad} años</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-start gap-1">
              <Briefcase size={12} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-400 uppercase block text-[8px] tracking-wider">Empresa</span>
                <span className="font-semibold text-slate-700 uppercase text-3xs truncate block max-w-[100px]">{participant.empresa}</span>
              </div>
            </div>
            <div className="flex items-start gap-1">
              <Award size={12} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-400 uppercase block text-[8px] tracking-wider">Licencia</span>
                <span className="font-bold text-blue-700 uppercase text-3xs">Cat. {participant.tipoLicencia}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex justify-between items-center text-[9px] text-slate-400 px-1 font-mono uppercase">
          <span className="flex items-center gap-1 font-semibold">
            <Calendar size={9} />
            {fechaStr}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Clock size={9} />
            {horaStr}
          </span>
        </div>
      </div>

      {/* Cloud Sheets Sync Status */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs shadow-2xs">
        {isSubmitting ? (
          <div className="flex items-center gap-2.5 text-blue-600">
            <RefreshCw size={14} className="animate-spin shrink-0" />
            <p className="font-bold text-3xs uppercase tracking-wide">Sincronizando con Google Sheets...</p>
          </div>
        ) : submissionSuccess ? (
          <div className="flex items-start gap-2 text-green-800 bg-green-50 p-2.5 rounded-lg border border-green-200">
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">✓</div>
            <div>
              <p className="font-bold text-xs text-green-700">Sincronizado correctamente</p>
              <p className="text-[9px] font-medium text-slate-500">Evaluación registrada en el sistema de Google Sheets.</p>
            </div>
          </div>
        ) : submissionError ? (
          <div className="space-y-2 bg-orange-50 p-2.5 rounded-lg border border-orange-200">
            <div className="flex items-start gap-2 text-orange-800">
              <AlertCircle size={14} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-orange-700">Falla de Sincronización</p>
                <p className="text-[9px] font-medium text-slate-500">{submissionError}</p>
              </div>
            </div>
            <button
              onClick={onRetrySubmit}
              className="flex items-center gap-1 text-orange-700 bg-orange-100 hover:bg-orange-200 px-2 py-1 rounded-md font-bold transition-colors cursor-pointer text-[9px] uppercase tracking-wider"
            >
              <RefreshCw size={8} /> Reintentar envío
            </button>
          </div>
        ) : null}
      </div>

      {/* Accordion list to review full questions details */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 transition-colors flex justify-between items-center text-[10px] font-bold text-slate-700 cursor-pointer uppercase tracking-tight"
        >
          <span className="flex items-center gap-1.5">
            <FileText size={12} className="text-blue-500" />
            Detalles ({answerDetails.length} preguntas)
          </span>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showDetails && (
          <div className="divide-y divide-slate-150 max-h-56 overflow-y-auto p-2 space-y-2 scrollbar-thin bg-white">
            {answerDetails.map((item, idx) => (
              <div key={idx} className="p-2 text-xs space-y-1">
                <div className="flex items-start gap-2 justify-between">
                  <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.esCorrecta ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    Pregunta {item.numero}
                  </span>
                  <span className={`text-[9px] font-bold uppercase tracking-tight ${item.esCorrecta ? 'text-green-600' : 'text-orange-600'}`}>
                    {item.esCorrecta ? '✓ Correcta' : '✗ Incorrecta'}
                  </span>
                </div>
                <p className="font-bold text-slate-800 leading-normal text-3xs">{item.pregunta}</p>
                <div className="bg-slate-50 rounded p-2 space-y-0.5 text-[10px]">
                  <p className="text-slate-500">
                    <span className="font-bold text-slate-400 text-[9px] uppercase block">Tu respuesta:</span>
                    <span className={item.esCorrecta ? 'text-green-700 font-semibold' : 'text-orange-700 font-semibold'}>
                      {item.seleccionada}
                    </span>
                  </p>
                  {!item.esCorrecta && (
                    <p className="text-slate-500 border-t border-slate-100/50 pt-1 mt-1">
                      <span className="font-bold text-slate-400 text-[9px] uppercase block">Respuesta correcta:</span>
                      <span className="text-green-700 font-semibold">{item.correctaTexto}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Finish and Return Button */}
      <button
        onClick={onFinish}
        className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
      >
        <span>Finalizar evaluación</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
}
