import {Component} from '@angular/core';
import {Pair} from './models/pair.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    result: string;
    pair: Pair<any, any>;
    findKey: number;
    removedKey: number;

    childToParent(pair: Pair<any, any>): void {
        this.pair = pair;
    }

    setFindKey(findKey: number): void {
        this.findKey = findKey;
    }

    setRemovedKey(removedKey: number): void {
        this.removedKey = removedKey;
    }

    setResult(result: string): void {
        this.result = result;
    }
}
