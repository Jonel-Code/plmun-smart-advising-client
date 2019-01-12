/**
 * Base Interface for Edge representation
 * Edge requires a parent to child relationship
 * this is used for the Data Structure of CustomDTree Algorithm in this module
 */
export interface Edges {
    parent: Leaf;
    child: Leaf;
}

/**
 * Base Interface for Node representation
 * used for Edges Based Interface
 */
export interface Leaf {
    identifier: string;
}

/**
 * Custom-made decision tree Algorithm
 * uses tree Pruning method for removal of node
 * */
export class CustomDTree {
    private _trainingData: Edges[];

    /**
     * private helper property for linking all the topmost leaf
     */
    private _Peak: Leaf = {identifier: '-'};

    /**
     * returns all the node as and array of Leaf Object currently present on the Training Data
     */
    get all_nodes(): Leaf[] {
        const un = [];
        const ret_v = [];
        this._trainingData.forEach(x => {
            if (!un.includes(x.parent.identifier)) {
                un.push(x.parent.identifier);
                ret_v.push(x.parent);
            }
            if (!un.includes(x.child.identifier)) {
                un.push(x.child.identifier);
                ret_v.push(x.child);
            }
        });
        return ret_v;
    }

    // get parent_nodes(): Leaf[] {
    //     const p_identifier: any[] = [];
    //     // const ret_val = [];
    //     const ret_val = this._trainingData.reduce((x, item) => {
    //         p_identifier.push(x.parent.identifier);
    //         if (!p_identifier.includes(x.parent.identifier)) {
    //             x = [...x.parent, item.parent];
    //         }
    //         return x;
    //     }, []);
    //     console.log('ret_val', ret_val);
    //     const peak_i = ret_val.indexOf(this._Peak);
    //     if (peak_i > -1) {
    //         ret_val.splice(peak_i, 1);
    //     }
    //     return ret_val;
    // }

    /**
     * returns All The present Parent nodes as an Array of Leaf Objects
     */
    get parent_nodes(): Leaf[] {
        const p_identifier: any[] = [];
        const ret_val = [];
        this._trainingData.forEach(x => {
            if (!p_identifier.includes(x.parent.identifier)) {
                p_identifier.push(x.parent.identifier);
                ret_val.push(x.parent);
            }
        });
        const peak_i = ret_val.indexOf(this._Peak);
        if (peak_i > -1) {
            ret_val.splice(peak_i, 1);
        }
        return ret_val;
    }

    /**
     * returns All the present child nodes as an Array of Leaf Objects
     */
    get child_nodes(): Leaf[] {
        const child_identifier: any[] = [];
        const ret_val = [];
        this._trainingData.forEach(x => {
            if (!child_identifier.includes(x.child.identifier)) {
                child_identifier.push(x.child.identifier);
                ret_val.push(x.child);
            }
        });
        return ret_val;
    }

    /**
     * returns Array of parent node's Identifier
     */
    get parent_nodes_identifiers(): any[] {
        return this.parent_nodes.map(x => {
            return x.identifier;
        });
    }

    /**
     * returns Array of child node's Identifier
     */
    get child_nodes_identifiers(): any[] {
        return this.child_nodes.map(x => {
            return x.identifier;
        });
    }

    /**
     * returns all Leaf node as an Array of Leaf Object
     */
    get leaf_nodes(): Leaf[] {
        const pi = this.parent_nodes_identifiers;
        const ret_val = [];
        this.child_nodes.forEach(x => {
            if (!pi.includes(x.identifier)) {
                ret_val.push(x);
            }
        });
        return ret_val;
    }

    /**
     * returns an Array of all topmost Leafs in the parent-child relationships
     */
    get topmost_nodes(): Leaf[] {
        const ci = this.child_nodes_identifiers;
        const ret_val = [];
        this.parent_nodes.forEach(x => {
            if (!ci.includes(x.identifier) && x !== this._Peak) {
                ret_val.push(x);
            }
        });
        return ret_val;
    }

    /**
     * creates a copy of the content of passed array of edges
     * and sets as the base training Data
     * @param trainingData any Array of Edges
     */
    constructor(trainingData: Edges[]) {
        this._trainingData = trainingData.slice();
        this._filter_tree();
        this._linkToPeak();
    }

    /**
     * links all topmost Leafs to the Peak to avoid isolated or un-linked nodes
     */
    private _linkToPeak() {
        // const peak_of_tree: Leaf = {identifier: this._Peak};
        for (const i of this.topmost_nodes) {
            const n_e: Edges = {
                parent: this._Peak,
                child: i
            };
            this._trainingData.push(n_e);
        }
    }

    /**
     * method used to filter and avoid un-wanted nodes and links
     */
    private _filter_tree() {
        // removes redundant edges
        const edges_ids = [];
        const new_tree = [];
        for (const x of this._trainingData) {
            const current_edges_id = [x.parent.identifier, x.child.identifier];
            if (!edges_ids.includes(current_edges_id)) {
                edges_ids.push(current_edges_id);
                new_tree.push(x);
            }
        }
        this._trainingData = new_tree.slice();
    }

    /**
     * returns all the edges that uses the provided leaf's identifier as a parent
     * @param leaf any Leaf based Object
     */
    public findBrachesOfLeafAsParent(leaf: Leaf): Edges[] {
        const ret_v = [];
        this._trainingData.forEach(x => {
            if (x.parent.identifier === leaf.identifier) {
                ret_v.push(x);
            }
        });
        return ret_v;
    }

    /**
     * returns all the edges that uses the provided leaf's identifier as a Child
     * @param leaf any Leaf based Object
     */
    public findBrachesOfLeafAsChild(leaf: Leaf): Edges[] {
        const ret_v = [];
        this._trainingData.forEach(x => {
            if (x.child.identifier === leaf.identifier) {
                ret_v.push(x);
            }
        });
        return ret_v;
    }

    /**
     * returns all the Parent Leaf of the provided Leaf
     * @param leaf any Leaf based Object
     */
    public parentNodesOfLeaf(leaf: Leaf): Leaf[] {
        const ret_v = [];
        this._trainingData.forEach(x => {
            if (x.child.identifier === leaf.identifier) {
                ret_v.push(x.parent);
            }
        });
        return ret_v;
    }

    /**
     * returns all the Child Leaf of the provided Leaf
     * @param leaf any Leaf based Object
     */
    public childNodesOfLeaf(leaf: Leaf): Leaf[] {
        const ret_v = [];
        this._trainingData.forEach(x => {
            if (x.parent.identifier === leaf.identifier) {
                ret_v.push(x.child);
            }
        });
        return ret_v;
    }


    /**
     * adds new Edge to the training Data
     * @param new_Edge any Edge Based Object
     */
    public addNewEdge(new_Edge: Edges) {
        this._trainingData.push(new_Edge);
    }

    /**
     * removes a the Edge Provided if present on the training data
     * @param to_remove_branch Edge based object that needs to be remove (Preferably a reference type)
     */
    public pruneTree(to_remove_branch: Edges): void {
        const i = this._trainingData.indexOf(to_remove_branch, 0);
        if (i >= 0) {
            this._trainingData.splice(i, 1);
        }
    }

    /**
     * removes all the linkage and existence of a leaf to the training data
     * then append all of it's child to the all of the parents of the removed leaf
     * @param to_remove_leaf any Leaf based Object that needs to be pruned (Preferable a Reference type object)
     */
    public pruneLeaf(to_remove_leaf: Leaf) {
        const parents_of_to_remove = this.parentNodesOfLeaf(to_remove_leaf);
        const child_of_to_remove = this.childNodesOfLeaf(to_remove_leaf);
        const branches: Edges[] = this.findBrachesOfLeafAsParent(to_remove_leaf);
        const leaf_links: Edges[] = this.findBrachesOfLeafAsChild(to_remove_leaf);
        const linkage_of_leaf: Edges[] = [...branches, ...leaf_links];

        if (linkage_of_leaf.length) {
            for (const i of linkage_of_leaf) {
                switch (to_remove_leaf.identifier) {
                    case i.child.identifier:
                        // append all parent of i to the parents
                        for (const x of child_of_to_remove) {
                            this.addNewEdge({
                                parent: i.parent,
                                child: x
                            });
                        }
                        break;
                    case i.parent.identifier:
                        // append
                        for (const x of parents_of_to_remove) {
                            this.addNewEdge({
                                parent: x,
                                child: i.child
                            });
                        }
                        break;
                }
                this.pruneTree(i);
            }
            this._filter_tree();
        }
    }
}


