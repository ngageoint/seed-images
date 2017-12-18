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
* `apiUrl` argument, (required) pointing to a valid [SILO](https://github.com/ngageoint/seed-silo) instance
* `importUrl` argument, (optional) pointing to the algorithm import location a [Scale](https://github.com/ngageoint/scale) instance
* `router` argument, reference to an Angular 5 router object

## Examples
```
<seed-images apiUrl="http://siloApi.com" importUrl="/configuration/job-types/edit/0" [router]="router"></seed-images>
```
```
<seed-images apiUrl="http://siloApi.com"></seed-images>
```
