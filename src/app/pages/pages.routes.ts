import { Routes } from '@angular/router';

import { PagesComponent } from './pages.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./home/home.component').then(c => c.HomeComponent),
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.routes').then(c => c.REPORT_ROUTES),
      },
      {
        path: 'operation',
        loadChildren: () =>
          import('./operation/operation.routes').then(c => c.OPERATION_ROUTES),
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./user-management/user-management.component').then(c => c.UserManagementComponent),
      },

    ],
  },
];
