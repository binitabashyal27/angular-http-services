import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {

  providers: [
provideAnimations(),

  provideToastr(),
    // Angular Router
    provideRouter(routes),

    // HttpClient + Auth Interceptor
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    )

  ]

};