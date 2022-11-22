import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { appRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './services/jwt-interceptor/jwt-interceptor.service';
import { CookieModule } from 'ngx-cookie';
import { AuthComponent } from './auth/components/auth/auth.component';
import { RegistrationComponent } from './auth/components/registration/registration.component';
import { ErrorsComponent } from './auth/components/errors/errors.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { AuthGuard } from './Guards/auth-guard/auth.guard';
import { DestroyService } from './services/destoy/destroy.service';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';

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
    BrowserAnimationsModule,
    HttpClientModule,
    appRouting,
    ReactiveFormsModule,
    CookieModule.withOptions(),
    RouterModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    },
    DestroyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
