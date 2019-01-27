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

    // @ViewChild('snav') snav;

    mobileQuery: MediaQueryList;
    main_title: string;

    nav_options: NavLink[] = [
        {title: 'Advising Statistics', link: 'advising_statistics'},
        {title: 'Opened Subjects', link: 'opened_subjects'}
    ];
    // selected_options: NavLink;

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
        this.toggle_option(this.nav_options[0]);
    }


    toggle_option(nav_ops: NavLink) {
        // const indx = this.nav_options.indexOf(nav_ops);
        // this.selected_options = nav_ops;
        this.main_title = nav_ops.title;
        // this.snav.toggle();
    }

    is_view_mobile() {
        return window.innerWidth <= 800 && window.innerHeight <= 600;
    }

}
