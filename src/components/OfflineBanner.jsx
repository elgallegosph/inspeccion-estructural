import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [enLinea, setEnLinea] = useState(navigator.onLine);

  useEffect(() => {
    const marcarEnLinea = () => setEnLinea(true);
    const marcarSinConexion = () => setEnLinea(false);
    window.addEventListener('online', marcarEnLinea);
    window.addEventListener('offline', marcarSinConexion);
    return () => {
      window.removeEventListener('online', marcarEnLinea);
      window.removeEventListener('offline', marcarSinConexion);
    };
  }, []);

  if (enLinea) return null;

  return (
    <div className="aviso-offline">
      Sin conexión — los cambios se guardan en este dispositivo y se sincronizan
      automáticamente al recuperar señal.
    </div>
  );
}
