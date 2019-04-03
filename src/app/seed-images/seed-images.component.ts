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
    template: `
        <div class="seed-jobs">
            <div class="search">
                <p-autoComplete [(ngModel)]="jobQueryResult" (completeMethod)="filterJobs($event)" field="Name"
                                styleClass="search-input" placeholder="Search Jobs" [minLength]="0"></p-autoComplete>
                <div class="loader" *ngIf="loading">
                    <svg version="1.1" id="loader" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px"
                         viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                        <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,
                                             8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,
                                             14.615,6.543,14.615,14.615H43.935z">
                            <animateTransform attributeType="xml"
                                              attributeName="transform"
                                              type="rotate"
                                              from="0 25 25"
                                              to="360 25 25"
                                              dur="0.6s"
                                              repeatCount="indefinite"/>
                        </path>
                    </svg>
                </div>
            </div>
            <div class="results">
                <p-dataView [value]="jobs" layout="grid">
                    <p-header>
                        {{ jobs.length }} job<span *ngIf="jobs.length !== 1">s</span> found
                    </p-header>
                    <ng-template let-job pTemplate="gridItem">
                        <div class="ui-g-12 ui-md-4">
                            <a (click)="showJobDetails(job)">
                                <p-panel>
                                    <p-header>
                                        <div class="result-header" [style]="getHeaderStyle(job.hsl)">
                                            <h3>{{ job.Title }}</h3>
                                        </div>
                                    </p-header>
                                    <div class="result-content">
                                        <div class="job-description">{{ job.Description }}</div>
                                        <strong>Maintainer:</strong> {{ job.Maintainer }}<br />
                                        <span *ngIf="job.MaintOrg">
                                            <strong>Organization:</strong> {{ job.MaintOrg }}
                                        </span>
                                    </div>
                                </p-panel>
                            </a>
                        </div>
                    </ng-template>
                </p-dataView>
                <p-dialog *ngIf="selectedJob" [(visible)]="showDialog" (onHide)="hideJobDetails()" [responsive]="true"
                          [dismissableMask]="true" [modal]="true" width="auto" positionTop="40" class="job-details">
                    <p-header class="dialog-header">
                        <span>{{ selectedJob.Title }}</span>
                        <span>
                            <p-dropdown [options]="jobVersions" optionLabel="JobVersion" [(ngModel)]="selectedJobVersion"
                                        (onChange)="updateImages()" [showClear]="false" [filter]="true">
                            </p-dropdown>
                        </span>
                        <span>
                            <button pButton class="ui-button-secondary" icon="fa fa-cube" pTooltip="Package version..."
                                    (click)="choosePackage()" *ngIf="!showPackageDropdown"></button>
                        </span>
                        <span>
                            <p-dropdown [options]="images" optionLabel="PackageVersion" [(ngModel)]="selectedImage"
                                        (onChange)="updateImageManifest()" [showClear]="false" *ngIf="showPackageDropdown">
                            </p-dropdown>
                        </span>
                    </p-header>
                    <div class="description-header">
                        <h3>Description</h3>
                    </div>
                    <div class="description">
                        {{ selectedJob.Description }}
                    </div>
                    <div class="docker-command-header">
                        <h3>Docker Command</h3>
                        <button class="copy-docker-btn ui-button-secondary" pButton type="button" icon="fa fa-copy"
                                pTooltip="Copy to clipboard" data-clipboard-target="#docker">
                        </button>
                    </div>
                    <div class="docker-command">
                        <pre id="docker"><code>docker pull {{ fullImageName }}</code></pre>
                    </div>
                    <div class="header">
                        <div>Manifest</div>
                        <button class="copy-manifest-btn ui-button-secondary" pButton type="button" icon="fa fa-copy"
                                pTooltip="Copy to clipboard" tooltipPosition="left" data-clipboard-target="#manifest">
                        </button>
                    </div>
                    <div class="code">
                        <pre id="manifest"><code>{{ imageManifestDisplay }}</code></pre>
                    </div>
                    <p-footer *ngIf="environment.scale && imageManifest">
                        <button pButton type="button" (click)="onImportClick()" label="Import" [icon]="importBtnIcon"
                                iconPos="right"></button>
                    </p-footer>
                </p-dialog>
            </div>
        </div>
        <p-toast></p-toast>
    `,
    styles: [`
        @keyframes spin {
            to {
                transform: rotate(1440deg);
            }
        }
        .seed-jobs .search {
            position: relative;
            text-align: center;
            width: 50%;
            margin: 0 auto 15px auto;
        }
        ::ng-deep .seed-jobs .search-input {
            width: 100%;
        }
        ::ng-deep .seed-jobs .ui-autocomplete-input {
            width: 100%;
        }
        .seed-jobs .search .loader {
            position: absolute;
            top: 7px;
            right: 20px;
        }
        .seed-jobs .search .loader svg path, .seed-jobs .search .loader svg rect {
            fill: #FF6700;
        }
        ::ng-deep .seed-jobs .search .ui-inputtext {
            font-size: 1.5em;
        }
        ::ng-deep .seed-jobs .search .ui-autocomplete-loader {
            display: none;
        }
        .seed-jobs .results .dialog-header {
            display: inline-flex;
            align-items: center;
        }
        .seed-jobs .results .dialog-header span {
            display: inline-block;
            margin-right: 7px;
        }
        .seed-jobs .results .result-header {
            border-radius: 3px 3px 0 0;
            padding: 0.571em 1em;
            border: 1px solid #c8c8c8;
        }
        .seed-jobs .results .result-header h3 {
            text-align: center;
            margin: 0;
            padding: 0;
        }
        .seed-jobs .results .result-content {
            padding: 10px;
            text-align: center;
            min-height: 90px;
        }
        .seed-jobs .results .result-content .job-description {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .seed-jobs .job-details {
            width: 33%;
        }
        .seed-jobs .job-details h2 {
            font-size: 1.2em;
        }
        .seed-jobs .job-details h3 {
            margin: 0;
            padding: 0;
        }
        .seed-jobs .job-details .description {
            margin-bottom: 15px;
        }
        .seed-jobs .job-details .docker-command-header {
            display: flex;
            align-items: center;
        }
        .seed-jobs .job-details .docker-command-header h3 {
            margin-right: 7px;
        }
        .seed-jobs .job-details .docker-command-header button {
            padding: 0;
            font-size: 0.8em;
        }
        .seed-jobs .job-details .docker-command pre {
            margin: 0;
            padding: 0;
        }
        .seed-jobs .job-details .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 12px 0 0 0;
            padding: 6px;
            background: #777;
            color: #fff;
        }
        .seed-jobs .job-details .header button {
            padding: 0;
            font-size: 0.8em;
        }
        .seed-jobs .job-details .code {
            position: relative;
            margin-top: -14px;
        }
        .seed-jobs .job-details .code pre {
            width: 100%;
            max-height: 300px;
            overflow-x: hidden;
            background: #efefef;
            border: 1px solid #bbb;
            font-size: 0.9em;
        }
        ::ng-deep .seed-jobs .results .ui-panel .ui-panel-content {
            padding: 0;
        }
        ::ng-deep .seed-jobs .results .ui-panel-content:hover {
            background: #48ACFF;
            transition: background-color 0.5s;
        }
        ::ng-deep .seed-jobs .results .ui-dialog {
            width: 50%;
        }
        ::ng-deep .seed-jobs .results .ui-dropdown {
            font-size: 0.7em;
            width: 150px;
        }
        ::ng-deep .seed-jobs .results .ui-button-secondary:focus {
            background: #f4f4f4 !important;
        }
        ::ng-deep .seed-jobs .results .ui-dataview-header {
            border: none !important;
            background: none !important;
            font-weight: bold;
            font-size: 1.2em;
        }
        ::ng-deep .seed-jobs .results .ui-dataview-content {
            border: none !important;
            background: none !important;
        }

        ::ng-deep .seed-jobs .results .ui-panel-titlebar {
            border: none !important;
            background: none !important;
            padding: 0 !important;
        }
    `]
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
        return this.http.get(`${this.environment.siloUrl}/jobs/search/${query}`)
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

    onImportClick(): void {
        // emit with selected job and manifest json
        this.imageImport.emit({ job: this.selectedJob, manifest: this.imageManifest });
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
