export class Pair<K, V> {
    key: K;
    value: V;

    constructor(x: K, y: V) {
        this.key = x;
        this.value = y;
    }
}
