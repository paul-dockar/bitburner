/**
 * TreeNode - each node can have zero or more children.
 * @constructor
 * @param {string} hostname
 */
export class TreeNode {
    constructor(hostname) {
        this.hostname = hostname;
        this.children = [];
        this.parent = null;
    }
}