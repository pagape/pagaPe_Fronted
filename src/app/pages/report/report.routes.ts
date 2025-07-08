import { Routes } from '@angular/router';

export const REPORT_ROUTES: Routes = [
  {
    path:'',
    loadComponent: () =>
      import('./report.component').then((c) => c.ReportComponent),
    children: [
      {
        path: '',
        redirectTo: 'user-evaluation',
        pathMatch: 'full',
      },

      {
        path: 'user-evaluation',
        loadComponent: () =>
          import('./user-evaluation/user-evaluation.component').then(
            (c) => c.UserEvaluationComponent
          ),
      },


    ]

  }
]
