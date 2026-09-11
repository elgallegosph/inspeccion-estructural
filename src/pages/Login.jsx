import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.js';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, correo, clave);
      navigate('/');
    } catch {
      setError('Correo o contraseña incorrectos.');
    }
  }

  return (
    <main>
      <h2>Iniciar sesión</h2>
      <form onSubmit={enviar} className="tarjeta">
        <div className="campo">
          <label>Correo</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="campo">
          <label>Contraseña</label>
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'var(--alerta)', fontSize: 13 }}>{error}</p>}
        <button className="primario" type="submit">
          Entrar
        </button>
      </form>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Las cuentas de los ingenieros se crean desde la consola de Firebase Authentication.
      </p>
    </main>
  );
}
