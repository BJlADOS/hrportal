import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { appRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { CookieModule } from 'ngx-cookie';
import { AuthComponent } from './auth/components/auth/auth.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { ErrorsComponent } from './auth/components/errors/errors.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AuthComponent,
    RegistrationComponent,
    ErrorsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    appRouting,
    ReactiveFormsModule,
    CookieModule.withOptions(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
