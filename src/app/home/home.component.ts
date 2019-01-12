import {Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import {Network} from 'vis';
import {ISubject} from '../subject';
import {CurriculumService, Suject} from '../curriculum.service';
import {LoginService} from '../login/login.service';
// import {StudentService} from '../administrator/students/student.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private curriculumService: CurriculumService,
                private loginService: LoginService,
                // private studentService: StudentService
                ) {
    }

    @ViewChild('siteConfigNetwork') networkContainer: ElementRef;
    @ViewChild('pop') popOver: any;
    public network: any;
    public subjectContent: any;
    private cont: ISubject[];
    private items: any[];
    studentId: string;
    studentName: string;
    deppest: number;


    ngOnInit(): void {
        this.studentId = this.loginService.getUsernameToken();
        this.deppest = 0;
        this.get_content();
    }

    get_content(): void {
        // this.subjectContent = this.curriculumService.getData().subscribe(
        //     data => {
        //         console.log(data);
        //         const pattern: any[] = [];
        //         data['subjects'].forEach((res) => {
        //             pattern.push({from: res.subject_id, to: res.requirement_id});
        //         });
        //         const nodes: any[] = [];
        //         data['labels'].forEach((res) => {
        //             nodes.push({
        //                 id: res.id,
        //                 label: res.description,
        //                 color: {background: res.semester === 1 ? 'skyblue' : 'salmon'},
        //                 title: res.description
        //             });
        //         });
        //         const treeInfo = this.makeTreeData(nodes, pattern);
        //         this.loadVisTree(treeInfo);
        //     }
        // );
        // this.studentService.getAllSubject('BSCS', '201617')
        //     .subscribe(data => {
        //         console.log(data);
        //         const pattern: any[] = [];
        //         data['edges'].forEach((res) => {
        //             pattern.push({
        //                 from: res.parent,
        //                 to: res.child
        //             });
        //         });
        //         const nodes: any[] = [];
        //         data['nodes'].forEach((res) => {
        //             nodes.push({
        //                 id: res.title,
        //                 label: res.label,
        //                 color: {background: 'skyblue'},
        //                 title: res.label
        //             });
        //         });
        //         const treeInfo = this.makeTreeData(nodes, pattern);
        //         this.loadVisTree(treeInfo);
        //         this.studentName = 'test';
        //         // const analysis_result = data['analysis_result'];
        //         // analysis_result.forEach((res) => {
        //         //     const level = res['level'];
        //         //     if (level > this.deppest) {
        //         //         this.deppest = level;
        //         //     }
        //         //     console.log('visited_nodes');
        //         // });
        //     });
    }

    loadVisTree(treedata) {
        const options = {
            edges: {
                arrows: {
                    to: {enabled: false, scaleFactor: 1, type: 'arrow'},
                    middle: {enabled: false, scaleFactor: 1, type: 'arrow'},
                    from: {enabled: true, scaleFactor: 1, type: 'arrow'}
                },
                arrowStrikethrough: true,
                smooth: {
                    enabled: true,
                    type: 'vertical',
                    roundness: 0.5
                },
            },
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'UD',
                    sortMethod: 'directed',
                }
            },
            interaction: {
                hover: true,
            },
            nodes: {
                heightConstraint: 20,
                shape: 'box',
            }
        };
        const container = this.networkContainer.nativeElement;
        this.network = new Network(container, treedata, options);

        const that = this;
        this.network.on('hoverNode', function (params) {
            console.log('hoverNode Event:', params);
        });
        this.network.on('blurNode', function (params) {
            console.log('blurNode event:', params);

        });
    }

    makeTreeData(nodes, edges) {
        const treeData = {
            nodes: nodes,
            edges: edges
        };
        return treeData;
    }

}
