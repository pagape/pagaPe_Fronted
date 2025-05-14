import { Routes } from '@angular/router';

export const REPORT_ROUTES: Routes = [
  {
    path:'',
    loadComponent: () =>
      import('./report.component').then((c) => c.ReportComponent),
    children: [
      {
        path: '',
        redirectTo: 'survey',
        pathMatch: 'full',
      },
      {
        path: 'survey',
        loadComponent: () =>
          import('./survey/survey.component').then(
            (c) => c.SurveyComponent
          ),
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
