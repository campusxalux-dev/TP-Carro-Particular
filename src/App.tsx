/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Participant, Question, AnswerDetail, ExamResult } from './types';
import RegistrationForm from './components/RegistrationForm';
import QuestionCard from './components/QuestionCard';
import ResultsCard from './components/ResultsCard';
import { Car, Info, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateRandomizedExam } from './data/questions';
import vialLogo from './assets/images/vial_logo_1783784221633.jpg';

type Step = 'REGISTER' | 'LOADING' | 'EXAM' | 'RESULTS';

export default function App() {
  const [step, setStep] = useState<Step>('REGISTER');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answerDetails, setAnswerDetails] = useState<AnswerDetail[]>([]);
  
  // Scoring
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Submission State (Cloud Sync)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Start the timer when we are on the EXAM step
  useEffect(() => {
    if (step === 'EXAM') {
      setSecondsElapsed(0);
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [step]);

  // Formatter for elapsed timer
  const formatTime = (totalSecs: number): string => {
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Fetch questions from our secure backend API on demand with local fallback
  const handleStartExam = async (registeredParticipant: Participant) => {
    setParticipant(registeredParticipant);
    setStep('LOADING');

    try {
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error(`Servidor respondió con código de estado ${response.status}`);
      }
      const data = await response.json();

      if (data.success && data.questions) {
        setQuestions(data.questions);
        setCurrentIdx(0);
        setAnswerDetails([]);
        setCorrectCount(0);
        setIncorrectCount(0);
        setSubmissionSuccess(false);
        setSubmissionError(null);
        setStep('EXAM');
      } else {
        throw new Error(data.error || 'No se recibieron preguntas válidas del servidor.');
      }
    } catch (error: any) {
      console.warn('Error al cargar examen desde el servidor, usando generación local como respaldo:', error);
      try {
        const localQuestions = generateRandomizedExam();
        if (localQuestions && localQuestions.length > 0) {
          setQuestions(localQuestions);
          setCurrentIdx(0);
          setAnswerDetails([]);
          setCorrectCount(0);
          setIncorrectCount(0);
          setSubmissionSuccess(false);
          setSubmissionError(null);
          // Small delay for natural user experience
          setTimeout(() => {
            setStep('EXAM');
          }, 800);
        } else {
          throw new Error('La generación de preguntas local retornó una lista vacía.');
        }
      } catch (localError: any) {
        console.error('Fatal: Falló la generación local de preguntas:', localError);
        alert('Error de conexión: No pudimos cargar el examen de ninguna fuente. Por favor, inténtelo de nuevo.');
        setStep('REGISTER');
      }
    }
  };

  // Handle answering an individual question
  const handleAnswerSelected = (
    isCorrect: boolean,
    selectedOptionText: string,
    correctOptionText: string
  ) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }

    // Record the detailed answer for our sheets submission and review panel
    const newDetail: AnswerDetail = {
      numero: currentIdx + 1,
      pregunta: questions[currentIdx].pregunta,
      seleccionada: selectedOptionText,
      correctaTexto: correctOptionText,
      esCorrecta: isCorrect,
      modulo: questions[currentIdx].modulo,
    };

    setAnswerDetails((prev) => [...prev, newDetail]);
  };

  // Move to next question or complete evaluation
  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished all questions! Complete the test and submit automatically
      finishAndSaveResults();
    }
  };

  // Calculate score and trigger automatic Google Sheets synchronization
  const finishAndSaveResults = () => {
    setStep('RESULTS');

    // Calculate final score
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const totalTimeStr = formatTime(secondsElapsed);
    
    // We submit automatically
    submitResultsToBackend(finalScore, totalTimeStr);
  };

  const submitResultsToBackend = async (finalScore: number, totalTimeStr: string) => {
    if (!participant) return;

    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(false);

    const now = new Date();
    const fecha = now.toLocaleDateString('es-CO');
    const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Calculate score per module/block
    const moduleNames: Record<number, string> = {
      1: 'Normativa Vial en Colombia',
      2: 'Señales de Tránsito y Señalización Vial',
      3: 'Mecánica Básica y Primeros Auxilios',
      4: 'Conducción Defensiva y Seguridad Vial',
    };

    const calificacionesPorBloque = [1, 2, 3, 4].map((m) => {
      const detailsInModule = answerDetails.filter((d) => d.modulo === m);
      const correctInModule = detailsInModule.filter((d) => d.esCorrecta).length;
      const totalInModule = detailsInModule.length;
      const scoreInModule = totalInModule > 0 ? Math.round((correctInModule / totalInModule) * 100) : 0;
      return {
        modulo: m,
        nombre: moduleNames[m],
        correctas: correctInModule,
        total: totalInModule,
        puntaje: scoreInModule,
        resultado: (scoreInModule >= 80 ? 'Aprobado' : 'No aprobado') as 'Aprobado' | 'No aprobado',
      };
    });

    const payload: ExamResult = {
      fecha,
      hora,
      tipoIdentificacion: participant.tipoIdentificacion,
      numeroIdentificacion: participant.numeroIdentificacion,
      nombreCompleto: participant.nombreCompleto,
      edad: Number(participant.edad),
      empresa: participant.empresa,
      antiguedad: Number(participant.antiguedad),
      tipoLicencia: participant.tipoLicencia,
      correctas: correctCount,
      incorrectas: incorrectCount,
      puntaje: finalScore,
      resultado: finalScore >= 80 ? 'Aprobado' : 'No aprobado',
      tiempoEmpleado: totalTimeStr,
      detalles: answerDetails,
      calificacionesPorBloque,
    };

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`El servidor respondió con código ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSubmissionSuccess(true);
      } else {
        throw new Error(data.error || 'Error al sincronizar resultados.');
      }
    } catch (err: any) {
      console.error('Error en sincronización con Sheets:', err);
      setSubmissionError(err.message || 'No se pudo contactar con la API de Google Sheets.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Allow manual retry if the network drops
  const handleRetrySubmit = () => {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const totalTimeStr = formatTime(secondsElapsed);
    submitResultsToBackend(finalScore, totalTimeStr);
  };

  // Reset exam state to return to register screen
  const handleReset = () => {
    setStep('REGISTER');
    setParticipant(null);
    setQuestions([]);
    setCurrentIdx(0);
    setAnswerDetails([]);
    setCorrectCount(0);
    setIncorrectCount(0);
    setSecondsElapsed(0);
    setSubmissionSuccess(false);
    setSubmissionError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-6 md:p-8 bg-slate-100 selection:bg-blue-100 selection:text-blue-800 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-700 z-10"></div>
      <div className="absolute top-12 left-12 text-slate-200/50 font-bold text-9xl select-none font-display pointer-events-none hidden xl:block">DRIVE</div>
      <div className="absolute bottom-12 right-12 text-slate-200/50 font-bold text-9xl select-none font-display pointer-events-none hidden xl:block">SAFETY</div>

      {/* Main Container Wrapper (Centers the simulator and places the side cards) */}
      <div className="flex items-center justify-center w-full max-w-5xl">
        
        {/* Main Mobile Container (Centered Preview Simulator) */}
        <div className="relative w-full sm:w-[375px] sm:h-[800px] bg-white sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 overflow-hidden flex flex-col justify-between transform transition-all duration-300">
          
          {/* Phone Notch Ornament */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-2xl z-50 hidden sm:block"></div>

          {/* Dynamic App Brand Header */}
          <div className="bg-blue-700 pt-8 sm:pt-10 pb-4 px-6 shrink-0 shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex items-center gap-2 select-none">
                <img
                  src={vialLogo}
                  alt="Instituto Colombiano de Seguridad y Salud en el Trabajo"
                  referrerPolicy="no-referrer"
                  className="h-[51px] w-[145px] object-contain bg-[#fffefe] rounded p-1 shadow-sm border border-white/20"
                />
              </div>
              <div className="text-white/80 text-[10px] font-bold tracking-wider uppercase font-mono">
                {step === 'REGISTER' && 'Registro Inicial'}
                {step === 'LOADING' && 'Preparando...'}
                {step === 'EXAM' && `Módulo ${questions[currentIdx]?.modulo || 1}`}
                {step === 'RESULTS' && 'Resultados'}
              </div>
            </div>
            <h1 className="text-white font-black text-xs leading-tight uppercase tracking-tight font-display">
              Evaluación Teórica para Conductores
            </h1>
            <p className="text-[10px] font-bold text-yellow-300 tracking-wider uppercase opacity-90">
              Particular
            </p>
          </div>

          {/* User Identity Bar (Visible when registered) */}
          {participant && (
            <div className="bg-blue-50 px-6 py-2.5 border-b border-blue-100 flex justify-between items-center shrink-0">
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Aspirante</span>
                <span className="text-xs font-bold text-slate-800 uppercase truncate max-w-[200px]" title={participant.nombreCompleto}>
                  {participant.nombreCompleto}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] text-slate-400 uppercase font-semibold">Licencia</span>
                <div className="text-xs font-extrabold text-blue-700 font-mono">
                  {participant.tipoLicencia}
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Inner Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-start bg-white scrollbar-thin">
            
            {/* Step Router with Animations */}
            <AnimatePresence mode="wait">
              {step === 'REGISTER' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  {/* Intro message */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-slate-600">
                    <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">Registro Obligatorio</p>
                      <p className="text-[10px] leading-normal opacity-95">
                        Por favor, complete sus datos en mayúsculas antes de iniciar la evaluación de 40 preguntas aleatorias. Se requiere un puntaje del 80% o superior para aprobar.
                      </p>
                    </div>
                  </div>

                  <RegistrationForm onStartExam={handleStartExam} />
                </motion.div>
              )}

              {step === 'LOADING' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4"
                >
                  <div className="relative">
                    <RefreshCw className="text-blue-600 w-12 h-12 animate-spin shrink-0 stroke-[1.5]" />
                    <span className="absolute inset-0 m-auto w-3 h-3 bg-blue-600 rounded-full animate-ping"></span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Generando Examen Único</h3>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Seleccionando preguntas aleatorias y estructurando los módulos reglamentarios...
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'EXAM' && questions.length > 0 && (
                <motion.div
                  key="exam"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="space-y-1"
                >
                  <QuestionCard
                    question={questions[currentIdx]}
                    questionIndex={currentIdx}
                    totalQuestions={questions.length}
                    participantName={participant?.nombreCompleto || 'Candidato'}
                    onAnswerSelected={handleAnswerSelected}
                    onNext={handleNextQuestion}
                  />
                </motion.div>
              )}

              {step === 'RESULTS' && participant && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <ResultsCard
                    participant={participant}
                    correctCount={correctCount}
                    incorrectCount={incorrectCount}
                    totalQuestions={questions.length}
                    score={Math.round((correctCount / questions.length) * 100)}
                    timeElapsed={formatTime(secondsElapsed)}
                    answerDetails={answerDetails}
                    isSubmitting={isSubmitting}
                    submissionError={submissionError}
                    submissionSuccess={submissionSuccess}
                    onRetrySubmit={handleRetrySubmit}
                    onFinish={handleReset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Smartphone Status Footer Line */}
          <div className="py-3 px-6 text-center border-t border-slate-100 bg-slate-50 text-[9px] text-slate-400 shrink-0 select-none relative">
            <p>© 2026 Seguridad Vial S.A.S. • Conectado</p>
            {/* Phone Home Bar Accent */}
            <div className="w-24 h-1 bg-slate-300 rounded-full mx-auto mt-2 hidden sm:block"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
