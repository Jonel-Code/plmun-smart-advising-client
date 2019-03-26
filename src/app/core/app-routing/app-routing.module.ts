import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Components import
import {LoginComponent} from '../../login/login.component';
import {StudentPortalComponent} from '../../main-client/student-portal/student-portal.component';
import {StudentLoginGuard} from '../../login/student-login.guard';
import {AdminLoginComponent} from '../../admin-login/admin-login.component';
import {AdminPortalComponent} from '../../main-client/admin-portal/admin-portal.component';
import {StatisticsComponent} from '../../main-client/admin-portal/admin-comp/statistics/statistics.component';
import {OpenedSubjComponent} from '../../main-client/admin-portal/admin-comp/opened-subj/opened-subj.component';
import {AdminCurComponent} from '../../main-client/admin-portal/admin-comp/admin-cur/admin-cur.component';
import {FacultyAccComponent} from '../../main-client/admin-portal/admin-comp/faculty-acc/faculty-acc.component';
import {AdminAccessGuard} from '../../main-client/admin-portal/a-services/admin-access.guard';
import {StudDataComponent} from '../../main-client/admin-portal/admin-comp/stud-data/stud-data.component';
import {CanCreateAccountGuard} from '../../main-client/admin-portal/a-services/can-create-account.guard';
// import {HomeComponent} from '../../home/home.component';
// import {UserComponent} from '../user/user.component';
// import {HomeComponent} from '../../home/home.component';
// import {UserAuthenticationGuard} from '../../user-authentication.guard';
// import {MainMenuComponent} from '../../main-mainMenu/main-mainMenu.component';
// import {StudentInfoComponent} from '../../student-info/student-info.component';
// // import {AdminDashboardComponent} from '../../admin-dashboard/admin-dashboard.component';
// import {AdministratorComponent} from '../../administrator/administrator.component';
// import {AdminVerificationGuard} from '../../administrator/admin-verification.guard';
// import {RoutingPaths} from './routingPaths';
// const routingPaths: RoutingPaths = new RoutingPaths();
// export let routePaths: { [k: string]: string } = routingPaths.RoutingPaths;

export const RoutingPaths: { [k: string]: string } = {
    login: 'student-login',
    home: 'home',
    mainMenu: 'mainMenu',
    studentInfo: 'studentInfo',
    adminLogin: 'admin-login',
    adminDashboard: 'admin/main',
};

const routes: Routes = [
    {path: 'student-login', component: LoginComponent},
    {path: 'home', component: StudentPortalComponent, canActivate: [StudentLoginGuard]},
    {path: 'admin-login', component: AdminLoginComponent},
    {
        path: 'admin/main',
        component: AdminPortalComponent,
        canActivate: [AdminAccessGuard],
        children: [
            {path: '*', redirectTo: 'advising_statistics'},
            {path: 'advising_statistics', component: StatisticsComponent, canActivate: [AdminAccessGuard]},
            {path: 'opened_subjects', component: OpenedSubjComponent, canActivate: [AdminAccessGuard]},
            {path: 'admin_curriculum', component: AdminCurComponent, canActivate: [AdminAccessGuard]},
            {path: 'faculty_accounts', component: FacultyAccComponent, canActivate: [AdminAccessGuard, CanCreateAccountGuard]},
            {path: 'student_data', component: StudDataComponent, canActivate: [AdminAccessGuard]}
        ]
    },
    {path: '**', redirectTo: RoutingPaths.login},
// {path: 'experiment', component: HomeComponent},
// {path: routePaths.home, component: HomeComponent, canActivate: [UserAuthenticationGuard]},
// {path: routePaths.mainMenu, component: MainMenuComponent, canActivate: [UserAuthenticationGuard]},
// {path: routePaths.studentInfo, component: StudentInfoComponent, canActivate: [UserAuthenticationGuard]},
// {path: routePaths.adminDashboard, component: AdministratorComponent},
// {path: routePaths.adminDashboard, component: AdministratorComponent, canActivate: [AdminVerificationGuard]},
// {path: routePaths.adminDashboard, component: AdministratorComponent, canActivate: [UserAuthenticationGuard]},
// {path: RoutingPaths.home, component: UserComponent},
// {path: '**', redirectTo: RoutingPaths.login}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule,
    ],
    declarations: []
})
export class AppRoutingModule {
}

