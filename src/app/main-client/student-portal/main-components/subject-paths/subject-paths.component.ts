import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Network} from 'vis';
import {ISubjectEdge, ISubjectNodes} from '../../../../login/login.service';


@Component({
    selector: 'app-subject-paths',
    templateUrl: './subject-paths.component.html',
    styleUrls: ['./subject-paths.component.css']
})
export class SubjectPathsComponent implements OnInit {
    @ViewChild('siteConfigNetwork') networkContainer: ElementRef;
    @ViewChild('pop') popOver: any;
    @Input() edges: ISubjectEdge[];
    @Input() nodes: ISubjectNodes[];

    public network: any;

    constructor() {
    }

    ngOnInit() {
        this.initializeTree();
    }

    initializeTree() {
        if (!this.edges || !this.nodes) {
            return;
        }
        const temp_nodes: any[] = [];
        const temp_edges: any[] = [];
        for (const i of this.nodes) {
            temp_nodes.push(
                {
                    id: i.id,
                    label: i.label,
                    color: {background: 'skyblue'},
                    title: i.title
                }
            );
        }
        for (const i of this.edges) {
            temp_edges.push({
                from: i.parent,
                to: i.child
            });
        }
        console.log('temp_nodes', temp_nodes);
        console.log('temp_edges', temp_edges);
        this.loadVisTree(this.makeTreeData(temp_nodes, temp_edges));
    }

    loadVisTree(treedata) {
        const options = {
            edges: {
                arrows: {
                    to: {enabled: true, scaleFactor: 1, type: 'arrow'},
                    middle: {enabled: false, scaleFactor: 1, type: 'arrow'},
                    from: {enabled: false, scaleFactor: 1, type: 'arrow'}
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
