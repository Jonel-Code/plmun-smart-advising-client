import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {SuiModule} from 'ng2-semantic-ui';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './home/home.component';
import {CurriculumService} from './curriculum.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// import {
//   MatButtonModule,
//   MatGridListModule,
//   MatCardModule,
//   MatMenuModule,
//   MatIconModule,
//   MatToolbarModule,
//   MatSidenavModule,
//   MatListModule
// } from '@angular/material';
// import {LayoutModule} from '@angular/cdk/layout';
// import {UserComponent} from './core/user/user.component';
// import {MainMenuComponent} from './main-menu/main-menu.component';
// import {SubjectsComponent} from './administrator/subjects/subjects.component';
// import {StudentsComponent} from './administrator/students/students.component';
// import {PetitionComponent} from './administrator/petition/petition.component';
// import {StudentInfoComponent} from './student-info/student-info.component';
// import {AdministratorComponent} from './administrator/administrator.component';
// import {ViewSubjectsComponent} from './administrator/subjects/view-subjects/view-subjects.component';
// import {AddSubjectsComponent} from './administrator/subjects/add-subjects/add-subjects.component';
// import {AdminVerificationGuard} from './administrator/admin-verification.guard';
// import {SubjectService} from './administrator/subjects/subject.service';
// import {AddRequirementsModalComponent} from './administrator/subjects/add-requirements-modal/add-requirements-modal.component';
// import {AddStudentComponent} from './administrator/students/add-student/add-student.component';
// import {StudentService} from './administrator/students/student.service';
// import { ModifyStudentSubjectsComponent } from './administrator/students/modify-student-subjects/modify-student-subjects.component';
// import { ModifySubjectModalComponent } from './administrator/students/modify-subject-modal/modify-subject-modal.component';

import {LoginComponent} from './login/login.component';
import {MaterialModuleModule} from './core/material-module/material-module.module';
import {AppRoutingModule} from './core/app-routing/app-routing.module';
import {LoginService} from './login/login.service';
import {UserAuthenticationGuard} from './user-authentication.guard';
import { StudentPortalComponent } from './main-client/student-portal/student-portal.component';
import { StudentStatusComponent } from './main-client/student-portal/student-status/student-status.component';
import { StudentAdvisingComponent } from './main-client/student-portal/student-advising/student-advising.component';
import {StudentLoginGuard} from './login/student-login.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SubjectPathsComponent } from './main-client/student-portal/main-components/subject-paths/subject-paths.component';
import { SPPopoverComponent } from './main-client/student-portal/main-components/subject-paths-popover/app-s-p-popover.component';
import { AdvisingFormComponent } from './main-client/student-portal/main-components/advising-form/advising-form.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { AdminPortalComponent } from './main-client/admin-portal/admin-portal.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ResSideNavComponent } from './main-client/admin-portal/res-side-nav/res-side-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import { StatisticsComponent } from './main-client/admin-portal/admin-comp/statistics/statistics.component';
import { OpenedSubjComponent } from './main-client/admin-portal/admin-comp/opened-subj/opened-subj.component';
import { MobileLabelComponent } from './helper-comps/mobile-label/mobile-label.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        // UserComponent,
        // MainMenuComponent,
        // StudentInfoComponent,
        // AdministratorComponent,
        // SubjectsComponent,
        // StudentsComponent,
        // PetitionComponent,
        // ViewSubjectsComponent,
        // AddSubjectsComponent,
        // AddRequirementsModalComponent,
        // AddStudentComponent,
        // ModifyStudentSubjectsComponent,
        // ModifySubjectModalComponent,
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
        MobileLabelComponent
    ],
    entryComponents: [
        // AddRequirementsModalComponent,
        // AddSubjectsComponent,
        // ModifySubjectModalComponent,
        AdvisingFormComponent,
    ],
    imports: [
        NgbModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        // MatButtonModule,
        MaterialModuleModule,
        AppRoutingModule,
        SuiModule,
        LayoutModule
    ],
    providers: [
        // SubjectService,
        // AdminVerificationGuard,
        // StudentService,
        CurriculumService,
        LoginService,
        UserAuthenticationGuard,
        StudentLoginGuard
        // {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
