import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearVisita } from '../data.js';
import { nuevaVisita } from '../models.js';
import { auth } from '../firebase.js';

export default function NewVisit() {
  const [edificacion, setEdificacion] = useState('');
  const [eventoReferencia, setEventoReferencia] = useState('');
  const navigate = useNavigate();

  async function crear(e) {
    e.preventDefault();
    if (!edificacion.trim()) return;
    const visita = nuevaVisita({
      edificacion,
      eventoReferencia,
      ingeniero: auth.currentUser?.email || 'Sin identificar'
    });
    // crearVisita funciona sin conexión: el id se genera localmente y
    // la visita aparece de inmediato en el Dashboard vía onSnapshot.
    const id = await crearVisita(visita);
    navigate(`/visitas/${id}`);
  }

  return (
    <main>
      <h2>Nueva visita</h2>
      <form onSubmit={crear} className="tarjeta">
        <div className="campo">
          <label>Edificación</label>
          <input value={edificacion} onChange={(e) => setEdificacion(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Evento de referencia (opcional)</label>
          <input
            value={eventoReferencia}
            onChange={(e) => setEventoReferencia(e.target.value)}
            placeholder="Ej. Sismo del 12 de agosto de 2026"
          />
        </div>
        <button className="primario" type="submit">
          Crear visita y empezar a registrar
        </button>
      </form>
    </main>
  );
}
