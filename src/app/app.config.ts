import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import {AuthService} from "./services/auth.service";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {providePrimeNG} from "primeng/config";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    providePrimeNG({
      translation: {
        dateFormat: 'dd/mm/yy',
      },
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    importProvidersFrom(ToastModule),
    MessageService,
    AuthService
  ]
};
