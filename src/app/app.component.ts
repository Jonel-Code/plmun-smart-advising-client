import {AfterViewInit, Component, OnInit} from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {ISubject} from './subject';
// import {Observable} from 'rxjs';
// import {CurriculumService} from './curriculum.service';
import {
    Router, NavigationStart, NavigationCancel, NavigationEnd
} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

    private record = {};
    routeLoading: boolean;

    // constructor(private curriculumService: CurriculumService) {
    // }
    constructor(private router: Router) {
        this.routeLoading = true;
    }

    ngOnInit() {
        // this.record = this.curriculumService.getData();
        this.routeLoading = true;
    }

    ngAfterViewInit() {
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    this.routeLoading = true;
                } else if (
                    event instanceof NavigationEnd ||
                    event instanceof NavigationCancel
                ) {
                    this.routeLoading = false;
                }
            });
    }


}
