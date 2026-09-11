// Modelo de datos genérico: sirve para cualquier tipo de edificación,
// no solo para el hospital que usamos como referencia inicial.

// Opciones cerradas — ajústalas a tu criterio, son la base de los
// "select" que verá el ingeniero en el formulario.
export const CLASIFICACIONES = [
  'Sin afectación',
  'Indeterminado',
  'Posiblemente asociado al evento',
  'No asociado al evento'
];

export const PRIORIDADES = ['Inmediata', 'Seguimiento', 'Sin urgencia'];

export const ESTADOS_OPERACION = ['En operación', 'Operación restringida', 'Fuera de servicio'];

// Estructura vacía de una Visita. Una visita agrupa una o más
// Estructuras, y cada Estructura agrupa uno o más Hallazgos.
export function nuevaVisita({ edificacion, eventoReferencia, ingeniero }) {
  return {
    edificacion,
    eventoReferencia: eventoReferencia || '',
    ingeniero,
    fecha: new Date().toISOString(),
    estado: 'abierta', // 'abierta' | 'cerrada' (cerrada = ya se generó el PDF)
    estructuras: []
  };
}

export function nuevaEstructura({ nombre, sistemaConstructivo, estadoOperacion }) {
  return {
    id: crypto.randomUUID(),
    nombre,
    sistemaConstructivo: sistemaConstructivo || '',
    estadoOperacion: estadoOperacion || ESTADOS_OPERACION[0],
    hallazgos: []
  };
}

export function nuevoHallazgo({ codigo, ubicacion, descripcion, clasificacion, prioridad }) {
  return {
    id: crypto.randomUUID(),
    codigo: codigo || '', // opcional: el ingeniero puede seguir usando sus propios códigos (KIO-01, etc.) si quiere
    ubicacion: ubicacion || '',
    descripcion: descripcion || '',
    clasificacion: clasificacion || CLASIFICACIONES[1],
    prioridad: prioridad || PRIORIDADES[1],
    hipotesis: {
      condicionPredisponente: '',
      detonante: '',
      secuencia: ''
    },
    fotos: [] // cada foto: { url, lat, lng, timestamp, pieDeFoto }
  };
}
