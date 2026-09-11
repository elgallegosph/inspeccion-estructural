import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { suscribirVisita, actualizarVisita, subirFoto } from '../data.js';
import StructureForm from '../components/StructureForm.jsx';
import FindingForm from '../components/FindingForm.jsx';
import { generarInformePDF } from '../utils/pdfGenerator.js';

export default function VisitDetail() {
  const { visitaId } = useParams();
  const [visita, setVisita] = useState(null);
  const [estructuraActiva, setEstructuraActiva] = useState(null);
  const [generando, setGenerando] = useState(false);

  useEffect(() => {
    return suscribirVisita(visitaId, setVisita);
  }, [visitaId]);

  if (!visita) return <main>Cargando…</main>;

  async function agregarEstructura(estructura) {
    const estructuras = [...visita.estructuras, estructura];
    await actualizarVisita(visitaId, { estructuras });
  }

  async function agregarHallazgo(estructuraId, hallazgo) {
    const estructuras = visita.estructuras.map((e) =>
      e.id === estructuraId ? { ...e, hallazgos: [...e.hallazgos, hallazgo] } : e
    );
    await actualizarVisita(visitaId, { estructuras });
  }

  // Sube a Storage todas las fotos que todavía solo existen como blob
  // local (se capturaron sin conexión). Si sigue sin haber señal, el PDF
  // se genera igual usando el dataUrl que ya está guardado localmente.
  async function sincronizarFotosPendientes() {
    const estructuras = await Promise.all(
      visita.estructuras.map(async (estructura) => {
        const hallazgos = await Promise.all(
          estructura.hallazgos.map(async (hallazgo) => {
            const fotos = await Promise.all(
              hallazgo.fotos.map(async (foto) => {
                if (foto.url) return foto;
                try {
                  const url = await subirFoto(visitaId, hallazgo.id, foto.blob);
                  const { blob, ...resto } = foto;
                  return { ...resto, url };
                } catch {
                  return foto; // sigue sin subir, se queda con dataUrl local
                }
              })
            );
            return { ...hallazgo, fotos };
          })
        );
        return { ...estructura, hallazgos };
      })
    );
    await actualizarVisita(visitaId, { estructuras });
    return estructuras;
  }

  async function cerrarYGenerarPDF() {
    setGenerando(true);
    try {
      const estructuras = await sincronizarFotosPendientes();
      const doc = await generarInformePDF({ ...visita, estructuras });
      doc.save(`informe-${visita.edificacion}-${visita.fecha.slice(0, 10)}.pdf`);
      await actualizarVisita(visitaId, { estado: 'cerrada' });
    } finally {
      setGenerando(false);
    }
  }

  return (
    <main>
      <h2>{visita.edificacion}</h2>
      <p style={{ marginTop: -8, opacity: 0.75, fontSize: 13 }}>
        {new Date(visita.fecha).toLocaleDateString('es-CO')} · {visita.ingeniero}
      </p>

      {visita.estructuras.map((estructura) => (
        <div key={estructura.id} className="tarjeta">
          <h3 style={{ marginTop: 0 }}>{estructura.nombre}</h3>
          <p style={{ fontSize: 13, opacity: 0.75 }}>
            {estructura.sistemaConstructivo} · {estructura.estadoOperacion}
          </p>

          {estructura.hallazgos.map((h) => (
            <div key={h.id} className="hallazgo-bloque">
              <strong>{h.codigo ? `${h.codigo} — ` : ''}{h.ubicacion}</strong>
              <p style={{ fontSize: 13 }}>{h.descripcion}</p>
              <p style={{ fontSize: 12, opacity: 0.75 }}>
                {h.clasificacion} · {h.prioridad}
              </p>
            </div>
          ))}

          {estructuraActiva === estructura.id ? (
            <FindingForm onAgregar={(h) => agregarHallazgo(estructura.id, h)} />
          ) : (
            <button
              type="button"
              className="secundario"
              onClick={() => setEstructuraActiva(estructura.id)}
            >
              + Agregar hallazgo
            </button>
          )}
        </div>
      ))}

      <StructureForm onAgregar={agregarEstructura} />

      {visita.estado === 'abierta' && (
        <button className="primario" onClick={cerrarYGenerarPDF} disabled={generando}>
          {generando ? 'Generando informe…' : 'Cerrar visita y descargar PDF'}
        </button>
      )}
    </main>
  );
}
