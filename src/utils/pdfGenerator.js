import { jsPDF } from 'jspdf';

const MARGEN = 15;
const ANCHO_UTIL = 210 - MARGEN * 2; // A4 en mm

function agregarEncabezado(doc, texto) {
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(texto, MARGEN, doc.lastY);
  doc.lastY += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
}

function saltoDePaginaSiNecesario(doc, alturaNecesaria) {
  const alturaPagina = doc.internal.pageSize.getHeight();
  if (doc.lastY + alturaNecesaria > alturaPagina - MARGEN) {
    doc.addPage();
    doc.lastY = MARGEN;
  }
}

function agregarParrafo(doc, texto) {
  const lineas = doc.splitTextToSize(texto || '—', ANCHO_UTIL);
  saltoDePaginaSiNecesario(doc, lineas.length * 5 + 4);
  doc.text(lineas, MARGEN, doc.lastY);
  doc.lastY += lineas.length * 5 + 3;
}

// visita: documento completo tal como se guarda en Firestore
// (ver models.js). Las fotos deben venir con `url` ya resuelta
// (getDownloadURL) y opcionalmente `dataUrl` en base64 si quieres
// incrustarlas directamente sin volver a pedirlas por red.
export async function generarInformePDF(visita) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.lastY = MARGEN;

  // Portada
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Informe de Inspección Estructural', MARGEN, 40);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(visita.edificacion || '', MARGEN, 50);
  doc.setFontSize(10);
  doc.text(`Fecha de visita: ${new Date(visita.fecha).toLocaleDateString('es-CO')}`, MARGEN, 58);
  if (visita.eventoReferencia) {
    doc.text(`Evento de referencia: ${visita.eventoReferencia}`, MARGEN, 64);
  }
  doc.text(`Profesional responsable: ${visita.ingeniero || ''}`, MARGEN, 70);

  doc.addPage();
  doc.lastY = MARGEN;

  for (const estructura of visita.estructuras || []) {
    agregarEncabezado(doc, estructura.nombre);
    agregarParrafo(
      doc,
      `Sistema constructivo: ${estructura.sistemaConstructivo || '—'}    ·    Estado: ${estructura.estadoOperacion}`
    );

    for (const hallazgo of estructura.hallazgos || []) {
      saltoDePaginaSiNecesario(doc, 20);
      doc.setFont('helvetica', 'bold');
      doc.text(
        `${hallazgo.codigo ? hallazgo.codigo + ' — ' : ''}${hallazgo.ubicacion || 'Hallazgo'}`,
        MARGEN,
        doc.lastY
      );
      doc.lastY += 5;
      doc.setFont('helvetica', 'normal');

      agregarParrafo(doc, hallazgo.descripcion);
      agregarParrafo(
        doc,
        `Clasificación: ${hallazgo.clasificacion}    ·    Prioridad: ${hallazgo.prioridad}`
      );

      const hip = hallazgo.hipotesis || {};
      if (hip.condicionPredisponente || hip.detonante || hip.secuencia) {
        agregarParrafo(
          doc,
          `Hipótesis — condición predisponente: ${hip.condicionPredisponente || '—'}. ` +
            `Detonante: ${hip.detonante || '—'}. Secuencia: ${hip.secuencia || '—'}.`
        );
      }

      for (const foto of hallazgo.fotos || []) {
        saltoDePaginaSiNecesario(doc, 65);
        try {
          const imgData = foto.dataUrl || (await urlAImagenBase64(foto.url));
          doc.addImage(imgData, 'JPEG', MARGEN, doc.lastY, 80, 55);
        } catch {
          // Si la imagen no se puede incrustar (p.ej. sin conexión y sin
          // dataUrl local), se deja el pie de foto igual y se continúa.
        }
        doc.setFontSize(8);
        const pie = [
          foto.pieDeFoto,
          foto.lat ? `Lat ${foto.lat.toFixed(5)}, Lng ${foto.lng.toFixed(5)}` : null
        ]
          .filter(Boolean)
          .join(' · ');
        doc.text(pie || '', MARGEN, doc.lastY + 58);
        doc.setFontSize(10);
        doc.lastY += 65;
      }

      doc.lastY += 3;
    }
  }

  return doc;
}

async function urlAImagenBase64(url) {
  const respuesta = await fetch(url);
  const blob = await respuesta.blob();
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onloadend = () => resolve(lector.result);
    lector.onerror = reject;
    lector.readAsDataURL(blob);
  });
}
