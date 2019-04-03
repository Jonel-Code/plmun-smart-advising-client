import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Network} from 'vis';

@Component({
    selector: 'app-vis-tree',
    templateUrl: './vis-tree.component.html',
    styleUrls: ['./vis-tree.component.css']
})
export class VisTreeComponent implements OnInit {

    @ViewChild('siteConfigNetwork') networkContainer: ElementRef;
    @Input() nodes: { id: string, label: string, color: string, title: string } [];
    @Input() edges: { from: string, to: string }[];
    public network: any;

    constructor() {
    }

    ngOnInit() {
        this.build_tree();
    }

    build_tree() {
        console.log('nodes', this.nodes);
        console.log('edges', this.edges);
        if (!this.nodes || !this.edges) {
            return;
        }
        this.loadVisTree(this.makeTreeData(this.nodes, this.edges));
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

