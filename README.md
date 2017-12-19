# Seed Images
An Angular component for [Seed](https://ngageoint.github.io/seed/) image discovery

## Install
`npm install --save seed-images`

## Dependencies
* Angular 5
* [PrimeNG](https://www.primefaces.org/primeng/)
* [Font Awesome](http://fontawesome.io)
* [ClipboardJS](https://clipboardjs.com/)
* [JS-Beautify](https://github.com/beautify-web/js-beautify)

## How to use
* Import into app module: `import { SeedImagesModule } from 'seed-images';`
* `environment` (required): reference to an Angular environment object (more information below).
* `apiUrl` (required): URL of a valid [SILO](https://github.com/ngageoint/seed-silo) instance.
* `importUrl` (optional): URL of the algorithm import location of a [Scale](https://github.com/ngageoint/scale) instance.
* `router` (optional): reference to an Angular 5 router object.

## Environment
In order for the component to properly display either the seed manifest JSON or a Scale import button, a `scale` property *must* be set in the project's environment object. The value should be `true` if the project also contains Scale algorithm import functionality. Otherwise the value should be `false`.
### environments/environment.ts
```
export const environment = {
  production: false,
  scale: false
};
```
### environments/environment.prod.ts
```
export const environment = {
  production: true,
  scale: false
};
```
### app.component.ts
```
import { Component } from '@angular/core';
import { environment } from '../environments/environment';
...
export class AppComponent {
  env = environment;
  constructor() {}
  ...
}
```
### app.component.html
```
<seed-images [environment]="env" apiUrl="http://siloApi.com"></seed-images>
```
or
```
<seed-images [environment]="env" apiUrl="http://siloApi.com" importUrl="/configuration/job-types/edit/0" [router]="router"></seed-images>
```
