import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { mensajeError } from '../../core/error-utils';
import { Falla, Mantenimiento, RegistroKilometraje, Vehiculo } from '../../core/models/models';
import {
  FallaService,
  KilometrajeService,
  MantenimientoService,
  VehiculoService,
} from '../../core/services/api.services';

@Component({
  selector: 'app-vehiculo-detail',
  imports: [RouterLink, DatePipe, DecimalPipe],
  template: `
    <div class="page-header">
      <h2>Detalle del vehículo</h2>
      <a class="btn btn-secondary" routerLink="/vehiculos">← Volver</a>
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    @if (vehiculo(); as v) {
      <div class="card">
        <div class="detail-grid">
          <div><span>Placa</span><strong>{{ v.placa }}</strong></div>
          <div><span>Marca</span>{{ v.marca }}</div>
          <div><span>Modelo</span>{{ v.modelo }}</div>
          <div><span>Año</span>{{ v.anio }}</div>
          <div><span>Kilometraje</span>{{ v.kilometraje | number: '1.0-0' }} km</div>
          <div><span>Estado</span><span class="badge" [attr.data-v]="v.estado">{{ v.estado.replaceAll('_', ' ') }}</span></div>
        </div>
      </div>

      <div class="card mt">
        <h3>🔧 Historial de mantenimientos</h3>
        @if (mantenimientos().length === 0) {
          <p class="muted">Sin mantenimientos registrados.</p>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead><tr><th>Fecha</th><th>Tipo</th><th>Km</th><th>Costo</th><th>Estado</th></tr></thead>
              <tbody>
                @for (m of mantenimientos(); track m.id) {
                  <tr>
                    <td>{{ m.fecha | date: 'dd/MM/yyyy' }}</td>
                    <td>{{ m.tipo.nombre }}</td>
                    <td>{{ m.kilometraje | number: '1.0-0' }}</td>
                    <td>S/ {{ m.costo | number: '1.2-2' }}</td>
                    <td><span class="badge" [attr.data-v]="m.estado">{{ m.estado }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <div class="two-col">
        <div class="card">
          <h3>⚠️ Fallas</h3>
          @if (fallas().length === 0) {
            <p class="muted">Sin fallas registradas.</p>
          } @else {
            <div class="table-wrapper">
              <table class="table">
                <thead><tr><th>Fecha</th><th>Componente</th><th>Gravedad</th><th>Resuelta</th></tr></thead>
                <tbody>
                  @for (f of fallas(); track f.id) {
                    <tr>
                      <td>{{ f.fecha | date: 'dd/MM/yyyy' }}</td>
                      <td>{{ f.componente }}</td>
                      <td><span class="badge" [attr.data-v]="f.gravedad">{{ f.gravedad }}</span></td>
                      <td>{{ f.resuelta ? 'Sí' : 'No' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        <div class="card">
          <h3>🧭 Historial de kilometraje</h3>
          @if (kms().length === 0) {
            <p class="muted">Sin registros.</p>
          } @else {
            <div class="table-wrapper">
              <table class="table">
                <thead><tr><th>Fecha</th><th>Kilometraje</th></tr></thead>
                <tbody>
                  @for (k of kms(); track k.id) {
                    <tr>
                      <td>{{ k.fecha | date: 'dd/MM/yyyy' }}</td>
                      <td>{{ k.kilometraje | number: '1.0-0' }} km</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class VehiculoDetail {
  private route = inject(ActivatedRoute);
  private vehiculoService = inject(VehiculoService);
  private mantService = inject(MantenimientoService);
  private fallaService = inject(FallaService);
  private kmService = inject(KilometrajeService);

  vehiculo = signal<Vehiculo | null>(null);
  mantenimientos = signal<Mantenimiento[]>([]);
  fallas = signal<Falla[]>([]);
  kms = signal<RegistroKilometraje[]>([]);
  error = signal('');

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.vehiculoService.obtener(id).subscribe({
      next: (v) => this.vehiculo.set(v),
      error: (e) => this.error.set(mensajeError(e)),
    });
    this.mantService.porVehiculo(id).subscribe((d) => this.mantenimientos.set(d));
    this.fallaService.porVehiculo(id).subscribe((d) => this.fallas.set(d));
    this.kmService.porVehiculo(id).subscribe((d) => this.kms.set(d));
  }
}