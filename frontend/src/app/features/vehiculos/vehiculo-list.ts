import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../core/error-utils';
import { Vehiculo } from '../../core/models/models';
import { VehiculoService } from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-vehiculo-list',
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="page-header">
      <h2>Vehículos</h2>
      <a class="btn" routerLink="/vehiculos/nuevo">+ Nuevo vehículo</a>
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    <div class="card table-wrapper">
      @if (cargando()) {
        <p class="muted">Cargando...</p>
      } @else if (vehiculos().length === 0) {
        <p class="muted">No hay vehículos registrados.</p>
      } @else {
        <table class="table">
          <thead>
            <tr>
              <th>Placa</th><th>Marca</th><th>Modelo</th><th>Año</th>
              <th>Kilometraje</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (v of vehiculos(); track v.id) {
              <tr>
                <td><strong>{{ v.placa }}</strong></td>
                <td>{{ v.marca }}</td>
                <td>{{ v.modelo }}</td>
                <td>{{ v.anio }}</td>
                <td>{{ v.kilometraje | number: '1.0-0' }} km</td>
                <td><span class="badge" [attr.data-v]="v.estado">{{ v.estado.replaceAll('_', ' ') }}</span></td>
                <td>
                  <div class="actions">
                    <a class="btn btn-secondary btn-sm" [routerLink]="['/vehiculos', v.id]">Detalle</a>
                    <a class="btn btn-sm" [routerLink]="['/vehiculos', v.id, 'editar']">Editar</a>
                    @if (puedeEliminar()) {
                      <button class="btn btn-danger btn-sm" (click)="eliminar(v)">Eliminar</button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class VehiculoList {
  private service = inject(VehiculoService);
  private auth = inject(AuthService);

  vehiculos = signal<Vehiculo[]>([]);
  cargando = signal(true);
  error = signal('');
  puedeEliminar = computed(() => this.auth.tieneRol('ADMIN', 'JEFE_MANTENIMIENTO'));

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.service.listar().subscribe({
      next: (data) => {
        this.vehiculos.set(data);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(mensajeError(e));
        this.cargando.set(false);
      },
    });
  }

  eliminar(v: Vehiculo): void {
    if (!confirm(`¿Eliminar el vehículo ${v.placa}?`)) return;
    this.error.set('');
    this.service.eliminar(v.id!).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}