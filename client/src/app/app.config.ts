import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// 1. מוסיפים את הייבוא של withComponentInputBinding מהראוטר
import { provideRouter, withComponentInputBinding } from '@angular/router'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()) 
                          
  ]
};