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
* `environment` (required): reference to an Angular environment object. This allows the component to know whether it's installed within a Scale UI project.
* `apiUrl` (required): URL of a valid [SILO](https://github.com/ngageoint/seed-silo) instance.
* `importUrl` (optional): URL of the algorithm import location of a [Scale](https://github.com/ngageoint/scale) instance.
* `router` (optional): reference to an Angular 5 router object.

## Examples
```
<seed-images apiUrl="http://siloApi.com" importUrl="/configuration/job-types/edit/0" [router]="router"></seed-images>
<seed-images apiUrl="http://siloApi.com"></seed-images>
```
