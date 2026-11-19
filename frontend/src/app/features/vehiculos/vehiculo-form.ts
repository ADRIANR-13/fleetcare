import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mensajeError } from '../../core/error-utils';
import { errorCampo } from '../../core/form-utils';
import { EstadoVehiculo, Vehiculo } from '../../core/models/models';
import { VehiculoService } from '../../core/services/api.services';

@Component({
  selector: 'app-vehiculo-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h2>{{ id ? 'Editar vehículo' : 'Nuevo vehículo' }}</h2>
    </div>

    <div class="card">
      @if (error()) {
        <div class="alert-error">{{ error() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
        <div class="form-grid">
          <div class="form-group">
            <label for="placa">Placa</label>
            <input id="placa" class="form-control" formControlName="placa" [class.invalid]="!!err('placa')" />
            @if (err('placa'); as m) { <span class="error-text">{{ m }}</span> }
          </div>

          <div class="form-group">
            <label for="marca">Marca</label>
            <input id="marca" class="form-control" formControlName="marca" [class.invalid]="!!err('marca')" />
            @if (err('marca'); as m) { <span class="error-text">{{ m }}</span> }
          </div>

          <div class="form-group">
            <label for="modelo">Modelo</label>
            <input id="modelo" class="form-control" formControlName="modelo" [class.invalid]="!!err('modelo')" />
            @if (err('modelo'); as m) { <span class="error-text">{{ m }}</span> }
          </div>

          <div class="form-group">
            <label for="anio">Año</label>
            <input id="anio" type="number" class="form-control" formControlName="anio" [class.invalid]="!!err('anio')" />
            @if (err('anio'); as m) { <span class="error-text">{{ m }}</span> }
          </div>

          <div class="form-group">
            <label for="kilometraje">Kilometraje</label>
            <input id="kilometraje" type="number" class="form-control" formControlName="kilometraje" [class.invalid]="!!err('kilometraje')" />
            @if (err('kilometraje'); as m) { <span class="error-text">{{ m }}</span> }
          </div>

          <div class="form-group">
            <label for="estado">Estado</label>
            <select id="estado" class="form-control" formControlName="estado">
              @for (e of estados; track e) {
                <option [value]="e">{{ e.replaceAll('_', ' ') }}</option>
              }
            </select>
          </div>
        </div>

        <div class="actions">
          <button class="btn" type="submit" [disabled]="guardando()">
            {{ guardando() ? 'Guardando...' : 'Guardar' }}
          </button>
          <a class="btn btn-secondary" routerLink="/vehiculos">Cancelar</a>
        </div>
      </form>
    </div>
  `,
})
export class VehiculoForm {
  private fb = inject(FormBuilder);
  private service = inject(VehiculoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = Number(this.route.snapshot.paramMap.get('id')) || null;
  estados: EstadoVehiculo[] = ['OPERATIVO', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'];
  guardando = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    placa: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(1990)]],
    kilometraje: [0, [Validators.required, Validators.min(0)]],
    estado: ['OPERATIVO' as EstadoVehiculo, Validators.required],
  });

  constructor() {
    if (this.id) {
      this.service.obtener(this.id).subscribe({
        next: (v) => this.form.patchValue(v),
        error: (e) => this.error.set(mensajeError(e)),
      });
    }
  }

  err(campo: string): string {
    return errorCampo(this.form.get(campo));
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    const datos = this.form.getRawValue() as Vehiculo;
    const op = this.id ? this.service.actualizar(this.id, datos) : this.service.crear(datos);

    op.subscribe({
      next: () => this.router.navigate(['/vehiculos']),
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeError(e));
      },
    });
  }
}