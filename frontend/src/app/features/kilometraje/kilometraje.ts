import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { mensajeError } from '../../core/error-utils';
import { errorCampo } from '../../core/form-utils';
import { KilometrajeRequest, RegistroKilometraje, Vehiculo } from '../../core/models/models';
import { KilometrajeService, VehiculoService } from '../../core/services/api.services';

@Component({
  selector: 'app-kilometraje',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="page-header"><h2>Registro de kilometraje</h2></div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }
    @if (exito()) {
      <div class="card" style="margin-bottom: 1rem; color: #166534">{{ exito() }}</div>
    }

    <div class="card" style="margin-bottom: 1rem">
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <div class="form-grid">
          <div class="form-group">
            <label for="vehiculoId">Vehículo</label>
            <select id="vehiculoId" class="form-control" formControlName="vehiculoId" [class.invalid]="!!err('vehiculoId')">
              <option [ngValue]="null">-- Selecciona --</option>
              @for (v of vehiculos(); track v.id) {
                <option [ngValue]="v.id">{{ v.placa }} · {{ v.kilometraje | number: '1.0-0' }} km</option>
              }
            </select>
            @if (err('vehiculoId'); as m) { <span class="error-text">{{ m }}</span> }
          </div>

          <div class="form-group">
            <label for="fecha">Fecha</label>
            <input id="fecha" type="date" class="form-control" formControlName="fecha" [class.invalid]="!!err('fecha')" />
            @if (err('fecha'); as m) { <span class="error-text">{{ m }}</span> }
          </div>

          <div class="form-group">
            <label for="kilometraje">Nuevo kilometraje</label>
            <input id="kilometraje" type="number" class="form-control" formControlName="kilometraje" [class.invalid]="!!err('kilometraje')" />
            @if (err('kilometraje'); as m) { <span class="error-text">{{ m }}</span> }
          </div>
        </div>

        <button class="btn" type="submit" [disabled]="guardando()">
          {{ guardando() ? 'Guardando...' : 'Registrar kilometraje' }}
        </button>
      </form>
    </div>

    <div class="card table-wrapper">
      <h3>Historial del vehículo seleccionado</h3>
      @if (!form.controls.vehiculoId.value) {
        <p class="muted">Selecciona un vehículo para ver su historial.</p>
      } @else if (registros().length === 0) {
        <p class="muted">Sin registros para este vehículo.</p>
      } @else {
        <table class="table">
          <thead><tr><th>Fecha</th><th>Kilometraje</th></tr></thead>
          <tbody>
            @for (r of registros(); track r.id) {
              <tr>
                <td>{{ r.fecha | date: 'dd/MM/yyyy' }}</td>
                <td>{{ r.kilometraje | number: '1.0-0' }} km</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class Kilometraje {
  private fb = inject(FormBuilder);
  private service = inject(KilometrajeService);
  private vehiculoService = inject(VehiculoService);

  vehiculos = signal<Vehiculo[]>([]);
  registros = signal<RegistroKilometraje[]>([]);
  guardando = signal(false);
  error = signal('');
  exito = signal('');

  form = this.fb.nonNullable.group({
    vehiculoId: [null as number | null, Validators.required],
    fecha: [new Date().toISOString().slice(0, 10), Validators.required],
    kilometraje: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.cargarVehiculos();
    this.form.controls.vehiculoId.valueChanges.subscribe(() => this.cargarRegistros());
  }

  err(campo: string): string {
    return errorCampo(this.form.get(campo));
  }

  private cargarVehiculos(): void {
    this.vehiculoService.listar().subscribe((d) => this.vehiculos.set(d));
  }

  private cargarRegistros(): void {
    const id = this.form.controls.vehiculoId.value;
    if (!id) {
      this.registros.set([]);
      return;
    }
    this.service.porVehiculo(id).subscribe((d) => this.registros.set(d));
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    this.exito.set('');

    this.service.registrar(this.form.getRawValue() as KilometrajeRequest).subscribe({
      next: () => {
        this.guardando.set(false);
        this.exito.set('Kilometraje registrado correctamente.');
        this.form.controls.kilometraje.reset();
        this.cargarRegistros();
        this.cargarVehiculos();
      },
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeError(e));
      },
    });
  }
}