import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { Login } from './features/auth/login/login';
import { DashboardPage } from './features/dashboard/dashboard';
import { Fallas } from './features/fallas/fallas';
import { Kilometraje } from './features/kilometraje/kilometraje';
import { Mantenimientos } from './features/mantenimientos/mantenimientos';
import { Reportes } from './features/reportes/reportes';
import { Repuestos } from './features/repuestos/repuestos';
import { Tipos } from './features/tipos/tipos';
import { Usuarios } from './features/usuarios/usuarios';
import { VehiculoDetail } from './features/vehiculos/vehiculo-detail';
import { VehiculoForm } from './features/vehiculos/vehiculo-form';
import { VehiculoList } from './features/vehiculos/vehiculo-list';
import { Layout } from './layout/layout';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardPage, canActivate: [roleGuard('ADMIN', 'JEFE_MANTENIMIENTO')] },

      { path: 'vehiculos', component: VehiculoList },
      { path: 'vehiculos/nuevo', component: VehiculoForm },
      { path: 'vehiculos/:id/editar', component: VehiculoForm },
      { path: 'vehiculos/:id', component: VehiculoDetail },

      { path: 'tipos-mantenimiento', component: Tipos },
      { path: 'mantenimientos', component: Mantenimientos },
      { path: 'kilometraje', component: Kilometraje },
      { path: 'repuestos', component: Repuestos },
      { path: 'fallas', component: Fallas },

      { path: 'reportes', component: Reportes, canActivate: [roleGuard('ADMIN', 'JEFE_MANTENIMIENTO')] },
      { path: 'usuarios', component: Usuarios, canActivate: [roleGuard('ADMIN')] },

      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '' },
];