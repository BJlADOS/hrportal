import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

setTimeout(()=> {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err))
        .then(() => {
            document.getElementById('app-loader')?.remove();
        });
});
