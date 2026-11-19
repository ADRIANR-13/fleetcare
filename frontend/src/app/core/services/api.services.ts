import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../config';
import {
  CostoPorVehiculo,
  Dashboard,
  Falla,
  FallaRequest,
  FallasPorVehiculo,
  KilometrajeRequest,
  Mantenimiento,
  MantenimientoRequest,
  RegistroKilometraje,
  Repuesto,
  TipoMantenimiento,
  Usuario,
  UsuarioRequest,
  Vehiculo,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/vehiculos`;

  listar() { return this.http.get<Vehiculo[]>(this.url); }
  obtener(id: number) { return this.http.get<Vehiculo>(`${this.url}/${id}`); }
  crear(v: Vehiculo) { return this.http.post<Vehiculo>(this.url, v); }
  actualizar(id: number, v: Vehiculo) { return this.http.put<Vehiculo>(`${this.url}/${id}`, v); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class TipoMantenimientoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/tipos-mantenimiento`;

  listar() { return this.http.get<TipoMantenimiento[]>(this.url); }
  crear(t: TipoMantenimiento) { return this.http.post<TipoMantenimiento>(this.url, t); }
  actualizar(id: number, t: TipoMantenimiento) { return this.http.put<TipoMantenimiento>(`${this.url}/${id}`, t); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/mantenimientos`;

  listar() { return this.http.get<Mantenimiento[]>(this.url); }
  porVehiculo(id: number) { return this.http.get<Mantenimiento[]>(`${this.url}/vehiculo/${id}`); }
  crear(m: MantenimientoRequest) { return this.http.post<Mantenimiento>(this.url, m); }
  actualizar(id: number, m: MantenimientoRequest) { return this.http.put<Mantenimiento>(`${this.url}/${id}`, m); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class KilometrajeService {
  private http = inject(HttpClient);
  private url = `${API_URL}/kilometraje`;

  porVehiculo(id: number) { return this.http.get<RegistroKilometraje[]>(`${this.url}/vehiculo/${id}`); }
  registrar(r: KilometrajeRequest) { return this.http.post<RegistroKilometraje>(this.url, r); }
}

@Injectable({ providedIn: 'root' })
export class RepuestoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/repuestos`;

  listar() { return this.http.get<Repuesto[]>(this.url); }
  crear(r: Repuesto) { return this.http.post<Repuesto>(this.url, r); }
  actualizar(id: number, r: Repuesto) { return this.http.put<Repuesto>(`${this.url}/${id}`, r); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class FallaService {
  private http = inject(HttpClient);
  private url = `${API_URL}/fallas`;

  listar() { return this.http.get<Falla[]>(this.url); }
  porVehiculo(id: number) { return this.http.get<Falla[]>(`${this.url}/vehiculo/${id}`); }
  crear(f: FallaRequest) { return this.http.post<Falla>(this.url, f); }
  actualizar(id: number, f: FallaRequest) { return this.http.put<Falla>(`${this.url}/${id}`, f); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private url = `${API_URL}/usuarios`;

  listar() { return this.http.get<Usuario[]>(this.url); }
  crear(u: UsuarioRequest) { return this.http.post<Usuario>(this.url, u); }
  actualizar(id: number, u: UsuarioRequest) { return this.http.put<Usuario>(`${this.url}/${id}`, u); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  resumen() { return this.http.get<Dashboard>(`${API_URL}/dashboard`); }
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private http = inject(HttpClient);

  costos() { return this.http.get<CostoPorVehiculo[]>(`${API_URL}/reportes/costos`); }
  fallas() { return this.http.get<FallasPorVehiculo[]>(`${API_URL}/reportes/fallas`); }
}