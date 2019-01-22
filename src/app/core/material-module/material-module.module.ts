import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatGridListModule,
    MatSidenavModule,
    MatListModule, MatSortModule, MatRippleModule, MatPaginatorModule
} from '@angular/material';
import {LayoutModule} from '@angular/cdk/layout';

@NgModule({
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        LayoutModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatSortModule,
        MatRippleModule,
        MatPaginatorModule
    ],
    exports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonToggleModule,
        MatTabsModule,
        MatExpansionModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        MatBadgeModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        LayoutModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatSortModule,
        MatRippleModule,
        MatPaginatorModule
    ],
})
export class MaterialModuleModule {
}
