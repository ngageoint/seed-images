export default `
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
                <button pButton class="import-url" type="button" (click)="showDockerURLDetails()"
                    label="Add Image from URL" [icon]="importBtnIcon"
                iconPos="right"></button>
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
        <p-dialog [(visible)]="showDockerURL" (onHide)="hideDockerDetails()" [responsive]="true"
                  [dismissableMask]="true" [modal]="true" width="auto" positionTop="40" class="job-details">
            <p-header class="dialog-header">
                <span>Import New Job Type from Docker URL</span>
            </p-header>
            <div class="description-header">
                <h3>Insert Docker URL</h3>
                <h4>Example: hub.docker.com/orgName/imageName-jobVerison:packageVersion</h4>
            </div>
            <div>
                <input class="input-url" pInputText type="text" [(ngModel)]="URL">
                <button class="copy-manifest-btn ui-button-secondary" pButton type="button" [icon]="searchBtnIcon"
                        (click)='showFoundJob(URL)'>
                </button>
            </div>
        </p-dialog>
        <p-dialog *ngIf="selectedJob" [(visible)]="showDialogForURL" (onHide)="hideJobDetails()" [responsive]="true"
        [dismissableMask]="true" [modal]="true" width="auto" positionTop="40" class="job-details">
            <p-header class="dialog-header">
                <span>{{ selectedJob.Title }} - {{ selectedJobVersion }}:{{ selectedImage }}</span>
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
`;
