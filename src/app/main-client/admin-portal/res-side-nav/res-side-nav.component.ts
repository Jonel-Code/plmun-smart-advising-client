import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

export interface NavLink {
    title: string;
    link: string;
}

@Component({
    selector: 'app-res-side-nav',
    templateUrl: './res-side-nav.component.html',
    styleUrls: ['./res-side-nav.component.css']
})
export class ResSideNavComponent implements OnDestroy, OnInit {

    mobileQuery: MediaQueryList;

    nav_options: NavLink[] = [
        {title: 'Advising Statistics', link: 'advising_statistics'},
        {title: 'Opened Subjects', link: 'opened_subjects'},
        {title: 'Curriculum', link: 'admin_curriculum'},
        {title: 'Faculty Accounts', link: 'faculty_accounts'}
    ];

    child_link_loading = false;


    private _mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.router.events.subscribe((event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.child_link_loading = true;
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.child_link_loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.child_link_loading = false;
    }

    load_admin_home(): boolean {
        return this.get_route_child().length === 0;
    }

    get_route_child(): string[] {
        return this.router.url.split('/').slice(3);
    }

    search_title_of_link(link: string): string {
        let x = null;
        this.nav_options.forEach(z => {
            if (z.link === link) {
                x = z.title;
            }
        });
        return x;
    }


    current_dashboard(): string {
        return this.search_title_of_link(this.get_route_child()[0]);
    }

    is_view_mobile() {
        return window.innerWidth <= 800 && window.innerHeight <= 600;
    }

    logout() {
        localStorage.clear();
        // location.reload();
        this.router.navigate(['admin-login']);
    }

}
