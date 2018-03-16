import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from 'primeng/components/common/api';
import * as beautify from 'js-beautify';
import * as Clipboard from 'clipboard';

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
                <h3>{{ jobs.length }} job<span *ngIf="jobs.length !== 1">s</span> found</h3>
                <p-dataGrid [value]="jobs">
                    <ng-template let-job pTemplate="item">
                        <div class="ui-g-12 ui-md-4">
                            <a (click)="showJobDetails(job)">
                                <p-panel [header]="job.Title">
                                    {{ job.Description }}<br />
                                    <strong>Maintainer:</strong> {{ job.Maintainer }}<br />
                                    <span *ngIf="job.MaintOrg">
                                        <strong>Organization:</strong> {{ job.MaintOrg }}
                                    </span>
                                </p-panel>
                            </a>
                        </div>
                    </ng-template>
                </p-dataGrid>
                <p-dialog *ngIf="selectedJob" [(visible)]="showDialog" (onHide)="hideJobDetails()" [responsive]="true"
                          [dismissableMask]="true" [modal]="true" width="auto" positionTop="40" class="job-details">
                    <p-header>
                        {{ selectedJob.Title }}
                        <p-dropdown [options]="jobVersions" optionLabel="JobVersion" [(ngModel)]="selectedJobVersion"
                                    (onChange)="updateImages()" [showClear]="false" [filter]="true" [autoWidth]="false">
                        </p-dropdown>
                        <button pButton class="ui-button-secondary" icon="fa-cube" pTooltip="Package version..."
                                (click)="choosePackage()" *ngIf="!showPackageDropdown"></button>
                        <p-dropdown [options]="images" optionLabel="PackageVersion" [(ngModel)]="selectedImage"
                                    (onChange)="updateImageManifest()" [showClear]="false" *ngIf="showPackageDropdown">
                        </p-dropdown>
                    </p-header>
                    {{ selectedJob.Description }}
                    <div class="header">
                        Manifest
                        <button class="copy-btn ui-button-secondary" pButton type="button" icon="fa-copy"
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
        <p-growl [(value)]="msgs"></p-growl>
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
            font-size: 1.5em !important;
        }
        ::ng-deep .seed-jobs .search .ui-autocomplete-loader {
            display: none;
        }
        .seed-jobs .results h3 {
            text-align: center;
            margin: 18px 0;
        }
        .seed-jobs .job-details {
            width: 33%;
        }
        .seed-jobs .job-details h2 {
            font-size: 1.2em;
        }
        .seed-jobs .job-details .header {
            position: relative;
            margin: 12px 0 0 0;
            padding: 6px;
            background: #777;
            color: #fff;
        }
        .seed-jobs .job-details .header button {
            position: absolute;
            top: 5px;
            right: 4px;
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
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            min-height: 110px;
        }
        ::ng-deep .seed-jobs .results .ui-panel:hover {
            background: #48ACFF;
            transition: background-color 0.5s;
        }
        ::ng-deep .seed-jobs .results .ui-dialog {
            width: 50% !important;
        }
        ::ng-deep .seed-jobs .results .ui-dropdown {
            font-size: 0.7em !important;
            width: 150px;
        }
        ::ng-deep .seed-jobs .results .ui-button {
            font-size: 0.7em !important;
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
    imageManifest: any;
    imageManifestDisplay: any;
    loading: boolean;
    showDialog = false;
    importBtnIcon = 'fa-cloud-download';
    clipboard = new Clipboard('.copy-btn');
    msgs: Message[] = [];
    showPackageDropdown = false;

    constructor(
        private http: HttpClient
    ) {}

    private handleError(err: any, summary?: string): void {
        let detail = '';
        if (err.status === 0) {
            detail = 'CORS error: Unable to access server';
        } else {
            detail = err.statusText.length > 0 ? err.statusText : 'Server error';
        }
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: summary || 'Error', detail: detail});
        this.importBtnIcon = 'fa-cloud-download';
        this.loading = false;
    }

    getJobs(): Promise<any> {
        this.loading = true;
        return this.http.get(`${this.environment.siloUrl}/jobs`)
            .toPromise()
            .then(response => {
                this.loading = false;
                return Promise.resolve(response);
            })
            .catch(err => {
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
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    getImageManifest(id): Promise<any> {
        this.importBtnIcon = 'fa-spinner fa-spin';
        return this.http.get(`${this.environment.siloUrl}/images/${id}/manifest`)
            .toPromise()
            .then(response => {
                this.importBtnIcon = 'fa-cloud-download';
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    filterJobs(event): void {
        if (event.query) {
            this.searchJobs(event.query).then(data => {
                this.jobs = data;
            }).catch(err => {
                this.handleError(err, 'Job Search Failed');
            });
        } else {
            this.getJobs().then(data => {
                this.jobs = data;
            }).catch(err => {
                this.handleError(err, 'Job Retrieval Failed');
            });
        }
    }

    updateImageManifest(): void {
        this.getImageManifest(this.selectedImage.ID).then(data => {
            this.imageManifest = data;
            this.imageManifestDisplay = beautify(JSON.stringify(data));
        }).catch(err => {
            this.handleError(err, 'Manifest Retrieval Failed');
        });
    }

    updateImages(): void {
        this.images = this.selectedJobVersion.Images.sort((a, b) => {
            return a.PackageVersion - b.PackageVersion;
        }).reverse();
        this.selectedImage = this.images[0];
        this.updateImageManifest();
    }

    showJobDetails(job): void {
        this.selectedJob = job;
        this.showDialog = true;
        this.jobVersions = job.JobVersions.sort((a, b) => {
            return a.JobVersion - b.JobVersion;
        }).reverse();
        this.selectedJobVersion = this.jobVersions[0];
        this.updateImages();
    }

    hideJobDetails(): void {
        this.selectedJob = null;
        this.showPackageDropdown = false;
    }

    onImportClick(): void {
        // emit with manifest json
        this.imageImport.emit(this.imageManifest);
        this.hideJobDetails();
    }

    choosePackage(): void {
        this.showPackageDropdown = true;
    }

    ngOnInit() {
        this.getJobs().then(data => {
            this.jobs = data;
        }).catch(err => {
            this.handleError(err, 'Job Retrieval Failed');
        });
        this.clipboard.on('success', () => {
            this.msgs = [{severity: 'success', summary: 'Success!', detail: 'Manifest JSON copied to clipboard.'}];
        });
    }
}
