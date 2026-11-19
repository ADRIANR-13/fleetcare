import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Rol } from '../core/models/models';
import { AuthService } from '../core/services/auth.service';

interface ItemMenu {
  etiqueta: string;
  ruta: string;
  icono: string;
  roles: Rol[];
}

const TODOS: Rol[] = ['ADMIN', 'JEFE_MANTENIMIENTO', 'TECNICO'];
const GESTION: Rol[] = ['ADMIN', 'JEFE_MANTENIMIENTO'];

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  auth = inject(AuthService);
  menuAbierto = signal(false);

  private items: ItemMenu[] = [
    { etiqueta: 'Dashboard', ruta: '/dashboard', icono: '📊', roles: GESTION },
    { etiqueta: 'Vehículos', ruta: '/vehiculos', icono: '🚚', roles: TODOS },
    { etiqueta: 'Tipos de mantenimiento', ruta: '/tipos-mantenimiento', icono: '🛠️', roles: TODOS },
    { etiqueta: 'Mantenimientos', ruta: '/mantenimientos', icono: '🔧', roles: TODOS },
    { etiqueta: 'Kilometraje', ruta: '/kilometraje', icono: '🧭', roles: TODOS },
    { etiqueta: 'Repuestos', ruta: '/repuestos', icono: '⚙️', roles: TODOS },
    { etiqueta: 'Fallas', ruta: '/fallas', icono: '⚠️', roles: TODOS },
    { etiqueta: 'Reportes', ruta: '/reportes', icono: '📈', roles: GESTION },
    { etiqueta: 'Usuarios', ruta: '/usuarios', icono: '👥', roles: ['ADMIN'] },
  ];

  menu = computed(() => {
    const rol = this.auth.rol();
    return this.items.filter((i) => rol !== null && i.roles.includes(rol));
  });

  alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}