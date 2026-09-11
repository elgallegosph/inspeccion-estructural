import { useState } from 'react';
import { ESTADOS_OPERACION, nuevaEstructura } from '../models.js';

export default function StructureForm({ onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [sistemaConstructivo, setSistemaConstructivo] = useState('');
  const [estadoOperacion, setEstadoOperacion] = useState(ESTADOS_OPERACION[0]);

  function guardar() {
    if (!nombre.trim()) return;
    onAgregar(nuevaEstructura({ nombre, sistemaConstructivo, estadoOperacion }));
    setNombre('');
    setSistemaConstructivo('');
    setEstadoOperacion(ESTADOS_OPERACION[0]);
  }

  return (
    <div className="tarjeta">
      <div className="campo">
        <label>Nombre de la estructura</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Edificación principal, Kiosco 2"
        />
      </div>
      <div className="campo">
        <label>Sistema constructivo</label>
        <input
          value={sistemaConstructivo}
          onChange={(e) => setSistemaConstructivo(e.target.value)}
          placeholder="Ej. Pórticos en concreto, mampostería confinada"
        />
      </div>
      <div className="campo">
        <label>Estado de operación</label>
        <select value={estadoOperacion} onChange={(e) => setEstadoOperacion(e.target.value)}>
          {ESTADOS_OPERACION.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>
      <button type="button" className="secundario" onClick={guardar}>
        Agregar estructura
      </button>
    </div>
  );
}
