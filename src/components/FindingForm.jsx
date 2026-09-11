import { useState } from 'react';
import { CLASIFICACIONES, PRIORIDADES, nuevoHallazgo } from '../models.js';
import PhotoCapture from './PhotoCapture.jsx';

export default function FindingForm({ onAgregar }) {
  const [hallazgo, setHallazgo] = useState(nuevoHallazgo({}));

  function actualizar(campo, valor) {
    setHallazgo((h) => ({ ...h, [campo]: valor }));
  }

  function actualizarHipotesis(campo, valor) {
    setHallazgo((h) => ({ ...h, hipotesis: { ...h.hipotesis, [campo]: valor } }));
  }

  function agregarFoto(foto) {
    setHallazgo((h) => ({ ...h, fotos: [...h.fotos, foto] }));
  }

  function guardar() {
    if (!hallazgo.ubicacion.trim()) return;
    onAgregar(hallazgo);
    setHallazgo(nuevoHallazgo({}));
  }

  return (
    <div className="tarjeta">
      <div className="campo">
        <label>Ubicación del hallazgo</label>
        <input
          value={hallazgo.ubicacion}
          onChange={(e) => actualizar('ubicacion', e.target.value)}
          placeholder="Ej. Muro perimetral, fachada norte"
        />
      </div>

      <div className="campo">
        <label>Código (opcional)</label>
        <input
          value={hallazgo.codigo}
          onChange={(e) => actualizar('codigo', e.target.value)}
          placeholder="Ej. CAB-03"
        />
      </div>

      <div className="campo">
        <label>Descripción</label>
        <textarea
          value={hallazgo.descripcion}
          onChange={(e) => actualizar('descripcion', e.target.value)}
        />
      </div>

      <div className="fila">
        <div className="campo">
          <label>Clasificación</label>
          <select
            value={hallazgo.clasificacion}
            onChange={(e) => actualizar('clasificacion', e.target.value)}
          >
            {CLASIFICACIONES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label>Prioridad</label>
          <select value={hallazgo.prioridad} onChange={(e) => actualizar('prioridad', e.target.value)}>
            {PRIORIDADES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="campo">
        <label>Condición predisponente</label>
        <input
          value={hallazgo.hipotesis.condicionPredisponente}
          onChange={(e) => actualizarHipotesis('condicionPredisponente', e.target.value)}
        />
      </div>
      <div className="campo">
        <label>Detonante</label>
        <input
          value={hallazgo.hipotesis.detonante}
          onChange={(e) => actualizarHipotesis('detonante', e.target.value)}
        />
      </div>
      <div className="campo">
        <label>Secuencia</label>
        <input
          value={hallazgo.hipotesis.secuencia}
          onChange={(e) => actualizarHipotesis('secuencia', e.target.value)}
        />
      </div>

      <PhotoCapture onCapturar={agregarFoto} />
      {hallazgo.fotos.map((f, i) => (
        <img key={i} src={f.dataUrl} className="foto-miniatura" alt="Foto del hallazgo" />
      ))}

      <button type="button" className="secundario" onClick={guardar} style={{ marginTop: 10 }}>
        Agregar hallazgo
      </button>
    </div>
  );
}
