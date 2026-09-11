import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import OfflineBanner from './components/OfflineBanner.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewVisit from './pages/NewVisit.jsx';
import VisitDetail from './pages/VisitDetail.jsx';

export default function App() {
  const [usuario, setUsuario] = useState(undefined); // undefined = aún cargando

  useEffect(() => onAuthStateChanged(auth, setUsuario), []);

  if (usuario === undefined) return null; // evita parpadeo mientras Firebase resuelve la sesión

  return (
    <>
      <div className="topbar">
        <h1>Inspección Estructural</h1>
        {usuario && <span className="subtitulo">{usuario.email}</span>}
      </div>
      <OfflineBanner />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={usuario ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/visitas/nueva" element={usuario ? <NewVisit /> : <Navigate to="/login" />} />
        <Route
          path="/visitas/:visitaId"
          element={usuario ? <VisitDetail /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}
