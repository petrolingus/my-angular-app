export class TreeNode<K, V> {
    key: K;
    value: V;
    left: TreeNode<K, V>;
    right: TreeNode<K, V>;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}
