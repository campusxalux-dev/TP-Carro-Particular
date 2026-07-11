/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  modulo: number; // 1, 2, 3, 4
  pregunta: string;
  opciones: string[];
  correcta: number; // Index 0-3
}

export interface Participant {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  nombreCompleto: string;
  edad: number | '';
  empresa: string;
  antiguedad: number | '';
  tipoLicencia: string;
}

export interface AnswerDetail {
  numero: number;
  pregunta: string;
  seleccionada: string;
  correctaTexto: string;
  esCorrecta: boolean;
}

export interface ExamResult {
  fecha: string;
  hora: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  nombreCompleto: string;
  edad: number;
  empresa: string;
  antiguedad: number;
  tipoLicencia: string;
  correctas: number;
  incorrectas: number;
  puntaje: number;
  resultado: 'Aprobado' | 'No aprobado';
  tiempoEmpleado: string;
  detalles: AnswerDetail[];
}
