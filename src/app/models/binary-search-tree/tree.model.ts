import {TreeNode} from './node.model';

export class BinarySearchTree<K, V> {
    tree: TreeNode<K, V>;

    public insert(key: K, value: V): void {
        this.tree = this.insertionRecursive(this.tree, key, value);
    }

    private insertionRecursive(root: TreeNode<K, V>, key: K, value: V): TreeNode<K, V> {
        if (root == null) {
            return new TreeNode<K, V>(key, value);
        }

        if (key < root.key) {
            root.left = this.insertionRecursive(root.left, key, value);
        } else if (key > root.key) {
            root.right = this.insertionRecursive(root.right, key, value);
        }

        return root;
    }
}
