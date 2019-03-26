import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {SuiModule} from 'ng2-semantic-ui';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {CurriculumService} from './curriculum.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {LoginComponent} from './login/login.component';
import {MaterialModuleModule} from './core/material-module/material-module.module';
import {AppRoutingModule} from './core/app-routing/app-routing.module';
import {LoginService} from './login/login.service';
import {UserAuthenticationGuard} from './user-authentication.guard';
import {StudentPortalComponent} from './main-client/student-portal/student-portal.component';
import {StudentStatusComponent} from './main-client/student-portal/student-status/student-status.component';
import {StudentAdvisingComponent} from './main-client/student-portal/student-advising/student-advising.component';
import {StudentLoginGuard} from './login/student-login.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SubjectPathsComponent} from './main-client/student-portal/main-components/subject-paths/subject-paths.component';
import {SPPopoverComponent} from './main-client/student-portal/main-components/subject-paths-popover/app-s-p-popover.component';
import {AdvisingFormComponent} from './main-client/student-portal/main-components/advising-form/advising-form.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AdminPortalComponent} from './main-client/admin-portal/admin-portal.component';
import {AdminLoginComponent} from './admin-login/admin-login.component';
import {ResSideNavComponent} from './main-client/admin-portal/res-side-nav/res-side-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {StatisticsComponent} from './main-client/admin-portal/admin-comp/statistics/statistics.component';
import {OpenedSubjComponent} from './main-client/admin-portal/admin-comp/opened-subj/opened-subj.component';
import {MobileLabelComponent} from './helper-comps/mobile-label/mobile-label.component';
import {AdminCurComponent} from './main-client/admin-portal/admin-comp/admin-cur/admin-cur.component';
import {FacultyAccComponent} from './main-client/admin-portal/admin-comp/faculty-acc/faculty-acc.component';
import {MakeAdminComponent} from './main-client/admin-portal/admin-comp/admin-parts/make-admin/make-admin.component';
import {DeptListingService} from './main-client/admin-portal/a-services/dept-listing.service';
import {NewFAccService} from './main-client/admin-portal/a-services/new-f-acc.service';
import {ALoginService} from './main-client/admin-portal/a-services/a-login.service';
import {CurrCardComponent} from './main-client/admin-portal/admin-comp/admin-parts/curr-card/curr-card.component';
import {CurrListingService} from './main-client/admin-portal/a-services/curr-listing.service';
import {AddCurrCardComponent} from './main-client/admin-portal/admin-comp/admin-parts/add-curr-card/add-curr-card.component';
import {NewCurrService} from './main-client/admin-portal/a-services/new-curr.service';
import {DelCurrService} from './main-client/admin-portal/a-services/del-curr.service';
import {StudDataComponent} from './main-client/admin-portal/admin-comp/stud-data/stud-data.component';
import {SDataUpService, SGradeUpService} from './main-client/admin-portal/a-services/s-data-up.service';
import {StudUploaderComponent} from './main-client/admin-portal/admin-comp/admin-parts/stud-uploader/stud-uploader.component';
import {IncomingSemService} from './main-client/student-portal/s-services/incoming-sem.service';
import {SLoginService} from './main-client/student-portal/s-services/s-login.service';
import {SStore} from './main-client/student-portal/s-services/s-store';
import {AdvisingFormService} from './main-client/student-portal/s-services/advising-form.service';
import {AdvisingStatsService} from './main-client/admin-portal/a-services/advising-stats.service';
import {AdminStore} from './main-client/admin-portal/data-store/admin-store';
import {CanCreateAccountGuard} from './main-client/admin-portal/a-services/can-create-account.guard';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        StudentPortalComponent,
        StudentStatusComponent,
        StudentAdvisingComponent,
        SubjectPathsComponent,
        SPPopoverComponent,
        AdvisingFormComponent,
        AdminPortalComponent,
        AdminLoginComponent,
        ResSideNavComponent,
        StatisticsComponent,
        OpenedSubjComponent,
        MobileLabelComponent,
        AdminCurComponent,
        FacultyAccComponent,
        MakeAdminComponent,
        CurrCardComponent,
        AddCurrCardComponent,
        StudDataComponent,
        StudUploaderComponent
    ],
    entryComponents: [
        AdvisingFormComponent
    ],
    imports: [
        NgbModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModuleModule,
        AppRoutingModule,
        SuiModule,
        LayoutModule,
        SuiModule
    ],
    providers: [
        CurriculumService,
        LoginService,
        UserAuthenticationGuard,
        StudentLoginGuard,
        DeptListingService,
        NewFAccService,
        ALoginService,
        CurrListingService,
        NewCurrService,
        DelCurrService,
        SDataUpService,
        SGradeUpService,
        IncomingSemService,
        SLoginService,
        SStore,
        AdvisingFormService,
        AdvisingStatsService,
        AdminStore,
        CanCreateAccountGuard
        // {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
