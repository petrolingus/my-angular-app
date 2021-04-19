import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {BinarySearchTree} from '../models/binary-search-tree/tree.model';
import {Pair} from '../models/pair.model';

interface PointStyles {
    fillStyle: string;
    lineWidth: number;
    strokeStyle: string;
}

interface Point {
    index: number;
    value2: number;
    radius: number;
    x: number;
    y: number;
    styles: PointStyles | null;
}

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterViewInit, OnChanges {

    @Input(`setPair`) private pair: Pair<any, any>;
    @Input(`setFindKey`) private findKey: number;
    @Input(`setRemoveKey`) private removeKey: number;
    @Output() resultEmitter = new EventEmitter<string>();

    @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
    private context: CanvasRenderingContext2D;

    tree: BinarySearchTree<number, string>;

    points: Point[] = [];

    private isClick = false;
    private xShift = 0;
    private yShift = 0;
    private scale = 0.8;

    constructor() {
        this.tree = new BinarySearchTree();
        for (let i = 0; i < 5; i++) {
            const key = Math.floor(1000 * Math.random());
            const value = 'node_' + i;
            this.tree.insert(key, value);
        }
        console.log(this.tree);
    }

    private createVisualTreeData(height: number): void {
        const radius = 64;
        const layers = height;
        const minDistance = 8;
        const verticalGap = 1;

        for (let i = 0; i < layers; i++) {
            const n = Math.pow(2, i);
            const y = (2 + verticalGap) * radius * i;
            for (let j = 0; j < n / 2; j++) {
                const a = (radius + minDistance) * Math.pow(2, (layers - i - 1));
                const x: number = a + 2 * a * j;
                if (i === 0) {
                    this.points.push({index: 1, value2: 0, radius, x: 0, y: 0, styles: null});
                } else {
                    const pointsInRow = Math.pow(2, i);
                    const pointsInRowByTwo = pointsInRow / 2;
                    this.points.push({index: pointsInRow + j + pointsInRowByTwo, value2: 0, radius, x, y, styles: null});
                    this.points.push({index: pointsInRow - j + pointsInRowByTwo - 1, value2: 0, radius, x: -x, y, styles: null});
                }
            }
        }
    }

    private bindVisualTreeToData(): void {
        if (this.tree.root != null) {
            this.points[0].value2 = this.tree.root.key;
        }
        for (const p of this.points) {
            const trace = [];
            let id = p.index;
            while (id !== 1) {
                trace.push(id);
                id = Math.floor(id / 2);
            }
            trace.reverse();
            let nodePointer = this.tree.root;
            for (const t of trace) {
                // right
                if (t % 2 !== 0) {
                    if (nodePointer?.right != null) {
                        nodePointer = nodePointer?.right;
                        p.value2 = nodePointer.key;
                    } else {
                        p.value2 = 0;
                        break;
                    }
                }
                // left
                else {
                    if (nodePointer?.left != null) {
                        nodePointer = nodePointer?.left;
                        p.value2 = nodePointer.key;
                    } else {
                        p.value2 = 0;
                        break;
                    }
                }
            }
        }
    }

    private draw(): void {
        this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        const rect = (this.canvas.nativeElement as HTMLCanvasElement).getBoundingClientRect();
        if (this.context != null) {
            this.context.canvas.width = rect.width;
            this.context.canvas.height = rect.height;
            this.drawTree(this.context);
            this.drawArrows(this.context);
        }
    }

    private drawTree(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const x = ctx.canvas.width / 2 + this.xShift;
        const y = ctx.canvas.height / 4 + this.yShift;
        ctx.translate(x, y);
        ctx.scale(this.scale, this.scale);
        for (const p of this.points) {
            if (p.value2 === 0) {
                continue;
            }
            ctx.fillStyle = '#63C877';
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#3a9c4e';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.font = p.radius + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(p.value2), p.x, p.y + 2);
        }
        ctx.restore();
    }

    private drawArrows(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const x = ctx.canvas.width / 2 + this.xShift;
        const y = ctx.canvas.height / 4 + this.yShift;
        ctx.translate(x, y);
        ctx.scale(this.scale, this.scale);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#3a9c4e';
        for (const p of this.points) {
            if (p.value2 === 0) {
                continue;
            }
            if (p.index !== 1) {
                const parentId = Math.floor(p.index / 2);
                let parent = this.points[0];
                for (const point of this.points) {
                    if (point.index === parentId) {
                        parent = point;
                        break;
                    }
                }
                let dx = p.x - parent.x;
                let dy = p.y - parent.y;
                const r = Math.sqrt(dx * dx + dy * dy);
                dx /= r;
                dy /= r;
                ctx.beginPath();
                ctx.setLineDash([6, 6]);
                ctx.moveTo(parent.x + 60 * dx, parent.y + 60 * dy);
                ctx.lineTo(p.x - 60 * dx, p.y - 60 * dy);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    private drawInit(): void {
        this.points = [];
        this.createVisualTreeData(this.tree.getHeight());
        this.bindVisualTreeToData();
        this.draw();
    }

    ngAfterViewInit(): void {
        this.drawInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes.pair != null) {
            if (!changes.pair.firstChange) {
                this.insertNode(changes.pair.currentValue);
            }
        } else if (changes.removeKey != null) {
            this.removeNode(+changes.removeKey.currentValue);
        } else if (changes.findKey != null) {
            this.findNode(+changes.findKey.currentValue);
        }
    }

    insertNode(pair: Pair<number, string>): void {
        this.tree.insert(+pair.key, pair.value);
        this.createVisualTreeData(this.tree.getHeight());
        this.bindVisualTreeToData();
        this.drawInit();
    }

    findNode(key: number): void {
        const result = this.tree.find(key);
        if (result != null) {
            this.resultEmitter.emit('Node is exist: \n' + JSON.stringify(result));
        } else {
            this.resultEmitter.emit('Node does\'t exist');
        }
    }

    removeNode(key: number): void {
        this.tree.remove(key);
        this.createVisualTreeData(this.tree.getHeight());
        this.bindVisualTreeToData();
        this.drawInit();
        this.resultEmitter.emit('deleted node with key is equal ' + key);
    }

    onZoom($event: any): void {
        const s = Math.sign($event.wheelDelta);
        const z = 0.05;
        if (s < 0) {
            if (this.scale > 0.2) {
                this.scale -= z;
            }
        } else {
            if (this.scale < 2.0) {
                this.scale += z;
            }
        }
        this.drawInit();
    }

    onTranslate($event: MouseEvent): void {
        if (this.isClick) {
            this.xShift += $event.movementX;
            this.yShift += $event.movementY;
            this.drawInit();
        }
    }

    onCanvasResize(): void {
        this.draw();
    }

    onMouseDown(): void {
        this.isClick = true;
    }

    onMouseUp(): void {
        this.isClick = false;
    }

    onMouseLeave(): void {
        this.isClick = false;
    }
}
