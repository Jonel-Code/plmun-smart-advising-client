// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: true,
    // base_api_url: 'http://127.0.0.1:5000'
    base_api_url: 'http://127.0.0.1:5000',
    min_desktop_width: 769,
    routes: [
        {title: 'Advising Statistics', link: 'advising_statistics'},
        {title: 'Opened Subjects', link: 'opened_subjects'},
        {title: 'Curriculum', link: 'admin_curriculum'},
        {title: 'Student Data', link: 'student_data'},
        {title: 'Faculty Accounts', link: 'faculty_accounts'},
    ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
