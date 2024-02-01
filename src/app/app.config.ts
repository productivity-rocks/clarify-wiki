import { ApplicationConfig, SecurityContext } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { importProvidersFrom } from '@angular/core';
import { MarkdownModule, provideMarkdown,MARKED_OPTIONS, ClipboardButtonComponent,CLIPBOARD_OPTIONS } from 'ngx-markdown';
import { withFetch } from '@angular/common/http';
// import { markedOptionsFactory } from '@app/marked-options-factory';

export const appConfig: ApplicationConfig = {
  // providers: [provideHttpClient(), provideRouter(routes)]
  providers: [provideHttpClient(withFetch()), provideClientHydration(), provideRouter(routes), provideMarkdown(),]
};
