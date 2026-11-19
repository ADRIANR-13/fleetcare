import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { mensajeError } from '../../core/error-utils';
import { CostoPorVehiculo, FallasPorVehiculo } from '../../core/models/models';
import { ReporteService } from '../../core/services/api.services';

@Component({
  selector: 'app-reportes',
  imports: [DecimalPipe],
  template: `
    <div class="page-header">
      <h2>Reportes</h2>
      <button class="btn btn-secondary" (click)="imprimir()">🖨️ Imprimir</button>
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    <div class="two-col">
      <div class="card table-wrapper">
        <h3>Costo de mantenimiento por vehículo</h3>
        @if (costos().length === 0) {
          <p class="muted">Sin datos (solo cuentan los mantenimientos COMPLETADOS).</p>
        } @else {
          <table class="table">
            <thead><tr><th>Placa</th><th>Total</th></tr></thead>
            <tbody>
              @for (c of costos(); track c.placa) {
                <tr><td>{{ c.placa }}</td><td>S/ {{ c.total | number: '1.2-2' }}</td></tr>
              }
            </tbody>
          </table>
        }
      </div>

      <div class="card table-wrapper">
        <h3>Cantidad de fallas por vehículo</h3>
        @if (fallas().length === 0) {
          <p class="muted">Sin datos.</p>
        } @else {
          <table class="table">
            <thead><tr><th>Placa</th><th>Fallas</th></tr></thead>
            <tbody>
              @for (f of fallas(); track f.placa) {
                <tr><td>{{ f.placa }}</td><td>{{ f.total }}</td></tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
})
export class Reportes {
  private service = inject(ReporteService);

  costos = signal<CostoPorVehiculo[]>([]);
  fallas = signal<FallasPorVehiculo[]>([]);
  error = signal('');

  constructor() {
    this.service.costos().subscribe({
      next: (d) => this.costos.set(d),
      error: (e) => this.error.set(mensajeError(e)),
    });
    this.service.fallas().subscribe({
      next: (d) => this.fallas.set(d),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  imprimir(): void {
    window.print();
  }
}