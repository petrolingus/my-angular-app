import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Pair} from '../models/pair.model';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

    @Input(`result`) result;

    @Output() pairEmitter = new EventEmitter<Pair<any, any>>();
    key: any;
    value: any;
    pair: Pair<any, any>;

    @Output() findEmitter = new EventEmitter<number>();
    findKey: number;

    @Output() numberEmitter = new EventEmitter<number>();
    removeKey: number;

    insertNode(): void {
        this.pair = new Pair<any, any>(this.key, this.value);
        if (this.pair.key == null) {
            this.result = 'You must at least enter the key.';
        } else if (this.pair.key <= 0 || this.pair.key >= 1000) {
            this.result = 'Key is out of range (0, 1000)';
        } else {
            this.pairEmitter.emit(this.pair);
            this.result = JSON.stringify(this.pair);
        }
    }

    findNode(): void {
        this.findEmitter.emit(this.findKey);
    }

    removeNode(): void {
        this.numberEmitter.emit(this.removeKey);
    }
}
