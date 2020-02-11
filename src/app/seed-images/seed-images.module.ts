import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeedImagesComponent } from './seed-images.component';

import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/components/common/messageservice';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

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
        ToastModule,
        PanelModule,
        TooltipModule,
        InputTextModule,
        PaginatorModule
    ],
    declarations: [SeedImagesComponent],
    exports: [SeedImagesComponent],
    providers: [MessageService]
})
export class SeedImagesModule {
}
