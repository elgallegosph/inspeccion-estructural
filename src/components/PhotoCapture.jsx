import { useState } from 'react';
import { obtenerUbicacion } from '../utils/geolocation.js';

// Captura una foto (input con capture="environment" abre la cámara
// directamente en móviles), toma la ubicación en el momento, y guarda
// todo localmente en el objeto del hallazgo — el upload a Storage se
// hace aparte, cuando hay conexión (ver VisitDetail).
export default function PhotoCapture({ onCapturar }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarArchivo(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setCargando(true);
    setError('');
    try {
      const dataUrl = await archivoADataUrl(archivo);
      let ubicacion = {};
      try {
        ubicacion = await obtenerUbicacion();
      } catch {
        // La foto se guarda igual sin coordenadas si el GPS no responde.
      }
      onCapturar({
        blob: archivo,
        dataUrl,
        lat: ubicacion.lat,
        lng: ubicacion.lng,
        timestamp: new Date().toISOString(),
        pieDeFoto: ''
      });
    } catch {
      setError('No se pudo procesar la foto. Intenta de nuevo.');
    } finally {
      setCargando(false);
      e.target.value = '';
    }
  }

  return (
    <div className="campo">
      <label>Agregar foto</label>
      <input type="file" accept="image/*" capture="environment" onChange={manejarArchivo} />
      {cargando && <p style={{ fontSize: 13 }}>Ubicando y procesando foto…</p>}
      {error && <p style={{ fontSize: 13, color: 'var(--alerta)' }}>{error}</p>}
    </div>
  );
}

function archivoADataUrl(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onloadend = () => resolve(lector.result);
    lector.onerror = reject;
    lector.readAsDataURL(archivo);
  });
}
