import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { mensajeError } from '../../core/error-utils';
import { errorCampo } from '../../core/form-utils';
import { CategoriaMantenimiento, TipoMantenimiento } from '../../core/models/models';
import { TipoMantenimientoService } from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-tipos',
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h2>Tipos de mantenimiento</h2>
      @if (!mostrarForm()) {
        <button class="btn" (click)="nuevo()">+ Nuevo tipo</button>
      }
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    @if (mostrarForm()) {
      <div class="card" style="margin-bottom: 1rem">
        <h3>{{ editandoId() ? 'Editar tipo' : 'Nuevo tipo' }}</h3>
        <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input id="nombre" class="form-control" formControlName="nombre" [class.invalid]="!!err('nombre')" />
              @if (err('nombre'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="categoria">Categoría</label>
              <select id="categoria" class="form-control" formControlName="categoria">
                <option value="PREVENTIVO">PREVENTIVO</option>
                <option value="CORRECTIVO">CORRECTIVO</option>
              </select>
            </div>

            <div class="form-group">
              <label for="intervaloKm">Intervalo (km)</label>
              <input id="intervaloKm" type="number" class="form-control" formControlName="intervaloKm" [class.invalid]="!!err('intervaloKm')" />
              @if (err('intervaloKm'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="intervaloDias">Intervalo (días)</label>
              <input id="intervaloDias" type="number" class="form-control" formControlName="intervaloDias" [class.invalid]="!!err('intervaloDias')" />
              @if (err('intervaloDias'); as m) { <span class="error-text">{{ m }}</span> }
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
        <p class="muted">No hay tipos registrados.</p>
      } @else {
        <table class="table">
          <thead>
            <tr><th>Nombre</th><th>Categoría</th><th>Cada (km)</th><th>Cada (días)</th><th>Descripción</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (t of items(); track t.id) {
              <tr>
                <td><strong>{{ t.nombre }}</strong></td>
                <td><span class="badge" [attr.data-v]="t.categoria">{{ t.categoria }}</span></td>
                <td>{{ t.intervaloKm ?? '—' }}</td>
                <td>{{ t.intervaloDias ?? '—' }}</td>
                <td>{{ t.descripcion }}</td>
                <td>
                  <div class="actions">
                    <button class="btn btn-sm" (click)="editar(t)">Editar</button>
                    @if (puedeEliminar()) {
                      <button class="btn btn-danger btn-sm" (click)="eliminar(t)">Eliminar</button>
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
export class Tipos {
  private fb = inject(FormBuilder);
  private service = inject(TipoMantenimientoService);
  private auth = inject(AuthService);

  items = signal<TipoMantenimiento[]>([]);
  mostrarForm = signal(false);
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  error = signal('');
  puedeEliminar = computed(() => this.auth.tieneRol('ADMIN', 'JEFE_MANTENIMIENTO'));

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    categoria: ['PREVENTIVO' as CategoriaMantenimiento, Validators.required],
    intervaloKm: [null as number | null, Validators.min(1)],
    intervaloDias: [null as number | null, Validators.min(1)],
    descripcion: [''],
  });

  constructor() {
    this.cargar();
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

  editar(t: TipoMantenimiento): void {
    this.editandoId.set(t.id!);
    this.form.patchValue({ ...t, descripcion: t.descripcion ?? '' });
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
    const datos = this.form.getRawValue() as TipoMantenimiento;
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

  eliminar(t: TipoMantenimiento): void {
    if (!confirm(`¿Eliminar el tipo "${t.nombre}"?`)) return;
    this.error.set('');
    this.service.eliminar(t.id!).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}