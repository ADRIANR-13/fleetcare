import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { mensajeError } from '../../core/error-utils';
import { Dashboard } from '../../core/models/models';
import { DashboardService } from '../../core/services/api.services';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, DecimalPipe],
  template: `
    <div class="page-header"><h2>Dashboard</h2></div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    @if (data(); as d) {
      <div class="grid-cards">
        <div class="card stat"><span>Total vehículos</span><strong>{{ d.totalVehiculos }}</strong></div>
        <div class="card stat"><span>Operativos</span><strong>{{ d.vehiculosOperativos }}</strong></div>
        <div class="card stat"><span>En mantenimiento</span><strong>{{ d.vehiculosEnMantenimiento }}</strong></div>
        <div class="card stat"><span>Mantenimientos programados</span><strong>{{ d.mantenimientosProgramados }}</strong></div>
        <div class="card stat"><span>Fallas abiertas</span><strong>{{ d.fallasAbiertas }}</strong></div>
        <div class="card stat"><span>Costo total</span><strong>S/ {{ d.costoTotal | number: '1.2-2' }}</strong></div>
      </div>

      <div class="card">
        <h3>🔔 Alertas: mantenimientos programados (próximos 7 días)</h3>
        @if (d.alertas.length === 0) {
          <p class="muted">No hay mantenimientos próximos.</p>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr><th>Fecha</th><th>Vehículo</th><th>Tipo</th><th>Estado</th></tr>
              </thead>
              <tbody>
                @for (a of d.alertas; track a.id) {
                  <tr>
                    <td>{{ a.fecha | date: 'dd/MM/yyyy' }}</td>
                    <td>{{ a.vehiculo.placa }}</td>
                    <td>{{ a.tipo.nombre }}</td>
                    <td><span class="badge" [attr.data-v]="a.estado">{{ a.estado }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <div class="two-col">
        <div class="card">
          <h3>Costo por vehículo</h3>
          @if (d.costosPorVehiculo.length === 0) {
            <p class="muted">Sin datos.</p>
          } @else {
            <table class="table">
              <thead><tr><th>Placa</th><th>Total</th></tr></thead>
              <tbody>
                @for (c of d.costosPorVehiculo; track c.placa) {
                  <tr><td>{{ c.placa }}</td><td>S/ {{ c.total | number: '1.2-2' }}</td></tr>
                }
              </tbody>
            </table>
          }
        </div>

        <div class="card">
          <h3>Fallas por vehículo</h3>
          @if (d.fallasPorVehiculo.length === 0) {
            <p class="muted">Sin datos.</p>
          } @else {
            <table class="table">
              <thead><tr><th>Placa</th><th>Fallas</th></tr></thead>
              <tbody>
                @for (f of d.fallasPorVehiculo; track f.placa) {
                  <tr><td>{{ f.placa }}</td><td>{{ f.total }}</td></tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    }
  `,
})
export class DashboardPage {
  private service = inject(DashboardService);

  data = signal<Dashboard | null>(null);
  error = signal('');

  constructor() {
    this.service.resumen().subscribe({
      next: (d) => this.data.set(d),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}