import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { appRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgxMaskModule } from 'ngx-mask';
import { CookieModule } from 'ngx-cookie';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { SharedModule } from './lib/shared/shared.module';
import { DestroyService } from './lib';

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent,
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
        NgxMaskModule.forRoot(),
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
