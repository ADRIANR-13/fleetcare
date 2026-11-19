export type Rol = 'ADMIN' | 'JEFE_MANTENIMIENTO' | 'TECNICO';
export type EstadoVehiculo = 'OPERATIVO' | 'EN_MANTENIMIENTO' | 'FUERA_DE_SERVICIO';
export type CategoriaMantenimiento = 'PREVENTIVO' | 'CORRECTIVO';
export type EstadoMantenimiento = 'PROGRAMADO' | 'EN_PROCESO' | 'COMPLETADO';
export type GravedadFalla = 'BAJA' | 'MEDIA' | 'ALTA';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  rol: Rol;
}

export interface Vehiculo {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  estado: EstadoVehiculo;
}

export interface TipoMantenimiento {
  id?: number;
  nombre: string;
  categoria: CategoriaMantenimiento;
  intervaloKm: number | null;
  intervaloDias: number | null;
  descripcion: string | null;
}

export interface Repuesto {
  id?: number;
  nombre: string;
  codigo: string;
  stock: number;
  precioUnitario: number;
  proveedor: string | null;
}

export interface Mantenimiento {
  id: number;
  vehiculo: Vehiculo;
  tipo: TipoMantenimiento;
  fecha: string;
  kilometraje: number;
  costo: number;
  descripcion: string | null;
  estado: EstadoMantenimiento;
}

export interface MantenimientoRequest {
  vehiculoId: number;
  tipoId: number;
  fecha: string;
  kilometraje: number;
  costo: number;
  descripcion: string | null;
  estado: EstadoMantenimiento;
}

export interface RegistroKilometraje {
  id: number;
  vehiculo: Vehiculo;
  fecha: string;
  kilometraje: number;
}

export interface KilometrajeRequest {
  vehiculoId: number;
  fecha: string;
  kilometraje: number;
}

export interface Falla {
  id: number;
  vehiculo: Vehiculo;
  componente: string;
  descripcion: string | null;
  fecha: string;
  gravedad: GravedadFalla;
  resuelta: boolean;
}

export interface FallaRequest {
  vehiculoId: number;
  componente: string;
  descripcion: string | null;
  fecha: string;
  gravedad: GravedadFalla;
  resuelta: boolean;
}

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  rol: Rol;
  activo: boolean;
}

export interface UsuarioRequest {
  username: string;
  password: string | null;
  nombre: string;
  rol: Rol;
  activo: boolean;
}

export interface CostoPorVehiculo {
  placa: string;
  total: number;
}

export interface FallasPorVehiculo {
  placa: string;
  total: number;
}

export interface Dashboard {
  totalVehiculos: number;
  vehiculosOperativos: number;
  vehiculosEnMantenimiento: number;
  mantenimientosProgramados: number;
  fallasAbiertas: number;
  costoTotal: number;
  alertas: Mantenimiento[];
  costosPorVehiculo: CostoPorVehiculo[];
  fallasPorVehiculo: FallasPorVehiculo[];
}