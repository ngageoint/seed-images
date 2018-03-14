export default {
	input: 'dist/index.js',
    output: {
	    file: 'dist/bundles/seed-images.umd.js',
        format: 'umd'
    },
	sourceMap: false,
    external: ['@angular/core', '@angular/common', '@angular/forms', '@angular/common/http', 'js-beautify', 'clipboard', 'rxjs/add/operator/toPromise', 'primeng/primeng'],
	name: 'ng.seed-images',
    plugins: [
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
		'@angular/common/http': 'ng.httpClient',
        '@angular/platform-browser': 'ng.platform-browser',
		'rxjs/Observable': 'Rx',
		'rxjs/ReplaySubject': 'Rx',
		'rxjs/add/operator/map': 'Rx.Observable.prototype',
		'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
		'rxjs/add/observable/fromEvent': 'Rx.Observable',
		'rxjs/add/observable/of': 'Rx.Observable',
        'clipboard': 'clipboard',
        'js-beautify': 'js-beautify',
		'primeng/primeng': 'primeng',
        'primeng': 'primeng'
	}
}
