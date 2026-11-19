import { HttpErrorResponse } from '@angular/common/http';

export function mensajeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el back esté encendido.';
    }
    const body = err.error;
    if (body && typeof body === 'object') {
      if (typeof body.mensaje === 'string') return body.mensaje;
      const mensajes = Object.values(body).filter((v) => typeof v === 'string');
      if (mensajes.length) return mensajes.join(' · ');
    }
    if (err.status === 403) return 'No tienes permisos para realizar esta acción.';
    if (err.status === 401) return 'Sesión no válida. Inicia sesión nuevamente.';
  }
  return 'Ocurrió un error inesperado.';
}