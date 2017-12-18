export default {
	input: 'dist/index.js',
    output: {
	    file: 'dist/bundles/seed-images.umd.js',
        format: 'umd'
    },
	sourceMap: false,
    external: ['@angular/core', '@angular/common', '@angular/forms', '@angular/http'],
	name: 'ng.seed-images',
    plugins: [
        // rollup needs import moment from 'moment'
        // https://github.com/rollup/rollup-plugin-typescript/issues/68
        // https://github.com/moment/moment/issues/3748
        {
            name: 'replace clipboard imports',
            transform: code =>
                ({
                    code: code.replace(/import\s*\*\s*as\s*Clipboard/g, 'import Clipboard'),
                    map: { mappings: '' }
                })
        },
        {
            name: 'replace js-beautify imports',
            transform: code =>
                ({
                    code: code.replace(/import\s*\*\s*as\s*beautify/g, 'import beautify'),
                    map: { mappings: '' }
                })
        }
    ],
	globals: {
	    '@angular/core': 'ng.core',
		'@angular/common': 'ng.common',
		'@angular/forms': 'ng.forms',
		'@angular/http': 'ng.http',
        '@angular/platform-browser': 'ng.platform-browser',
		'rxjs/Observable': 'Rx',
		'rxjs/ReplaySubject': 'Rx',
		'rxjs/add/operator/map': 'Rx.Observable.prototype',
		'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
		'rxjs/add/observable/fromEvent': 'Rx.Observable',
		'rxjs/add/observable/of': 'Rx.Observable',
        'clipboard': 'clipboard',
        'js-beautify': 'js-beautify',
        'primeng': 'primeng'
	}
}
