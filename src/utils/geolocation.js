// Envuelve la Geolocation API del navegador en una promesa. Funciona
// sin internet (usa GPS/red del dispositivo, no un servidor).
export function obtenerUbicacion() {
  return new Promise((resolve, reject) => {
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
      { enableHighAccuracy: true, timeout: 15000 }
    );
  });
}
