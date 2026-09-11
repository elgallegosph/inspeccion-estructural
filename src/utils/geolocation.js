// Envuelve la Geolocation API del navegador en una promesa. Funciona
// sin internet (usa GPS/red del dispositivo, no un servidor).
//
// Además del timeout que le pasamos a getCurrentPosition, agregamos un
// timeout propio con Promise.race: en algunos sistemas (sobre todo
// Windows con el servicio de ubicación del SO apagado) el navegador
// nunca llama ni al callback de éxito ni al de error, ignorando su
// propio timeout, y la promesa se queda colgada para siempre. Este
// límite garantiza que la función SIEMPRE resuelva o rechace.
export function obtenerUbicacion() {
  const conTimeoutPropio = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Tiempo de espera agotado buscando ubicación.')), 8000);
  });

  const consultaGPS = new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Este dispositivo no soporta geolocalización.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          precision: pos.coords.accuracy
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 7000 }
    );
  });

  return Promise.race([consultaGPS, conTimeoutPropio]);
}
