import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeedImagesComponent } from './seed-images.component';

import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { GrowlModule } from 'primeng/growl';
import { PanelModule } from 'primeng/panel';
import {
    AutoCompleteModule,
    DropdownModule,
    TooltipModule
} from 'primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        // prime-ng
        AutoCompleteModule,
        ButtonModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        GrowlModule,
        PanelModule,
        TooltipModule
    ],
    declarations: [SeedImagesComponent],
    exports: [SeedImagesComponent]
})
export class SeedImagesModule {
}
