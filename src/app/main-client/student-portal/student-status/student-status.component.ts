import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
    IStudentInformation,
    ISubject, ISubjectEdge,
    ISubjectEdgesDataset,
    ISubjectGrade, ISubjectNodes,
    LoginService
} from '../../../login/login.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomDTree, Edges, Leaf} from '../../../core/algorithms/CustomDTree';
import {SStore, StudentStoreData} from '../s-services/s-store';
import {VisTreeComponent} from '../main-components/vis-tree/vis-tree.component';


const curriculum_data: ISubject[] = [
    {code: '', title: '', total_units: 0, pre_req: '', year: '', semester: ''}
];


export class ICustonSubject implements ISubject {
    code: string;
    pre_req: string;
    semester: string;
    title: string;
    total_units: number;
    year: string;
    paths: string;
}

@Component({
    selector: 'app-student-status',
    templateUrl: './student-status.component.html',
    styleUrls: ['./student-status.component.css']
})
export class StudentStatusComponent implements OnInit {

    displayedColumns: string[] = ['code', 'title', 'total_units', 'pre_req', 'year', 'semester'];
    // tableData: MatTableDataSource<ISubject>;
    // displayedColumns: string[] = ['code', 'title', 'total_units', 'pre_req', 'year', 'semester'];
    tableData: MatTableDataSource<ICustonSubject>;
    passed_subjects: string[];
    student_years: string[] = ['first', 'second', 'third', 'fourth'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    subjectPaths: ISubjectEdgesDataset;
    shownPaths: ISubjectEdgesDataset;

    resultsLength: number;

    nodes: { id: string, label: string, color: string, title: string }[];
    edges: { from: string, to: string }[];
    @ViewChild('visTree') visTree: VisTreeComponent;

    constructor(private loginService: LoginService, private sStore: SStore) {
        this.load_main_data();
    }

    map_vis_tree() {
        this.nodes = [];
        this.edges = [];
        const col = 'skyblue';
        this.nodes = this.sStore.student_data_values.course_curriculum.subjects.map(x => {
            return {
                id: x.code.toUpperCase(),
                label: x.code.toUpperCase(),
                color: col,
                title: x.title
            };
        });
        const year_standing = ['first', 'second', 'third', 'fourth'];
        // this.nodes.push({
        //     id: '-',
        //     label: 'End',
        //     color: col,
        //     title: 'End'
        // });
        for (const y of year_standing) {
            this.nodes.push(
                {
                    id: y.toUpperCase(),
                    label: y.toUpperCase(),
                    color: col,
                    title: y.toUpperCase() + ' Year Standing'
                }
            );
        }
        this.edges = this.sStore.d3_algo.training_data.map(x => {
            return {
                from: String(x.parent.identifier).toUpperCase(),
                to: String(x.child.identifier).toUpperCase()
            };
        });
        this.visTree.edges = this.edges;
        this.visTree.nodes = this.nodes;
        this.visTree.build_tree();
    }

    load_main_data() {
        // const _tableData: ICustonSubject[] = [];
        // const data_source: MatTableDataSource<IStudentInformation> = JSON.parse(atob(this.loginService.getStudentToken()));
        // const course_curriculum = data_source['course_curriculum'];
        // const subjects = course_curriculum['subjects'];
        // this.subjectPaths = course_curriculum['paths'];
        // console.log('this.subjectPaths value', this.subjectPaths);
        // console.log('statusData', this.sStore);
        // for (const i of subjects) {
        //     console.log(i.title);
        //     _tableData.push({
        //         code: i.code,
        //         title: i.title,
        //         total_units: i.total_units,
        //         pre_req: i.pre_req,
        //         year: (this.student_years.indexOf(i.year) + 1).toString(),
        //         semester: i.semester,
        //         paths: i.code
        //     });
        // }
        // const subject_taken: ISubjectGrade[] = data_source['subjects_taken'];
        // this.passed_subjects = [];
        // for (const i of subject_taken) {
        //     if (i.grade > 0 && i.grade <= 3) {
        //         this.passed_subjects.push(i.code);
        //     }
        // }
        // console.log('passed_subjects', this.passed_subjects);
        this.tableData = new MatTableDataSource([]);
        this.tableData.paginator = this.paginator;
        // test function call for new algo implementation
        // this.test_new_algo();
        this.sStore.d3_algo_finised.subscribe(x => {
            this.map_vis_tree();
        });
    }

    set_passed_subjects(subject_taken: ISubjectGrade[]) {
        this.passed_subjects = [];
        for (const i of subject_taken) {
            if (StudentStoreData.is_pass_or_taken(i.grade)) {
                this.passed_subjects.push(i.code);
            }
        }
        console.log('passed_subjects', this.passed_subjects);
    }

    year_index_2_string(i_x: string) {
        return this.student_years[Number(i_x)];
    }

    main_data() {
        this.sStore.student_data
            .subscribe((val) => {
                if (!val.course_curriculum) {
                    return;
                }
                console.log('val', val);
                const _v2_tableData: ICustonSubject[] = [];
                for (const x of val.course_curriculum.subjects) {
                    _v2_tableData.push({
                        code: x.code,
                        title: x.title,
                        total_units: Number(x.total_units),
                        pre_req: x.pre_req.join(','),
                        year: this.student_years.indexOf(x.year.toString().toLowerCase()).toString(),
                        semester: x.semester,
                        paths: x.code
                    });
                }
                console.log('_v2_tableData', _v2_tableData);
                this.tableData = new MatTableDataSource(_v2_tableData.slice());
                this.tableData.paginator = this.paginator;
                if (val.subjects_taken) {
                    this.set_passed_subjects(val.subjects_taken);
                }
            });
    }

    ngOnInit() {
        this.main_data();
        this.tableData.sort = this.sort;
        this.tableData.paginator = this.paginator;
        this.sort.sortChange.subscribe(() => this.reset_paginator_index());
        this.resultsLength = this.tableData.data.length;
    }

    isPassed(code: string) {
        // console.log('passing', code);
        return this.passed_subjects.includes(code);
    }

    reset_paginator_index() {
        this.paginator.pageIndex = 0;
    }

    reset_filter_by_year() {
        this.tableData.filter = '';
    }

    is_filter_value(x: string): boolean {
        const index_of_year = this.get_index_of_year(x);
        return this.tableData.filter.toString() === index_of_year.toString();
    }

    filter_by_year() {
        this.tableData.filterPredicate = function (data, filter: string): boolean {
            // console.log('data.year.toLowerCase().includes(filter)', data.year.toLowerCase().includes(filter));
            console.log('filter', filter);
            // console.log('data.year.toLowerCase()',data.year.toLowerCase());
            return data.year.toString().includes(filter.toString());
        };
    }

    get_index_of_year(x: string): number {
        return this.student_years.indexOf(x);
    }

    filter_by_year_wrapper(year: string) {
        this.reset_paginator_index();
        // toggle behaviour
        if (this.is_filter_value(year)) {
            this.reset_filter_by_year();
        } else {
            this.filter_by_year();
            const index_of_year = this.get_index_of_year(year);
            this.applyFilter(index_of_year.toString());
        }
    }

    applyFilter(filterValue: string) {
        // filterValue = filterValue.trim(); // Remove whitespace
        // filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        filterValue = filterValue.trim().toLowerCase();
        this.tableData.filter = filterValue;
    }

    str_to_num(str): Number {
        return Number(str) - 1;
    }

    get_paths_for_code(code: string) {
        console.log('start looking for', code);
        console.log('this.subjectPaths', this.subjectPaths);
        const s_edges: ISubjectEdge[] = [];
        const s_nodes: ISubjectNodes[] = [];
        const s_e_items: string[] = [];
        console.log('edges', this.subjectPaths.edges);
        for (const i of this.subjectPaths.edges) {
            console.log('item i of edges', i);
            if (i.child === code || i.parent === code) {
                console.log('child found!:', i.child);
                s_edges.push(i);
                if (!s_e_items.includes(i.child)) {
                    s_e_items.push(i.child);
                }
                if (!s_e_items.includes(i.parent)) {
                    s_e_items.push(i.parent);
                }
            }
        }
        for (const i of this.subjectPaths.nodes) {
            if (s_e_items.includes(i.id) || i.id === code) {
                console.log('found!:', i.id);
                s_nodes.push(i);
            }
        }
        this.shownPaths = {nodes: s_nodes, edges: s_edges};
        console.log('main_paths:', this.shownPaths);
    }

    test_new_algo() {
        const d_setz = [];
        console.log('use_d', this.tableData.data);
        this.tableData.data.slice().forEach(x => {
            const p: Leaf = {identifier: x.code};
            // console.log('x.code', x.code);
            if (typeof p !== 'undefined') {
                const c: Leaf[] = [];
                x.pre_req.split(',').forEach(z => {
                    const n = {identifier: z};
                    if (typeof z === 'string') {
                        c.push(n);
                    }
                });
                if (c.length > 0 && typeof p !== 'undefined') {
                    for (const ch of c) {
                        if (typeof ch.identifier === 'string' && typeof p.identifier === 'string') {
                            const new_e: Edges = {
                                parent: p,
                                child: ch
                            };
                            d_setz.push(new_e);
                        }
                    }
                }
            }

        });
        // create dataset for tree.
        console.log('d_setz', d_setz);
        const new_3 = new CustomDTree(d_setz);
        console.log('d3 es:', new_3);
        const pss = this.passed_subjects;
        new_3.pruneLeaf({identifier: ''});
        new_3.pruneLeaf({identifier: 'third'});
        new_3.pruneLeaf({identifier: 'fourth'});
        pss.forEach(x => {
            const to_r: Leaf = {identifier: x};
            new_3.pruneLeaf(to_r);
        });
        console.log('pruned_3', new_3);
        console.log('all_nodes', new_3.all_nodes);
        console.log('leaf_nodes()', new_3.leaf_nodes);
    }
}
