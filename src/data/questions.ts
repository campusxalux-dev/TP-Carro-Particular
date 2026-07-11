/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types';

export const questionsPool: Question[] = [
  // --- MÓDULO 1: Normas de Tránsito y Aspectos Generales ---
  {
    id: 'm1_1',
    modulo: 1,
    pregunta: '¿Cuál es la velocidad máxima permitida en zonas residenciales y escolares?',
    opciones: [
      '30 km/h',
      '50 km/h',
      '60 km/h',
      '40 km/h'
    ],
    correcta: 0
  },
  {
    id: 'm1_2',
    modulo: 1,
    pregunta: '¿Qué significa la doble línea amarilla continua en el centro de la vía?',
    opciones: [
      'Permitido adelantar con precaución',
      'Prohibido adelantar en ambos sentidos',
      'Vía de un solo sentido de circulación',
      'Zona de estacionamiento autorizado'
    ],
    correcta: 1
  },
  {
    id: 'm1_3',
    modulo: 1,
    pregunta: 'Ante un semáforo en luz amarilla constante, ¿qué debe hacer un conductor?',
    opciones: [
      'Acelerar para cruzar la intersección rápidamente',
      'Pitar para advertir a los peatones',
      'Desacelerar y detenerse antes de la línea de pare si es seguro hacerlo',
      'Ignorarla y continuar al mismo ritmo'
    ],
    correcta: 2
  },
  {
    id: 'm1_4',
    modulo: 1,
    pregunta: '¿Cuál es el orden de prioridad de las señales de tránsito de mayor a menor jerarquía?',
    opciones: [
      'Semáforos, Señales horizontales, Agentes de tránsito, Señales verticales',
      'Agentes de tránsito, Señales temporales/de obra, Semáforos, Señales verticales y horizontales',
      'Señales verticales, Semáforos, Señales horizontales, Agentes de tránsito',
      'Todas las señales tienen exactamente la misma importancia'
    ],
    correcta: 1
  },
  {
    id: 'm1_5',
    modulo: 1,
    pregunta: '¿Con cuánta anticipación se debe indicar un giro utilizando las luces direccionales en zonas urbanas?',
    opciones: [
      'Mínimo 30 metros antes de realizar la maniobra',
      'Mínimo 5 metros antes de realizar la maniobra',
      'Justo en el momento de girar el volante',
      '10 metros antes de realizar la maniobra'
    ],
    correcta: 0
  },
  {
    id: 'm1_6',
    modulo: 1,
    pregunta: '¿Qué documentos obligatorios debe portar siempre un conductor al conducir un vehículo particular?',
    opciones: [
      'Únicamente el documento de identidad',
      'Cédula, Licencia de Conducción vigente, SOAT vigente y Licencia de Tránsito (Tarjeta de propiedad)',
      'Contrato de compraventa y Licencia de Conducción',
      'Certificado de gases y Seguro Todo Riesgo comercial'
    ],
    correcta: 1
  },
  {
    id: 'm1_7',
    modulo: 1,
    pregunta: '¿A qué distancia mínima se debe estacionar un vehículo de un hidrante o boca de incendios?',
    opciones: [
      '1 metro',
      '10 metros',
      '5 metros',
      '3 metros'
    ],
    correcta: 2
  },
  {
    id: 'm1_8',
    modulo: 1,
    pregunta: '¿Cuándo está permitido adelantar a otro vehículo por el costado derecho?',
    opciones: [
      'Cuando el vehículo que nos precede indica su intención de girar a la izquierda y hay espacio libre suficiente a la derecha',
      'En autopistas siempre que tengamos prisa',
      'Nunca, está absolutamente prohibido bajo cualquier circunstancia',
      'Cuando el carril derecho se encuentra libre y el izquierdo congestionado'
    ],
    correcta: 0
  },
  {
    id: 'm1_9',
    modulo: 1,
    pregunta: '¿Qué indica la señal de un agente de tránsito con los brazos extendidos lateralmente formando una cruz?',
    opciones: [
      'Que el tráfico puede avanzar libremente',
      'Que los vehículos deben disminuir la velocidad',
      'Alto total para los vehículos que se aproximan de frente o por detrás',
      'Que está permitido adelantar por los costados'
    ],
    correcta: 2
  },
  {
    id: 'm1_10',
    modulo: 1,
    pregunta: '¿Quién tiene la prioridad de paso en una rotonda o glorieta de doble carril?',
    opciones: [
      'El vehículo que ingresa a la rotonda desde la vía principal',
      'El vehículo de mayor tamaño',
      'El vehículo que ya se encuentra circulando dentro de la rotonda',
      'El vehículo que circula por el carril de la derecha exterior'
    ],
    correcta: 2
  },
  {
    id: 'm1_11',
    modulo: 1,
    pregunta: '¿Cuál es la sanción aplicable por conducir un vehículo bajo los efectos del alcohol en Grado 1 de alcoholemia por primera vez?',
    opciones: [
      'Amonestación verbal únicamente',
      'Multa económica ligera y retención de la licencia por 1 mes',
      'Suspensión de la licencia de conducción por 3 años, multa económica severa, inmovilización del vehículo y 30 horas de servicio comunitario',
      'Cancelación definitiva de la licencia de conducción'
    ],
    correcta: 2
  },
  {
    id: 'm1_12',
    modulo: 1,
    pregunta: '¿Cuál es el límite máximo de velocidad permitido en carreteras nacionales (vías rurales) para vehículos de servicio particular?',
    opciones: [
      '120 km/h',
      '90 km/h o lo que indique la señalización de la vía (máximo 120 km/h en dobles calzadas)',
      '60 km/h',
      '80 km/h constantes sin excepción'
    ],
    correcta: 1
  },
  {
    id: 'm1_13',
    modulo: 1,
    pregunta: '¿Qué distancia de seguridad se aconseja mantener con el vehículo precedente viajando a 80 km/h en asfalto seco?',
    opciones: [
      'Mínimo 10 metros',
      'Al menos 30 metros o aplicando la regla de seguridad de los 3 segundos de distancia temporal',
      'No hay una distancia reglamentaria, depende del criterio del conductor',
      'El largo equivalente a dos vehículos medianos'
    ],
    correcta: 1
  },
  {
    id: 'm1_14',
    modulo: 1,
    pregunta: '¿Cuándo se debe realizar la primera revisión tecnicomecánica para un vehículo particular nuevo?',
    opciones: [
      'Al cumplir los 6 años contados a partir de su fecha de matrícula',
      'Anualmente desde el primer año de matrícula',
      'Al cumplir los 2 años desde su matrícula',
      'A los 10 años o 100,000 kilómetros'
    ],
    correcta: 0
  },
  {
    id: 'm1_15',
    modulo: 1,
    pregunta: 'En una vía con pendiente descendente (bajada), ¿cómo debe estacionar su vehículo correctamente?',
    opciones: [
      'En neutro, con el freno de mano suelto',
      'En reversa, con el freno de mano activado y las ruedas delanteras orientadas hacia el andén o bordillo',
      'En primera marcha, apuntando las ruedas hacia el centro de la vía',
      'Apoyado únicamente sobre la transmisión en posición Park'
    ],
    correcta: 1
  },

  // --- MÓDULO 2: Señales de Tránsito y Elementos de la Vía ---
  {
    id: 'm2_1',
    modulo: 2,
    pregunta: '¿Qué forma geométrica y colores principales tienen las señales de tránsito preventivas?',
    opciones: [
      'Círculo con fondo blanco y borde rojo',
      'Rectángulo de color azul con letras blancas',
      'Rombo amarillo con borde y símbolos negros',
      'Octágono de color rojo brillante'
    ],
    correcta: 2
  },
  {
    id: 'm2_2',
    modulo: 2,
    pregunta: '¿De qué color son las señales informativas destinadas a indicar turismo y servicios recreativos?',
    opciones: [
      'Azules o cafés/marrones',
      'Verdes o amarillas',
      'Naranjas brillantes',
      'Rojas y blancas'
    ],
    correcta: 0
  },
  {
    id: 'm2_3',
    modulo: 2,
    pregunta: '¿Qué indica una señal de tránsito reglamentaria con fondo blanco, borde circular rojo y una barra transversal roja?',
    opciones: [
      'Una recomendación de velocidad',
      'Una prohibición o restricción absoluta',
      'Una advertencia sobre peligro en la vía',
      'Una indicación de sentido único'
    ],
    correcta: 1
  },
  {
    id: 'm2_4',
    modulo: 2,
    pregunta: '¿Qué comportamiento exige del conductor la señal reglamentaria de "CEDA EL PASO"?',
    opciones: [
      'Detenerse completamente siempre, haya o no vehículos en la otra vía',
      'Acelerar para incorporarse antes de que pasen otros vehículos',
      'Disminuir la velocidad y detenerse únicamente si circulan vehículos por la otra vía con prioridad',
      'Pitar fuertemente y continuar con precaución'
    ],
    correcta: 2
  },
  {
    id: 'm2_5',
    modulo: 2,
    pregunta: '¿Qué indican las líneas blancas intermitentes o discontinuas pintadas sobre la calzada?',
    opciones: [
      'Prohibición estricta de cambiar de carril',
      'Que el carril está reservado únicamente para transporte público',
      'Que se permite el cambio de carril para adelantar o girar con la debida precaución',
      'Límite de velocidad reducido'
    ],
    correcta: 2
  },
  {
    id: 'm2_6',
    modulo: 2,
    pregunta: '¿Qué significa la presencia de una línea de pare continua dibujada transversalmente en el asfalto?',
    opciones: [
      'Obligación de detener el vehículo completamente antes de la línea, cediendo el paso',
      'Disminuir la velocidad pero continuar sin parar si la vía está despejada',
      'Zona reservada exclusivamente para el cruce de peatones',
      'Límite de inicio de zona de adelantamiento'
    ],
    correcta: 0
  },
  {
    id: 'm2_7',
    modulo: 2,
    pregunta: '¿Qué nos indica una señal preventiva con el dibujo de un estrechamiento de la vía?',
    opciones: [
      'Que más adelante la vía se divide en dos calzadas independientes',
      'Que la vía en la que circula reduce su ancho de calzada más adelante',
      'Que hay presencia de obras y maquinaria en la vía',
      'Que termina la zona de doble calzada'
    ],
    correcta: 1
  },
  {
    id: 'm2_8',
    modulo: 2,
    pregunta: '¿Cuál es el significado de una señal reglamentaria con el número "60" dentro de un círculo con borde rojo?',
    opciones: [
      'Velocidad mínima obligatoria de 60 km/h',
      'Sugerencia de mantener una velocidad de 60 km/h',
      'Velocidad máxima permitida de 60 km/h en ese tramo de vía',
      'Límite de carga máxima de 60 toneladas por eje'
    ],
    correcta: 2
  },
  {
    id: 'm2_9',
    modulo: 2,
    pregunta: '¿Qué significan las líneas amarillas cruzadas en forma de cuadrícula dibujadas en una intersección?',
    opciones: [
      'Zona especial para parqueo rápido de vehículos de emergencia',
      'Prohibición de ingresar o detener el vehículo dentro del área si hay riesgo de bloquear el cruce',
      'Área de cruce exclusivo para bicicletas y peatones',
      'Paradero autorizado para transporte masivo'
    ],
    correcta: 1
  },
  {
    id: 'm2_10',
    modulo: 2,
    pregunta: '¿Qué advierte la señal preventiva que muestra una flecha curva pronunciada de casi 180 grados?',
    opciones: [
      'Proximidad de una curva peligrosa a la derecha o izquierda en el camino',
      'Retorno autorizado más adelante',
      'Una pendiente pronunciada',
      'Fusión de carriles laterales'
    ],
    correcta: 0
  },
  {
    id: 'm2_11',
    modulo: 2,
    pregunta: '¿De qué color son las señales de tránsito transitorias destinadas a advertir trabajos u obras en la vía?',
    opciones: [
      'Amarillo reflectivo',
      'Naranja con símbolos y letras negras',
      'Rojo con letras blancas',
      'Verde fosforescente'
    ],
    correcta: 1
  },
  {
    id: 'm2_12',
    modulo: 2,
    pregunta: '¿Qué indica la señal preventiva que muestra un peatón caminando con un bolso o maleta?',
    opciones: [
      'Presencia de vendedores ambulantes',
      'Proximidad de una zona escolar o paso frecuente de estudiantes',
      'Zona comercial de alta afluencia de transeúntes',
      'Parque recreacional de niños'
    ],
    correcta: 1
  },
  {
    id: 'm2_13',
    modulo: 2,
    pregunta: '¿Qué representan las tachas reflectivas (ojos de gato) de color rojo situadas en los bordes de la calzada?',
    opciones: [
      'Indican el centro de la vía bidireccional',
      'Límite exterior derecho o izquierdo del cual el vehículo no debe salirse',
      'Inicio de una zona de peaje cercano',
      'Advertencia de badén o reductor de velocidad'
    ],
    correcta: 1
  },
  {
    id: 'm2_14',
    modulo: 2,
    pregunta: '¿Cuál es la función de los paneles alineadores o delineadores verticales en una curva de carretera?',
    opciones: [
      'Servir de barrera física de contención en accidentes',
      'Guíar visualmente a los conductores sobre la dirección y radio de la curva, especialmente de noche',
      'Medir la velocidad de los vehículos circulantes',
      'Proporcionar iluminación artificial'
    ],
    correcta: 1
  },
  {
    id: 'm2_15',
    modulo: 2,
    pregunta: '¿Qué indica la señal reglamentaria circular con fondo blanco, borde rojo y una flecha negra girando hacia la izquierda con una línea roja transversal encima?',
    opciones: [
      'Permitido girar a la izquierda con precaución',
      'Prohibido girar a la izquierda en dicha intersección',
      'Desvío obligatorio hacia la derecha',
      'Sentido único de la vía hacia la izquierda'
    ],
    correcta: 1
  },

  // --- MÓDULO 3: Mecánica Básica y Seguridad Vial ---
  {
    id: 'm3_1',
    modulo: 3,
    pregunta: '¿Qué componente del vehículo se encarga de acoplar y desacoplar la fuerza del motor a la caja de cambios?',
    opciones: [
      'El carburador',
      'El embrague o cloche',
      'El alternador',
      'La dirección hidráulica'
    ],
    correcta: 1
  },
  {
    id: 'm3_2',
    modulo: 3,
    pregunta: '¿Cuál es la función principal del líquido de frenos en el sistema de frenado hidráulico?',
    opciones: [
      'Lubricar las pastillas y discos de freno',
      'Enfriar los tambores de las ruedas traseras',
      'Transmitir la presión del pedal de freno de manera uniforme hasta los pistones de las ruedas',
      'Evitar que se oxide el pedal de freno'
    ],
    correcta: 2
  },
  {
    id: 'm3_3',
    modulo: 3,
    pregunta: '¿Con qué frecuencia se debe verificar la presión de inflado de las llantas o neumáticos?',
    opciones: [
      'Únicamente cuando se pinchen o se vean desinfladas',
      'Cada año durante el mantenimiento general del carro',
      'Al menos una vez al mes, siempre verificándolo en frío para obtener una medida real',
      'Cada tres meses o antes de un viaje muy largo'
    ],
    correcta: 2
  },
  {
    id: 'm3_4',
    modulo: 3,
    pregunta: '¿Qué indica el testigo con forma de "alcatre de aceite" que se enciende en color rojo en el tablero del carro?',
    opciones: [
      'Que el nivel de combustible es muy bajo',
      'Baja presión o falta de aceite lubricante en el motor, requiere apagar el vehículo de inmediato',
      'Que es momento de cambiar las bujías del motor',
      'Que el motor ha alcanzado su temperatura ideal'
    ],
    correcta: 1
  },
  {
    id: 'm3_5',
    modulo: 3,
    pregunta: '¿Qué tipo de desgaste se genera en las llantas si se conducen constantemente con una presión menor a la recomendada?',
    opciones: [
      'Desgaste excesivo en el centro de la banda de rodadura',
      'Desgaste acelerado en ambos bordes exteriores (hombros) del neumático',
      'Desgaste desigual en forma de escamas diagonales',
      'Las llantas no sufren desgaste por presión baja, solo se calientan'
    ],
    correcta: 1
  },
  {
    id: 'm3_6',
    modulo: 3,
    pregunta: '¿Qué función cumple el sistema de frenos antibloqueo (ABS) en una frenada de emergencia?',
    opciones: [
      'Reducir la fuerza que el conductor debe aplicar sobre el pedal de freno',
      'Frenar el vehículo en la mitad de la distancia normal',
      'Evitar que las llantas se deslicen o bloqueen, permitiendo mantener el control de la dirección del vehículo',
      'Bloquear las llantas traseras para derrapar de manera controlada'
    ],
    correcta: 2
  },
  {
    id: 'm3_7',
    modulo: 3,
    pregunta: '¿Cuál es el propósito principal del labrado (canales y ranuras) en la banda de rodadura de los neumáticos?',
    opciones: [
      'Hacer que el neumático sea más silencioso al rodar',
      'Mejorar la estética visual de las ruedas del carro',
      'Evacuar el agua acumulada sobre el asfalto para prevenir el hidroplaneo (aquaplaning)',
      'Aumentar el peso de las llantas para mayor tracción'
    ],
    correcta: 2
  },
  {
    id: 'm3_8',
    modulo: 3,
    pregunta: '¿Qué dispositivo de seguridad pasiva reduce significativamente las lesiones cervicales por latigazo en un choque trasero?',
    opciones: [
      'El cinturón de seguridad de tres puntos',
      'El apoyacabezas del asiento ajustado correctamente a la altura de los ojos',
      'El airbag frontal del volante',
      'La columna de dirección colapsable'
    ],
    correcta: 1
  },
  {
    id: 'm3_9',
    modulo: 3,
    pregunta: '¿Cuál es la función principal de los amortiguadores en el sistema de suspensión de un automóvil?',
    opciones: [
      'Soportar el peso total de la carrocería del vehículo',
      'Controlar y disipar los rebotes de los resortes o muelles, manteniendo las llantas adheridas al pavimento',
      'Alinear las ruedas delanteras con el volante',
      'Suavizar la dureza de los neumáticos'
    ],
    correcta: 1
  },
  {
    id: 'm3_10',
    modulo: 3,
    pregunta: '¿Cuál es la profundidad mínima permitida por la normativa técnica para el labrado de los neumáticos de un carro?',
    opciones: [
      '0.5 milímetros',
      '1.6 milímetros',
      '3.0 milímetros',
      '1.0 milímetro'
    ],
    correcta: 1
  },
  {
    id: 'm3_11',
    modulo: 3,
    pregunta: '¿Qué componente del motor se encarga de recargar la batería de 12V mientras el automóvil está en marcha?',
    opciones: [
      'El motor de arranque',
      'El alternador',
      'La bobina de encendido',
      'El radiador'
    ],
    correcta: 1
  },
  {
    id: 'm3_12',
    modulo: 3,
    pregunta: '¿Qué falla mecánica suele indicar el humo azulado que sale constantemente por el tubo de escape de un vehículo a gasolina?',
    opciones: [
      'Que el sistema eléctrico está en cortocircuito',
      'Que se está quemando aceite del motor debido a desgaste en anillos o sellos de válvulas',
      'Presencia excesiva de agua en el sistema de combustible',
      'Que la mezcla de aire y combustible es demasiado rica en gasolina'
    ],
    correcta: 1
  },

  // --- MÓDULO 4: Primeros Auxilios y Comportamiento en Accidentes ---
  {
    id: 'm4_1',
    modulo: 4,
    pregunta: '¿Cuál es la sigla internacional "PAS" que rige el protocolo de acción ante un accidente de tránsito?',
    opciones: [
      'Presionar, Asegurar, Soportar',
      'Proteger la zona, Alertar a los servicios de emergencia, Socorrer a las víctimas',
      'Prevenir riesgos, Avisar a familiares, Sanar heridas',
      'Parar el motor, Auxiliar rápidamente, Salvar vidas'
    ],
    correcta: 1
  },
  {
    id: 'm4_2',
    modulo: 4,
    pregunta: 'Al llegar como primer respondiente a la escena de un accidente vial, lo primero que debe hacer es:',
    opciones: [
      'Sacar a los lesionados de los vehículos inmediatamente',
      'Evaluar el estado de conciencia de los heridos',
      'Asegurar y señalizar la zona del accidente para evitar nuevos choques o atropellos',
      'Tomar fotos y videos para compartirlos en redes de tránsito'
    ],
    correcta: 2
  },
  {
    id: 'm4_3',
    modulo: 4,
    pregunta: 'Si una persona lesionada tiene un objeto punzante incrustado en su cuerpo, ¿cómo debe actuar?',
    opciones: [
      'Retirar el objeto rápidamente para detener la infección',
      'No intentar extraerlo, inmovilizar el objeto y trasladar a la víctima de inmediato',
      'Girar el objeto para ver qué tan profundo está incrustado',
      'Aplicar alcohol directamente sobre el objeto incrustado'
    ],
    correcta: 1
  },
  {
    id: 'm4_4',
    modulo: 4,
    pregunta: '¿Cuál es la postura correcta (Posición Lateral de Seguridad - PLS) para colocar a un herido inconsciente que sí respira?',
    opciones: [
      'Boca abajo con los brazos estirados',
      'Sentado con la espalda erguida',
      'Boca arriba con las piernas elevadas',
      'De costado, de forma estable, para evitar el ahogamiento por vómito o lengua'
    ],
    correcta: 3
  },
  {
    id: 'm4_5',
    modulo: 4,
    pregunta: 'En caso de que una víctima presente quemaduras severas en la piel tras un accidente, ¿cuál es el primer auxilio indicado?',
    opciones: [
      'Aplicar aceites, cremas corporales o ungüentos caseros',
      'Irrigar la zona afectada con abundante agua limpia a temperatura ambiente por al menos 10-15 minutos',
      'Arrancar las prendas de ropa adheridas a la piel quemada',
      'Colocar hielo directo sobre la herida'
    ],
    correcta: 1
  },
  {
    id: 'm4_6',
    modulo: 4,
    pregunta: '¿Está permitido suministrar medicamentos o bebidas a un lesionado grave en el sitio del siniestro vial?',
    opciones: [
      'Sí, pastillas para aliviar el dolor si el paciente las pide',
      'Agua con azúcar para calmar los nervios',
      'No, bajo ninguna circunstancia se debe dar de beber, comer ni automedicar a un herido en la escena',
      'Solamente analgésicos suaves'
    ],
    correcta: 2
  },
  {
    id: 'm4_7',
    modulo: 4,
    pregunta: '¿Cuál es el método más rápido y eficaz para controlar una hemorragia externa grave en una extremidad?',
    opciones: [
      'Hacer un torniquete flojo con una cuerda',
      'Realizar presión directa sobre la herida sangrante utilizando una gasa estéril o un paño limpio',
      'Sumergir la extremidad herida en agua fría',
      'Aplicar café molido o tierra fina para coagular'
    ],
    correcta: 1
  },
  {
    id: 'm4_8',
    modulo: 4,
    pregunta: 'Si sospecha que un herido tiene una fractura o lesión en la columna vertebral, ¿cuál es la regla fundamental?',
    opciones: [
      'Hacer que se ponga de pie para descartar parálisis',
      'Mantener inmóvil el eje cabeza-cuello-tronco y no mover a la víctima excepto por riesgo inminente de explosión',
      'Doblar el cuello suavemente hacia los lados para verificar la movilidad',
      'Trasladarlo en el asiento trasero de cualquier automóvil convencional rápidamente'
    ],
    correcta: 1
  },
  {
    id: 'm4_9',
    modulo: 4,
    pregunta: '¿Qué número telefónico de emergencias se debe marcar preferiblemente en Colombia ante un accidente de tránsito grave?',
    opciones: [
      'El número de asistencia técnica del carro',
      'Línea única nacional de emergencias 123',
      'El número del seguro contractual',
      'La línea de atención comercial de la marca'
    ],
    correcta: 1
  },
  {
    id: 'm4_10',
    modulo: 4,
    pregunta: '¿Cuándo está indicado retirar el casco a un motociclista accidentado como medida de auxilio?',
    opciones: [
      'Inmediatamente para que respire aire fresco',
      'Solo si se queja de calor extremo en la cabeza',
      'Únicamente si la persona no respira y requiere maniobras de RCP urgente, realizado de forma coordinada por dos personas entrenadas',
      'Nunca, ni siquiera los paramédicos deben quitárselo'
    ],
    correcta: 2
  }
];

/**
 * Generates a randomized exam containing exactly 40 questions:
 * - 11 from Module 1
 * - 12 from Module 2
 * - 9 from Module 3
 * - 8 from Module 4
 * Total = 40 questions.
 * Order is randomized as well.
 */
export function generateRandomizedExam(): Question[] {
  const m1 = questionsPool.filter(q => q.modulo === 1);
  const m2 = questionsPool.filter(q => q.modulo === 2);
  const m3 = questionsPool.filter(q => q.modulo === 3);
  const m4 = questionsPool.filter(q => q.modulo === 4);

  // Helper to shuffle and select N elements
  const selectRandomN = (arr: Question[], n: number): Question[] => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };

  const selectedM1 = selectRandomN(m1, 11);
  const selectedM2 = selectRandomN(m2, 12);
  const selectedM3 = selectRandomN(m3, 9); // Total 9 from Modulo 3
  const selectedM4 = selectRandomN(m4, 8); // Total 8 from Modulo 4

  // Combine them and shuffle them completely so modules are intermixed
  const finalExam = [...selectedM1, ...selectedM2, ...selectedM3, ...selectedM4];
  return finalExam.sort(() => Math.random() - 0.5);
}
