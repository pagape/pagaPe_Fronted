import { Routes } from '@angular/router';
import {LoginComponent} from "./components/auth/login/login.component";
import {RecoverPasswordComponent} from "./components/auth/recover-password/recover-password.component";

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent},
  {
    path: 'main',
    loadChildren: () =>
      import('./pages/pages.routes').then((r) => r.PAGES_ROUTES),
  },

];
