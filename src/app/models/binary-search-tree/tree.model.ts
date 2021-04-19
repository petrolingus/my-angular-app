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
