/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  participantName: string;
  onAnswerSelected: (isCorrect: boolean, selectedOptionText: string, correctOptionText: string) => void;
  onNext: () => void;
}

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  participantName,
  onAnswerSelected,
  onNext,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Reset local state when moving to a new question
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
  }, [question.id]);

  const handleOptionClick = (optionIdx: number) => {
    if (hasAnswered) return;

    setSelectedOption(optionIdx);
    setHasAnswered(true);

    const isCorrect = optionIdx === question.correcta;
    onAnswerSelected(
      isCorrect,
      question.opciones[optionIdx],
      question.opciones[question.correcta]
    );
  };

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;

  // Map module IDs to human-readable names
  const getModuleName = (modId: number) => {
    switch (modId) {
      case 1:
        return 'Módulo 1: Normas de Tránsito';
      case 2:
        return 'Módulo 2: Señales de Tránsito';
      case 3:
        return 'Módulo 3: Mecánica y Seguridad';
      case 4:
        return 'Módulo 4: Primeros Auxilios';
      default:
        return 'Evaluación Teórica';
    }
  };

  return (
    <div id={`question-container-${question.id}`} className="space-y-4">
      {/* Progress Section */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-end text-xs font-bold">
          <span className="text-blue-900 uppercase font-display tracking-tight">
            Pregunta {questionIndex + 1} de {totalQuestions}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            {Math.round(progressPercentage)}% Completado
          </span>
        </div>
        {/* Animated Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question Text Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm mb-4">
        <h2 className="text-slate-800 font-semibold text-sm leading-relaxed">
          {question.pregunta}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.opciones.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === question.correcta;
          
          let cardStyle = 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/30 text-slate-700';
          let circleStyle = 'border-slate-300 bg-white text-transparent';
          let badgeText = '';

          if (hasAnswered) {
            if (isCorrectAnswer) {
              // Highlight correct answer in green
              cardStyle = 'border-2 border-green-500 bg-green-50 text-slate-800 font-semibold';
              circleStyle = 'border-green-500 bg-green-500 text-white';
              badgeText = 'Correcta';
            } else if (isSelected) {
              // Highlight selected incorrect answer in orange
              cardStyle = 'border-2 border-orange-500 bg-orange-50 text-slate-800 font-semibold';
              circleStyle = 'border-orange-500 bg-orange-500 text-white';
              badgeText = 'Tu respuesta';
            } else {
              // Dim other non-selected options
              cardStyle = 'border-slate-100 bg-slate-50/40 text-slate-400 cursor-not-allowed';
              circleStyle = 'border-slate-200 bg-slate-100 text-transparent';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={hasAnswered}
              className={`w-full p-3.5 text-left text-xs rounded-xl border flex items-center gap-3 transition-all duration-200 outline-none relative group ${cardStyle} ${
                !hasAnswered ? 'cursor-pointer active:scale-98' : ''
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold ${circleStyle}`}>
                {hasAnswered ? (isCorrectAnswer ? '✓' : isSelected ? '✕' : '') : ''}
              </div>
              <p className="text-xs font-medium flex-1 leading-normal pr-14">{option}</p>
              
              {badgeText && (
                <span className={`absolute right-4 text-[9px] font-bold uppercase tracking-tight ${
                  isCorrectAnswer ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {badgeText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Feedback & Next Action */}
      <AnimatePresence mode="wait">
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pt-2 space-y-3"
          >
            {/* Elegant warning statement beneath answered */}
            <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-wide">
              No se permite modificar la respuesta después de enviada
            </p>

            {/* Next Button formatted exactly like the theme */}
            <button
              onClick={onNext}
              className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
            >
              <span>SIGUIENTE PREGUNTA</span>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
