import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { mensajeError } from '../../core/error-utils';
import { errorCampo } from '../../core/form-utils';
import { Falla, FallaRequest, GravedadFalla, Vehiculo } from '../../core/models/models';
import { FallaService, VehiculoService } from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-fallas',
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="page-header">
      <h2>Historial de fallas</h2>
      @if (!mostrarForm()) {
        <button class="btn" (click)="nuevo()">+ Registrar falla</button>
      }
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    @if (mostrarForm()) {
      <div class="card" style="margin-bottom: 1rem">
        <h3>{{ editandoId() ? 'Editar falla' : 'Nueva falla' }}</h3>
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
              <label for="componente">Componente</label>
              <input id="componente" class="form-control" formControlName="componente" [class.invalid]="!!err('componente')" />
              @if (err('componente'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="fecha">Fecha</label>
              <input id="fecha" type="date" class="form-control" formControlName="fecha" [class.invalid]="!!err('fecha')" />
              @if (err('fecha'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="gravedad">Gravedad</label>
              <select id="gravedad" class="form-control" formControlName="gravedad">
                @for (g of gravedades; track g) {
                  <option [value]="g">{{ g }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <input id="descripcion" class="form-control" formControlName="descripcion" />
          </div>

          <label class="check">
            <input type="checkbox" formControlName="resuelta" /> Falla resuelta
          </label>

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
        <p class="muted">No hay fallas registradas.</p>
      } @else {
        <table class="table">
          <thead>
            <tr><th>Fecha</th><th>Vehículo</th><th>Componente</th><th>Gravedad</th><th>Resuelta</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (f of items(); track f.id) {
              <tr>
                <td>{{ f.fecha | date: 'dd/MM/yyyy' }}</td>
                <td><strong>{{ f.vehiculo.placa }}</strong></td>
                <td>{{ f.componente }}</td>
                <td><span class="badge" [attr.data-v]="f.gravedad">{{ f.gravedad }}</span></td>
                <td>{{ f.resuelta ? 'Sí' : 'No' }}</td>
                <td>
                  <div class="actions">
                    <button class="btn btn-sm" (click)="editar(f)">Editar</button>
                    @if (puedeEliminar()) {
                      <button class="btn btn-danger btn-sm" (click)="eliminar(f)">Eliminar</button>
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
export class Fallas {
  private fb = inject(FormBuilder);
  private service = inject(FallaService);
  private vehiculoService = inject(VehiculoService);
  private auth = inject(AuthService);

  gravedades: GravedadFalla[] = ['BAJA', 'MEDIA', 'ALTA'];
  items = signal<Falla[]>([]);
  vehiculos = signal<Vehiculo[]>([]);
  mostrarForm = signal(false);
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  error = signal('');
  puedeEliminar = computed(() => this.auth.tieneRol('ADMIN', 'JEFE_MANTENIMIENTO'));

  form = this.fb.nonNullable.group({
    vehiculoId: [null as number | null, Validators.required],
    componente: ['', Validators.required],
    descripcion: [''],
    fecha: ['', Validators.required],
    gravedad: ['MEDIA' as GravedadFalla, Validators.required],
    resuelta: [false],
  });

  constructor() {
    this.cargar();
    this.vehiculoService.listar().subscribe((d) => this.vehiculos.set(d));
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

  editar(f: Falla): void {
    this.editandoId.set(f.id);
    this.form.patchValue({
      vehiculoId: f.vehiculo.id,
      componente: f.componente,
      descripcion: f.descripcion ?? '',
      fecha: f.fecha,
      gravedad: f.gravedad,
      resuelta: f.resuelta,
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
    const datos = this.form.getRawValue() as FallaRequest;
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

  eliminar(f: Falla): void {
    if (!confirm('¿Eliminar esta falla?')) return;
    this.error.set('');
    this.service.eliminar(f.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}