import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase.js';

const visitasRef = collection(db, 'visitas');

// Crea una visita nueva y devuelve su id. Funciona offline: Firestore
// encola la escritura y la confirma cuando vuelve la conexión; mientras
// tanto el snapshot local ya refleja el dato como si estuviera guardado.
export async function crearVisita(visita) {
  const docRef = await addDoc(visitasRef, visita);
  return docRef.id;
}

export async function actualizarVisita(visitaId, cambios) {
  await updateDoc(doc(db, 'visitas', visitaId), cambios);
}

// Suscripción en tiempo real a la lista de visitas (incluye las que
// solo existen en caché local mientras no hay conexión).
export function suscribirVisitas(callback) {
  const q = query(visitasRef, orderBy('fecha', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const visitas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(visitas);
  });
}

export function suscribirVisita(visitaId, callback) {
  return onSnapshot(doc(db, 'visitas', visitaId), (snapshot) => {
    if (snapshot.exists()) callback({ id: snapshot.id, ...snapshot.data() });
  });
}

// Sube una foto al Storage de Firebase. Si no hay conexión, esta llamada
// fallará: la interfaz debe guardar la foto localmente (ver PhotoCapture)
// y reintentar el upload cuando detecte conexión.
export async function subirFoto(visitaId, hallazgoId, blob) {
  const nombre = `visitas/${visitaId}/${hallazgoId}/${Date.now()}.jpg`;
  const storageRef = ref(storage, nombre);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}
