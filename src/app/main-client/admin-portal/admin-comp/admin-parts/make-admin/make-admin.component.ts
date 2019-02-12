import {Component, OnInit} from '@angular/core';
import {DeptListingService, DepartmentItem} from '../../../a-services/dept-listing.service';
import {NewFAccService} from '../../../a-services/new-f-acc.service';
import {d} from '@angular/core/src/render3';


@Component({
    selector: 'app-make-admin',
    templateUrl: './make-admin.component.html',
    styleUrls: ['./make-admin.component.css']
})
export class MakeAdminComponent implements OnInit {

    loading = true;
    deptItems: DepartmentItem[];
    selectedDept: DepartmentItem;
    selectedDeptTitle: string;

    f_id: string;
    pass: string;
    v_pass: string;

    v_message: string;

    constructor(private deptListingService: DeptListingService,
                private newFAccService: NewFAccService) {
        this.loading = true;
        this.deptItems = [];
        this.f_id = '';
        this.pass = '';
        this.v_pass = '';
        this.selectedDeptTitle = '';
        this.v_message = 'Error in Password Verification';
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.deptListingService.getDeptList()
            .then((data) => {
                console.log('dept_list data', data);
                return data;
            })
            .then((data) => {
                console.log('type of data', typeof data);
                this.deptItems = Object.values(data).map(x => {
                    return {id: x['id'], title: x['name']};
                });
                return data;
            })
            .then((data) => {
                this.loading = this.deptItems.length === 0;
                this.selectedDept = this.loading ? this.deptItems[0] : null;
            });
    }

    setSelectedDept(dx: DepartmentItem) {
        this.selectedDept = this.deptItems[this.deptItems.indexOf(dx)];
    }

    loadingDisableSemantic(): string {
        return this.loading ? 'disabled' : '';
    }

    semanticErrorNullString(input): string {
        return (typeof input === 'undefined') ? 'error' : '';
    }

    isPasswordVerified(): boolean {
        return this.v_pass === this.pass;
    }

    createNewFacultyAccount() {
        if (!this.isPasswordVerified() || this.selectedDeptTitle === '') {
            return null;
        }

        this.loading = true;
        this.newFAccService.newAdmin(this.f_id, this.pass, this.selectedDeptTitle)
            .then(data => {
                const account_data = data['account_data'];
                if (typeof account_data === 'undefined') {
                    this.accountNotCreated();
                } else {
                    this.accountCreated();
                }
            });
    }

    accountNotCreated() {
        this.loading = false;
    }

    accountCreated() {
        alert('Account Created');
        window.location.reload();
    }


}
