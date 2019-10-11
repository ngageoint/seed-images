import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/components/common/messageservice';
import * as beautify from 'js-beautify';
import * as Clipboard from 'clipboard';
import * as _ from 'lodash';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'seed-images',
    templateUrl: './seed-images.component.html',
    styleUrls: ['./seed-images.component.css']
})
export class SeedImagesComponent implements OnInit {
    @Input() environment: any;
    @Output() imageImport = new EventEmitter<any>();
    jobs: any[] = [];
    selectedJob: any;
    jobQueryResult: any;
    jobVersions: any[] = [];
    selectedJobVersion: any;
    images: any[] = [];
    selectedImage: any;
    fullImageName: any;
    imageManifest: any;
    imageManifestDisplay: any;
    loading: boolean;
    showDialog = false;
    importBtnIcon = 'fa fa-cloud-download';
    clipboardManifest = new Clipboard('.copy-manifest-btn');
    clipboardDocker = new Clipboard('.copy-docker-btn');
    showPackageDropdown = false;
    showDockerURL: boolean;
    URL: any;
    showDialogForURL: boolean;

    constructor(
        private http: HttpClient,
        private domSanitizer: DomSanitizer,
        private messageService: MessageService
    ) {}

    private handleError(err: any, summary?: string): void {
        let detail = '';
        if (err.status === 0) {
            detail = 'CORS error: Unable to access server';
        } else {
            detail = err.statusText && err.statusText.length > 0 ? err.statusText : 'Server error';
        }
        this.messageService.add({severity: 'error', summary: summary || 'Error', detail: detail});
        this.importBtnIcon = 'fa fa-cloud-download';
        this.loading = false;
    }

    private formatData(data) {
        data.forEach(d => {
            d.hsl = this.colorByHashCode(d.Title);
        });
        this.jobs = data;
    }

    private getHashCode(str) {
        let hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    private intToHSL(int) {
        let shortened = int % 360;
        shortened = Math.ceil(shortened / 20) * 20;
        shortened = shortened < 0 ? shortened + 360 : shortened;
        return `hsl(${shortened}, 100%, 80%)`;
    }

    private colorByHashCode(value) {
        return this.intToHSL(this.getHashCode(value));
    }

    getHeaderStyle(value): any {
        return this.domSanitizer.bypassSecurityTrustStyle(`background-color: ${value}`);
    }

    getJobs(): Promise<any> {
        this.loading = true;
        return this.http.get(`${this.environment.siloUrl}/jobs`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return Promise.resolve(response);
            }, err => {
                return Promise.reject(err);
            });
    }

    getJob(id: number): Promise<any> {
        this.loading = true;
        return this.http.get(`${this.environment.siloUrl}/jobs/${id}`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return Promise.resolve(response);
            }, err => {
                return Promise.reject(err);
            });
    }

    searchJobs(query): Promise<any> {
        this.loading = true;
        return this.http.get(`${this.environment.siloUrl}/jobs/search/${this.URL}`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return Promise.resolve(response);
            }, err => {
                return Promise.reject(err);
            });
    }

    getFullImageName(id): Promise<any> {
        this.importBtnIcon = 'fa fa-spinner fa-spin';
        return this.http.get(`${this.environment.siloUrl}/images/${id}`)
            .toPromise()
            .then(response => {
                this.importBtnIcon = 'fa fa-cloud-download';
                return Promise.resolve(response);
            }, err => {
                return Promise.reject(err);
            });
    }

    getImageManifest(id): Promise<any> {
        this.importBtnIcon = 'fa fa-spinner fa-spin';
        return this.http.get(`${this.environment.siloUrl}/images/${id}/manifest`)
            .toPromise()
            .then(response => {
                this.importBtnIcon = 'fa fa-cloud-download';
                return Promise.resolve(response);
            }, err => {
                return Promise.reject(err);
            });
    }

    filterJobs(event): void {
        if (event.query) {
            this.searchJobs(event.query).then(data => {
                // data comes back as an object of objects instead of an array
                // so convert it to an array
                this.formatData(Object.values(data));
            }, err => {
                this.handleError(err, 'Job Search Failed');
            });
        } else {
            this.getJobs().then(data => {
                this.formatData(data);
            }, err => {
                this.handleError(err, 'Job Retrieval Failed');
            });
        }
    }

    findDockerURL(url): Promise<any>  {
        return this.http.get(`${this.environment.siloUrl}/images/manifest/${url}`)
            .toPromise()
            .then(response => {
                this.importBtnIcon = 'fa fa-cloud-download';
                this.showJobDetails(response);
                return Promise.resolve(response);
            }, err => {
                return Promise.reject(err);
            });

    }

    showFoundJob(url) {
        this.findDockerURL(url).then(manifest => {
            this.selectedJob = {
                Description: manifest.job.description,
                Email: manifest.job.maintainer.email,
                Maintainer: manifest.job.maintainer.name,
                MaintOrg: manifest.job.maintainer.organization,
                LatestJobVersion: manifest.job.jobVersion,
                LatestPackageVersion: manifest.job.packageVersion,
                Name: manifest.job.name,
                Title: manifest.job.title,
            };
            this.imageManifest = manifest;
            this.showDialogForURL = true;
        }, err => {
            this.handleError(err, 'Job Retrieval Failed');
        });

    }

    updateFullImageName(): void {
        this.getFullImageName(this.selectedImage.ID).then(data => {
            this.fullImageName = data.Org ? `${data.Registry}/${data.Org}/${data.FullName}` : `${data.Registry}/${data.FullName}`;
        }, err => {
            this.handleError(err, 'Full Name Retrieval Failed');
        });
    }

    updateImageManifest(): void {
        this.getImageManifest(this.selectedImage.ID).then(data => {
            this.imageManifest = data;
            this.imageManifestDisplay = beautify(JSON.stringify(data));
        }, err => {
            this.handleError(err, 'Manifest Retrieval Failed');
        });
    }

    updateImages(): void {
        this.images = _.orderBy(this.selectedJobVersion.Images, ['PackageVersion'], ['desc']);
        this.selectedImage = this.images[0];
        this.updateImageManifest();
        this.updateFullImageName();
    }

    showJobDetails(job): void {
        console.log(job);
        this.getJob(job.ID).then(data => {
            this.selectedJob = data;
            this.showDialog = true;
            this.jobVersions = _.orderBy(data.JobVersions, ['JobVersion'], ['desc']);
            this.selectedJobVersion = this.jobVersions[0];
            this.updateImages();
        }, err => {
            this.handleError(err, 'Job Retrieval Failed');
        });
    }

    hideJobDetails(): void {
        this.selectedJob = null;
        this.showPackageDropdown = false;
    }

    hideDockerDetails(): void {
        this.selectedJob = null;
        this.showPackageDropdown = false;
    }

    showDockerURLDetails(): void {
        this.showDockerURL = true;
    }

    showURLDetails(mainfest): void {
        this.showDialogForURL = true;

        this.selectedJobVersion = this.jobVersions[0];
        this.updateImages();
    }

    onImportClick(): void {
        // emit with selected job and manifest json
        this.imageImport.emit({
            job: this.selectedJob,
            manifest: this.imageManifest,
            selectedJobVersion: this.selectedJobVersion.JobVersion,
            selectedPackageVersion: this.selectedImage.PackageVersion
        });
        this.hideJobDetails();
    }

    choosePackage(): void {
        this.showPackageDropdown = true;
    }

    ngOnInit() {
        this.getJobs().then(data => {
            this.formatData(data);
        }, err => {
            this.handleError(err, 'Job Retrieval Failed');
        });
        this.clipboardManifest.on('success', () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Manifest JSON copied to clipboard.'});
        });
        this.clipboardDocker.on('success', () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Docker pull command copied to clipboard.'});
        });
    }
}
