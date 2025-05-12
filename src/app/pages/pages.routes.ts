import { Routes } from '@angular/router';

import { PagesComponent } from './pages.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      // {
      //   path: '',
      //   loadComponent: () =>
      //     import('./home/home.component').then(c => c.HomeComponent),
      // },
      // {
      //   path: 'customer',
      //   loadChildren: () =>
      //     import('./customer/customer.routes').then(c => c.CUSTOMER_ROUTES),
      // },
      //
    ],
  },
];
