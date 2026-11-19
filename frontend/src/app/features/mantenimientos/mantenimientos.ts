import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { mensajeError } from '../../core/error-utils';
import { errorCampo } from '../../core/form-utils';
import {
  EstadoMantenimiento,
  Mantenimiento,
  MantenimientoRequest,
  TipoMantenimiento,
  Vehiculo,
} from '../../core/models/models';
import {
  MantenimientoService,
  TipoMantenimientoService,
  VehiculoService,
} from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mantenimientos',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="page-header">
      <h2>Mantenimientos</h2>
      @if (!mostrarForm()) {
        <button class="btn" (click)="nuevo()">+ Programar / registrar</button>
      }
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    @if (mostrarForm()) {
      <div class="card" style="margin-bottom: 1rem">
        <h3>{{ editandoId() ? 'Editar mantenimiento' : 'Nuevo mantenimiento' }}</h3>
        <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="vehiculoId">Vehículo</label>
              <select id="vehiculoId" class="form-control" formControlName="vehiculoId" [class.invalid]="!!err('vehiculoId')">
                <option [ngValue]="null">-- Selecciona --</option>
                @for (v of vehiculos(); track v.id) {
                  <option [ngValue]="v.id">{{ v.placa }} · {{ v.marca }} {{ v.modelo }}</option>
                }
              </select>
              @if (err('vehiculoId'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="tipoId">Tipo de mantenimiento</label>
              <select id="tipoId" class="form-control" formControlName="tipoId" [class.invalid]="!!err('tipoId')">
                <option [ngValue]="null">-- Selecciona --</option>
                @for (t of tipos(); track t.id) {
                  <option [ngValue]="t.id">{{ t.nombre }} ({{ t.categoria }})</option>
                }
              </select>
              @if (err('tipoId'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="fecha">Fecha</label>
              <input id="fecha" type="date" class="form-control" formControlName="fecha" [class.invalid]="!!err('fecha')" />
              @if (err('fecha'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="kilometraje">Kilometraje</label>
              <input id="kilometraje" type="number" class="form-control" formControlName="kilometraje" [class.invalid]="!!err('kilometraje')" />
              @if (err('kilometraje'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="costo">Costo (S/)</label>
              <input id="costo" type="number" step="0.01" class="form-control" formControlName="costo" [class.invalid]="!!err('costo')" />
              @if (err('costo'); as m) { <span class="error-text">{{ m }}</span> }
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

          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <input id="descripcion" class="form-control" formControlName="descripcion" />
          </div>

          <div class="actions">
            <button class="btn" type="submit" [disabled]="guardando()">
              {{ guardando() ? 'Guardando...' : 'Guardar' }}
            </button>
            <button class="btn btn-secondary" type="button" (click)="cancelar()">Cancelar</button>
          </div>
        </form>
      </div>
    }

    <div class="card table-wrapper">
      @if (items().length === 0) {
        <p class="muted">No hay mantenimientos registrados.</p>
      } @else {
        <table class="table">
          <thead>
            <tr><th>Fecha</th><th>Vehículo</th><th>Tipo</th><th>Km</th><th>Costo</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (m of items(); track m.id) {
              <tr>
                <td>{{ m.fecha | date: 'dd/MM/yyyy' }}</td>
                <td><strong>{{ m.vehiculo.placa }}</strong></td>
                <td>{{ m.tipo.nombre }}</td>
                <td>{{ m.kilometraje | number: '1.0-0' }}</td>
                <td>S/ {{ m.costo | number: '1.2-2' }}</td>
                <td><span class="badge" [attr.data-v]="m.estado">{{ m.estado.replaceAll('_', ' ') }}</span></td>
                <td>
                  <div class="actions">
                    <button class="btn btn-sm" (click)="editar(m)">Editar</button>
                    @if (puedeEliminar()) {
                      <button class="btn btn-danger btn-sm" (click)="eliminar(m)">Eliminar</button>
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
export class Mantenimientos {
  private fb = inject(FormBuilder);
  private service = inject(MantenimientoService);
  private vehiculoService = inject(VehiculoService);
  private tipoService = inject(TipoMantenimientoService);
  private auth = inject(AuthService);

  estados: EstadoMantenimiento[] = ['PROGRAMADO', 'EN_PROCESO', 'COMPLETADO'];
  items = signal<Mantenimiento[]>([]);
  vehiculos = signal<Vehiculo[]>([]);
  tipos = signal<TipoMantenimiento[]>([]);
  mostrarForm = signal(false);
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  error = signal('');
  puedeEliminar = computed(() => this.auth.tieneRol('ADMIN', 'JEFE_MANTENIMIENTO'));

  form = this.fb.nonNullable.group({
    vehiculoId: [null as number | null, Validators.required],
    tipoId: [null as number | null, Validators.required],
    fecha: ['', Validators.required],
    kilometraje: [0, [Validators.required, Validators.min(0)]],
    costo: [0, [Validators.required, Validators.min(0)]],
    descripcion: [''],
    estado: ['PROGRAMADO' as EstadoMantenimiento, Validators.required],
  });

  constructor() {
    this.cargar();
    this.vehiculoService.listar().subscribe((d) => this.vehiculos.set(d));
    this.tipoService.listar().subscribe((d) => this.tipos.set(d));
  }

  err(campo: string): string {
    return errorCampo(this.form.get(campo));
  }

  cargar(): void {
    this.service.listar().subscribe({
      next: (d) => this.items.set(d),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  nuevo(): void {
    this.editandoId.set(null);
    this.form.reset();
    this.error.set('');
    this.mostrarForm.set(true);
  }

  editar(m: Mantenimiento): void {
    this.editandoId.set(m.id);
    this.form.patchValue({
      vehiculoId: m.vehiculo.id,
      tipoId: m.tipo.id,
      fecha: m.fecha,
      kilometraje: m.kilometraje,
      costo: m.costo,
      descripcion: m.descripcion ?? '',
      estado: m.estado,
    });
    this.error.set('');
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    const datos = this.form.getRawValue() as MantenimientoRequest;
    const id = this.editandoId();
    const op = id ? this.service.actualizar(id, datos) : this.service.crear(datos);

    op.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (e) => {
        this.guardando.set(false);
        this.error.set(mensajeError(e));
      },
    });
  }

  eliminar(m: Mantenimiento): void {
    if (!confirm('¿Eliminar este mantenimiento?')) return;
    this.error.set('');
    this.service.eliminar(m.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}