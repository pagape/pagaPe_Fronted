import { Routes } from '@angular/router';

export const OPERATION_ROUTES: Routes = [
  {
    path:'',
    loadComponent: () =>
      import('./operation.component').then((c) => c.OperationComponent),
    children: [
      {
        path: '',
        redirectTo: 'list-clients',
        pathMatch: 'full',
      },
      {
        path: 'list-clients',
        loadComponent: () =>
          import('./list-clients/list-clients.component').then(
            (c) => c.ListClientsComponent
          ),
      },
      {
        path: 'list-client-services',
        loadComponent: () =>
          import('./list-client-services/list-client-services.component').then(
            (c) => c.ListClientServicesComponent
          ),
      },
      {
        path: 'client-history/:id',
        loadComponent: () =>
          import('./client-history/client-history.component').then(
            (c) => c.ClientHistoryComponent
          ),
      }
    ]
  }
]
