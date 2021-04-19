import {TreeNode} from './node.model';

export class BinarySearchTree<K, V> {
    root: TreeNode<K, V>;

    public insert(key: K, value: V): void {
        this.root = this.insertionRecursive(this.root, key, value);
    }

    private insertionRecursive(root: TreeNode<K, V>, key: K, value: V): TreeNode<K, V> {
        if (root == null) {
            return new TreeNode<K, V>(key, value);
        }

        if (key === root.key) {
            return root;
        }
        if (key < root.key) {
            root.left = this.insertionRecursive(root.left, key, value);
        } else if (key > root.key) {
            root.right = this.insertionRecursive(root.right, key, value);
        }

        return root;
    }


    public find(key: K): TreeNode<K, V> | null {
        let nodePointer = this.root;
        if (nodePointer === null) {
            return null;
        } else {
            while (true) {
                if (key === nodePointer.key) {
                    return nodePointer;
                } else if (key > nodePointer.key) {
                    if (nodePointer.right === null) {
                        return null;
                    }
                    nodePointer = nodePointer.right;
                } else {
                    if (nodePointer.left == null) {
                        return null;
                    }
                    nodePointer = nodePointer.left;
                }
            }
        }
    }


    public remove(key: K): void {
        let parent: TreeNode<K, V> | null = null;
        let v = this.root;
        while (true) {
            if (v == null) {
                return;
            } else if (key < v.key) {
                parent = v;
                v = v.left;
            } else if (key > v.key) {
                parent = v;
                v = v.right;
            } else {
                break;
            }
        }

        let result: TreeNode<K, V> | null;

        if (v.left == null) {
            result = v.right;
        } else if (v.right == null) {
            result = v.left;
        } else {
            let minNodeParent = v;
            let minNode = v.right;
            while (minNode.left != null) {
                minNodeParent = minNode;
                minNode = minNode.left;
            }
            result = v;
            v.key = minNode.key;
            this.replaceChild(minNodeParent, minNode, minNode.right);
        }

        this.replaceChild(parent, v, result);
    }

    private replaceChild(parent: TreeNode<K, V> | null, old: TreeNode<K, V>, newNode: TreeNode<K, V> | null): void {
        if (parent == null) {
            this.root = newNode;
        } else if (parent.left === old) {
            parent.left = newNode;
        } else if (parent.right === old) {
            parent.right = newNode;
        }
    }


    public getHeight(): number {
        return this.findHeight(this.root);
    }

    private findHeight(node: TreeNode<K, V>): number {
        if (node != null) {
            return 1 + Math.max(this.findHeight(node.left), this.findHeight(node.right));
        } else {
            return 0;
        }
    }
}
