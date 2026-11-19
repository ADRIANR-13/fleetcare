import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { mensajeError } from '../../core/error-utils';
import { errorCampo } from '../../core/form-utils';
import { Rol, Usuario, UsuarioRequest } from '../../core/models/models';
import { UsuarioService } from '../../core/services/api.services';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h2>Usuarios</h2>
      @if (!mostrarForm()) {
        <button class="btn" (click)="nuevo()">+ Nuevo usuario</button>
      }
    </div>

    @if (error()) {
      <div class="alert-error">{{ error() }}</div>
    }

    @if (mostrarForm()) {
      <div class="card" style="margin-bottom: 1rem">
        <h3>{{ editandoId() ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
        <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
          <div class="form-grid">
            <div class="form-group">
              <label for="username">Usuario</label>
              <input id="username" class="form-control" formControlName="username" [class.invalid]="!!err('username')" />
              @if (err('username'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input id="nombre" class="form-control" formControlName="nombre" [class.invalid]="!!err('nombre')" />
              @if (err('nombre'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="password">
                Contraseña {{ editandoId() ? '(dejar vacía para no cambiarla)' : '' }}
              </label>
              <input id="password" type="password" class="form-control" formControlName="password" [class.invalid]="!!err('password')" autocomplete="new-password" />
              @if (err('password'); as m) { <span class="error-text">{{ m }}</span> }
            </div>

            <div class="form-group">
              <label for="rol">Rol</label>
              <select id="rol" class="form-control" formControlName="rol">
                @for (r of roles; track r) {
                  <option [value]="r">{{ r.replaceAll('_', ' ') }}</option>
                }
              </select>
            </div>
          </div>

          <label class="check">
            <input type="checkbox" formControlName="activo" /> Usuario activo
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
        <p class="muted">No hay usuarios.</p>
      } @else {
        <table class="table">
          <thead>
            <tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Activo</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            @for (u of items(); track u.id) {
              <tr>
                <td><strong>{{ u.username }}</strong></td>
                <td>{{ u.nombre }}</td>
                <td>{{ u.rol.replaceAll('_', ' ') }}</td>
                <td>{{ u.activo ? 'Sí' : 'No' }}</td>
                <td>
                  <div class="actions">
                    <button class="btn btn-sm" (click)="editar(u)">Editar</button>
                    <button class="btn btn-danger btn-sm" (click)="eliminar(u)">Eliminar</button>
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
export class Usuarios {
  private fb = inject(FormBuilder);
  private service = inject(UsuarioService);

  roles: Rol[] = ['ADMIN', 'JEFE_MANTENIMIENTO', 'TECNICO'];
  items = signal<Usuario[]>([]);
  mostrarForm = signal(false);
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    nombre: ['', Validators.required],
    rol: ['TECNICO' as Rol, Validators.required],
    activo: [true],
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
    this.form.reset({ username: '', password: '', nombre: '', rol: 'TECNICO', activo: true });
    this.form.controls.username.enable();
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.controls.password.updateValueAndValidity();
    this.error.set('');
    this.mostrarForm.set(true);
  }

  editar(u: Usuario): void {
    this.editandoId.set(u.id);
    this.form.reset({
      username: u.username,
      password: '',
      nombre: u.nombre,
      rol: u.rol,
      activo: u.activo,
    });
    this.form.controls.username.disable();
    this.form.controls.password.setValidators([Validators.minLength(6)]);
    this.form.controls.password.updateValueAndValidity();
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
    const raw = this.form.getRawValue();
    const datos: UsuarioRequest = { ...raw, password: raw.password || null };
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

  eliminar(u: Usuario): void {
    if (!confirm(`¿Eliminar al usuario "${u.username}"?`)) return;
    this.error.set('');
    this.service.eliminar(u.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}