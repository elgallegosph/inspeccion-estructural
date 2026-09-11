import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { suscribirVisitas } from '../data.js';

export default function Dashboard() {
  const [visitas, setVisitas] = useState([]);

  useEffect(() => {
    const cancelar = suscribirVisitas(setVisitas);
    return cancelar;
  }, []);

  return (
    <main>
      <Link to="/visitas/nueva">
        <button className="primario" style={{ marginBottom: 16 }}>
          + Nueva visita
        </button>
      </Link>

      <div className="lista-visitas">
        {visitas.length === 0 && <p>Todavía no hay visitas registradas.</p>}
        {visitas.map((v) => (
          <Link key={v.id} to={`/visitas/${v.id}`}>
            <div className="tarjeta">
              <span className={`etiqueta-estado ${v.estado}`}>{v.estado}</span>
              <h3 style={{ margin: '8px 0 4px' }}>{v.edificacion}</h3>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
                {new Date(v.fecha).toLocaleDateString('es-CO')} · {v.ingeniero}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
