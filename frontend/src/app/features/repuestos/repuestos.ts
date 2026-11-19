import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { mensajeError } from '../../core/error-utils';
import { errorCampo } from '../../core/form-utils';
import { Repuesto } from '../../core/models/models';
import { RepuestoService } from '../../core/services/api.services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-repuestos',
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <div class="page-header">
      <h2>Repuestos</h2>
      @if (!mostrarForm()) {
        <button class="btn" (click)="nuevo()">+ Nuevo repuesto</button>
      }
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    @if (mostrarForm()) {
      <div class="card" style="margin-bottom: 1rem">
        <h3>{{ editandoId() ? 'Editar repuesto' : 'Nuevo repuesto' }}</h3>
        <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input id="nombre" class="form-control" formControlName="nombre" [class.invalid]="!!err('nombre')" />
              @if (err('nombre'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="codigo">Código</label>
              <input id="codigo" class="form-control" formControlName="codigo" [class.invalid]="!!err('codigo')" />
              @if (err('codigo'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="stock">Stock</label>
              <input id="stock" type="number" class="form-control" formControlName="stock" [class.invalid]="!!err('stock')" />
              @if (err('stock'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="precioUnitario">Precio unitario (S/)</label>
              <input id="precioUnitario" type="number" step="0.01" class="form-control" formControlName="precioUnitario" [class.invalid]="!!err('precioUnitario')" />
              @if (err('precioUnitario'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="proveedor">Proveedor</label>
              <input id="proveedor" class="form-control" formControlName="proveedor" />
            </div>
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
        <p class="muted">No hay repuestos registrados.</p>
      } @else {
        <table class="table">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Precio</th><th>Proveedor</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (r of items(); track r.id) {
              <tr>
                <td><strong>{{ r.codigo }}</strong></td>
                <td>{{ r.nombre }}</td>
                <td>{{ r.stock }}</td>
                <td>S/ {{ r.precioUnitario | number: '1.2-2' }}</td>
                <td>{{ r.proveedor }}</td>
                <td>
                  <div class="actions">
                    <button class="btn btn-sm" (click)="editar(r)">Editar</button>
                    @if (puedeEliminar()) {
                      <button class="btn btn-danger btn-sm" (click)="eliminar(r)">Eliminar</button>
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
export class Repuestos {
  private fb = inject(FormBuilder);
  private service = inject(RepuestoService);
  private auth = inject(AuthService);

  items = signal<Repuesto[]>([]);
  mostrarForm = signal(false);
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  error = signal('');
  puedeEliminar = computed(() => this.auth.tieneRol('ADMIN', 'JEFE_MANTENIMIENTO'));

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    precioUnitario: [0, [Validators.required, Validators.min(0)]],
    proveedor: [''],
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

  editar(r: Repuesto): void {
    this.editandoId.set(r.id!);
    this.form.patchValue({ ...r, proveedor: r.proveedor ?? '' });
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
    const datos = this.form.getRawValue() as Repuesto;
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

  eliminar(r: Repuesto): void {
    if (!confirm(`¿Eliminar el repuesto "${r.nombre}"?`)) return;
    this.error.set('');
    this.service.eliminar(r.id!).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}