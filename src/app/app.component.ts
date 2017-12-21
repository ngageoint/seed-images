import { Component } from '@angular/core';

import { environment } from '../environments/environment';

@Component({
    selector: 'seed-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    env = environment;
}
