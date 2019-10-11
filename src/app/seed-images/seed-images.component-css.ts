export default `
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
.seed-jobs .import-url {
    position: relative;
    text-align: right;
    float: right;
}
.seed-jobs .input-url {
    text-align: left;
    width: 50%;
    margin-right: 10px;
    font-size: 1.5em;
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
`;