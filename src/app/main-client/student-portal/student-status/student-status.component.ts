import {Component, OnInit, ViewChild} from '@angular/core';
import {
    IStudentInformation,
    ISubject, ISubjectEdge,
    ISubjectEdgesDataset,
    ISubjectGrade, ISubjectNodes,
    LoginService
} from '../../../login/login.service';
import {MatSort, MatTableDataSource} from '@angular/material';
import {CustomDTree, Edges, Leaf} from '../../../core/algorithms/CustomDTree';


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
    displayedColumns: string[] = ['code', 'title', 'total_units', 'pre_req', 'year', 'semester', 'paths'];
    // tableData: MatTableDataSource<ISubject>;
    // displayedColumns: string[] = ['code', 'title', 'total_units', 'pre_req', 'year', 'semester'];
    tableData: MatTableDataSource<ICustonSubject>;
    passed_subjects: string[];
    student_years: string[] = ['first', 'second', 'third', 'fourth'];
    @ViewChild(MatSort) sort: MatSort;

    subjectPaths: ISubjectEdgesDataset;
    shownPaths: ISubjectEdgesDataset;

    constructor(private loginService: LoginService) {
        const _tableData: ICustonSubject[] = [];
        const data_source: MatTableDataSource<IStudentInformation> = JSON.parse(atob(this.loginService.getStudentToken()));
        const course_curriculum = data_source['course_curriculum'];
        const subjects = course_curriculum['subjects'];
        this.subjectPaths = course_curriculum['paths'];
        console.log('this.subjectPaths value', this.subjectPaths);
        for (const i of subjects) {
            console.log(i.title);
            _tableData.push({
                code: i.code,
                title: i.title,
                total_units: i.total_units,
                pre_req: i.pre_req,
                year: (this.student_years.indexOf(i.year) + 1).toString(),
                semester: i.semester,
                paths: i.code
            });
        }
        const subject_taken: ISubjectGrade[] = data_source['subjects_taken'];
        this.passed_subjects = [];
        for (const i of subject_taken) {
            if (i.grade > 0 && i.grade <= 3) {
                this.passed_subjects.push(i.code);
            }
        }
        console.log('passed_subjects', this.passed_subjects);
        this.tableData = new MatTableDataSource(_tableData);

        // test function call for new algo implementation
        this.test_new_algo();
    }

    ngOnInit() {
        this.tableData.sort = this.sort;
    }

    isPassed(code: string) {
        // console.log('passing', code);
        return this.passed_subjects.includes(code);
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
