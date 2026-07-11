# 🚗 Evaluación Teórica para Conductores Particular

Aplicación web responsive moderna, diseñada con enfoque **Mobile-First** (con apariencia de app nativa móvil), ideal para realizar exámenes teóricos profesionales para conductores particulares.

Esta aplicación selecciona dinámicamente **40 preguntas aleatorias** distribuidas reglamentariamente entre 4 módulos especializados y sincroniza de forma inmediata y segura cada resultado con una hoja de cálculo de **Google Sheets** utilizando **Google Apps Script** como API intermediaria para proteger credenciales en el cliente.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion (animaciones elegantes).
- **Backend/API:** Node.js, Express, `tsx`, `esbuild` (empaquetado listo para producción).
- **Base de Datos/Persistencia:** Google Sheets (con Google Apps Script como API de proxy segura).
- **Despliegue:** Preparado para Vercel o Cloud Run.

---

## 📊 Distribución Modular del Examen (40 Preguntas)

Cada evaluación es única y selecciona aleatoriamente preguntas sin repeticiones en las siguientes proporciones:
- **Módulo 1 (11 preguntas):** Normas de Tránsito y Aspectos Generales.
- **Módulo 2 (12 preguntas):** Señales de Tránsito y Elementos de la Vía.
- **Módulo 3 (9 preguntas):** Mecánica Básica y Seguridad Vial.
- **Módulo 4 (8 preguntas):** Primeros Auxilios y Comportamiento en Accidentes.

---

## 📝 Configuración de Google Sheets y Google Apps Script

Siga estos pasos para conectar su hoja de cálculo como base de datos segura de resultados:

### Paso 1: Crear la Hoja de Cálculo (Google Sheets)
1. Cree una hoja de cálculo en blanco en su Google Drive.
2. Defina las siguientes columnas en la primera fila (Fila 1) para los encabezados:
   - `A1`: Fecha
   - `B1`: Hora
   - `C1`: Tipo de Identificación
   - `D1`: Número de Identificación
   - `E1`: Nombre Completo
   - `F1`: Edad
   - `G1`: Empresa
   - `H1`: Antigüedad (Años)
   - `I1`: Tipo de Licencia
   - `J1`: Respuestas Correctas
   - `K1`: Respuestas Incorrectas
   - `L1`: Puntaje (sobre 100)
   - `M1`: Resultado (Aprobado / No aprobado)
   - `N1`: Tiempo Empleado
   - `O1`: Detalles de Preguntas (JSON completo)

### Paso 2: Crear el Google Apps Script
1. Dentro de su hoja de cálculo, vaya al menú superior y seleccione **Extensiones > Apps Script**.
2. Borre cualquier código existente e introduzca el siguiente script de Google Apps Script:

```javascript
/**
 * Google Apps Script Web App para Registro de Evaluaciones Teóricas
 */

function doPost(e) {
  try {
    // Parsear payload recibido
    var data = JSON.parse(e.postData.contents);
    
    // Obtener la hoja activa de la planilla vinculada
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Preparar el arreglo de detalles de respuestas como texto plano
    var detallesTexto = "";
    if (data.detalles && data.detalles.length > 0) {
      detallesTexto = data.detalles.map(function(item) {
        return "P." + item.numero + " (" + (item.esCorrecta ? "Correcta" : "Incorrecta") + "): " + 
               "Se eligió '" + item.seleccionada + "'. " + 
               (!item.esCorrecta ? "La correcta era '" + item.correctaTexto + "'." : "");
      }).join("\n\n");
    }

    // Añadir una nueva fila con los datos
    sheet.appendRow([
      data.fecha,
      data.hora,
      data.tipoIdentificacion,
      data.numeroIdentificacion,
      data.nombreCompleto,
      data.edad,
      data.empresa,
      data.antiguedad,
      data.tipoLicencia,
      data.correctas,
      data.incorrectas,
      data.puntaje,
      data.resultado,
      data.tiempoEmpleado,
      detallesTexto
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "success": true, "message": "Resultado registrado correctamente." }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "success": false, "error": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON)
                         .setHeader("Access-Control-Allow-Origin", "*");
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ "success": true, "message": "Servicio de Evaluación Vial activo." }))
                       .setMimeType(ContentService.MimeType.JSON)
                       .setHeader("Access-Control-Allow-Origin", "*");
}
```

### Paso 3: Desplegar la Web App de Apps Script
1. En la parte superior derecha de Apps Script, haga clic en **Implementar > Nueva implementación**.
2. Seleccione el tipo de implementación haciendo clic en el ícono de engranaje ⚙️ y elija **Aplicación web**.
3. Configure los siguientes parámetros:
   - **Descripción:** API de Registro de Exámenes
   - **Ejecutar como:** Yo (su correo de Google)
   - **Quién tiene acceso:** Cualquier persona (Esto es obligatorio para permitir peticiones POST externas sin OAuth del usuario final).
4. Haga clic en **Implementar**.
5. Copie la **URL de la aplicación web** generada (ejemplo: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 🚀 Instrucciones para Despliegue en Vercel

### Paso 1: Configurar Variables de Entorno
En su panel de configuración del proyecto en Vercel (o en su archivo `.env` local), defina la siguiente variable con el valor obtenido en el Paso 3 anterior:

```env
GOOGLE_APPS_SCRIPT_URL="SU_URL_DE_APPS_SCRIPT_AQUÍ"
```

### Paso 2: Desplegar en Vercel
Vercel reconoce automáticamente las configuraciones de proyectos Vite/React. 
Debido a que este proyecto cuenta con un servidor Express seguro para proxies de API:
1. Asegúrese de configurar el comando de construcción en Vercel como:
   `npm run build`
2. El comando de ejecución o inicio es:
   `npm run start`

---

## 🔒 Seguridad y Control de Duplicaciones

- **Transformación de datos obligatoria:** Las entradas de `Nombre completo` y `Empresa` se convierten automáticamente a **LETRAS MAYÚSCULAS** a nivel de UI y se sanitizan al enviar.
- **Bloqueo de reenvíos duplicados:** El botón de envío y los disparadores automáticos en la pantalla de resultados quedan inactivos una vez procesados exitosamente, evitando envíos múltiples accidentales.
- **Aislamiento de credenciales:** La URL del webhook de Google Apps Script se maneja exclusivamente del lado del servidor (Express `/api/results`), protegiendo tus endpoints privados de la inspección del navegador de los participantes.
