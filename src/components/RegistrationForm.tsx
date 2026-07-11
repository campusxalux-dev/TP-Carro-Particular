/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Participant } from '../types';
import { User, CreditCard, Shield, Briefcase, Calendar, Award } from 'lucide-react';

interface RegistrationFormProps {
  onStartExam: (participant: Participant) => void;
}

export default function RegistrationForm({ onStartExam }: RegistrationFormProps) {
  const [formData, setFormData] = useState<Participant>({
    tipoIdentificacion: 'Cédula de ciudadanía',
    numeroIdentificacion: '',
    nombreCompleto: '',
    edad: '',
    empresa: '',
    antiguedad: '',
    tipoLicencia: 'B1',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Convert name and company to uppercase immediately
    if (name === 'nombreCompleto' || name === 'empresa') {
      processedValue = value.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'edad' || name === 'antiguedad' 
        ? (value === '' ? '' : Number(value))
        : processedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre completo es obligatorio';
    } else if (formData.nombreCompleto.trim().length < 4) {
      newErrors.nombreCompleto = 'El nombre debe tener al menos 4 caracteres';
    }

    if (!formData.numeroIdentificacion.trim()) {
      newErrors.numeroIdentificacion = 'El número de identificación es obligatorio';
    }

    if (formData.edad === '' || formData.edad < 16 || formData.edad > 100) {
      newErrors.edad = 'Debe ingresar una edad válida (entre 16 y 100 años)';
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = 'El nombre de la empresa es obligatorio';
    }

    if (formData.antiguedad === '' || formData.antiguedad < 0 || formData.antiguedad > 60) {
      newErrors.antiguedad = 'Ingrese una antigüedad válida (0 a 60 años)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Create a clean participant object
      onStartExam({
        ...formData,
        nombreCompleto: formData.nombreCompleto.trim(),
        empresa: formData.empresa.trim(),
      });
    }
  };

  const isFormComplete =
    formData.nombreCompleto.trim().length >= 4 &&
    formData.numeroIdentificacion.trim() !== '' &&
    formData.edad !== '' &&
    formData.empresa.trim() !== '' &&
    formData.antiguedad !== '';

  return (
    <form onSubmit={handleSubmit} id="registration-form" className="space-y-4 pt-1">
      {/* Tipo de Identificación */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 select-none">
          <CreditCard size={12} className="text-blue-600" />
          Tipo de Identificación
        </label>
        <select
          id="tipoIdentificacion"
          name="tipoIdentificacion"
          value={formData.tipoIdentificacion}
          onChange={handleInputChange}
          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all cursor-pointer"
        >
          <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
          <option value="Cédula de extranjería">Cédula de extranjería</option>
          <option value="Pasaporte">Pasaporte</option>
          <option value="Permiso Especial">Permiso Especial</option>
        </select>
      </div>

      {/* Número de Identificación */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 select-none">
          <Shield size={12} className="text-blue-600" />
          Número de Identificación
        </label>
        <input
          id="numeroIdentificacion"
          type="text"
          name="numeroIdentificacion"
          value={formData.numeroIdentificacion}
          onChange={handleInputChange}
          placeholder="Escriba el número de documento"
          className={`w-full h-11 px-3 bg-white border ${
            errors.numeroIdentificacion ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50'
          } rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all`}
        />
        {errors.numeroIdentificacion && (
          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.numeroIdentificacion}</p>
        )}
      </div>

      {/* Nombre Completo */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 select-none">
          <User size={12} className="text-blue-600" />
          Nombre Completo
        </label>
        <input
          id="nombreCompleto"
          type="text"
          name="nombreCompleto"
          value={formData.nombreCompleto}
          onChange={handleInputChange}
          placeholder="NOMBRES Y APELLIDOS COMPLETOS"
          className={`w-full h-11 px-3 bg-white border ${
            errors.nombreCompleto ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50'
          } rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all tracking-wide`}
        />
        {errors.nombreCompleto && (
          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.nombreCompleto}</p>
        )}
      </div>

      {/* Edad y Antigüedad (Two column layout) */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 select-none">
            <Calendar size={12} className="text-blue-600" />
            Edad
          </label>
          <input
            id="edad"
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleInputChange}
            placeholder="Años"
            min="16"
            max="100"
            className={`w-full h-11 px-3 bg-white border ${
              errors.edad ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50'
            } rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all`}
          />
          {errors.edad && (
            <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.edad}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 select-none">
            <Calendar size={12} className="text-blue-600" />
            Antigüedad (Años)
          </label>
          <input
            id="antiguedad"
            type="number"
            name="antiguedad"
            value={formData.antiguedad}
            onChange={handleInputChange}
            placeholder="En la empresa"
            min="0"
            max="60"
            className={`w-full h-11 px-3 bg-white border ${
              errors.antiguedad ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50'
            } rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all`}
          />
          {errors.antiguedad && (
            <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.antiguedad}</p>
          )}
        </div>
      </div>

      {/* Empresa */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 select-none">
          <Briefcase size={12} className="text-blue-600" />
          Empresa donde labora
        </label>
        <input
          id="empresa"
          type="text"
          name="empresa"
          value={formData.empresa}
          onChange={handleInputChange}
          placeholder="EMPRESA S.A.S."
          className={`w-full h-11 px-3 bg-white border ${
            errors.empresa ? 'border-red-400 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50'
          } rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all`}
        />
        {errors.empresa && (
          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.empresa}</p>
        )}
      </div>

      {/* Tipo de Licencia */}
      <div>
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1 select-none">
          <Award size={12} className="text-blue-600" />
          Categoría de Licencia
        </label>
        <select
          id="tipoLicencia"
          name="tipoLicencia"
          value={formData.tipoLicencia}
          onChange={handleInputChange}
          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 transition-all cursor-pointer"
        >
          <option value="A1">Categoría A1 (Motos &lt; 125 c.c.)</option>
          <option value="A2">Categoría A2 (Motos &gt; 125 c.c.)</option>
          <option value="B1">Categoría B1 (Autos particulares)</option>
          <option value="B2">Categoría B2 (Camiones/Buses part.)</option>
          <option value="B3">Categoría B3 (Articulados particulares)</option>
          <option value="C1">Categoría C1 (Autos servicio público)</option>
          <option value="C2">Categoría C2 (Camiones/Buses público)</option>
          <option value="C3">Categoría C3 (Articulados público)</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          id="btn-iniciar-examen"
          type="submit"
          disabled={!isFormComplete}
          className={`w-full py-3.5 text-xs font-bold rounded-xl text-white shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all uppercase tracking-wider ${
            isFormComplete
              ? 'bg-blue-700 hover:bg-blue-800 cursor-pointer shadow-blue-700/10'
              : 'bg-slate-300 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Iniciar Evaluación</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
