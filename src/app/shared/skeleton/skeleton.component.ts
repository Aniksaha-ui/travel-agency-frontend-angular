import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-skeleton',
    templateUrl: './skeleton.component.html',
    styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent implements OnChanges {
    @Input() type: 'card' | 'text' | 'rect' = 'rect';
    @Input() count: number = 1;
    @Input() width: string = '100%';
    @Input() height: string = '20px';

    items: any[] = [];

    ngOnInit() {
        this.updateItems();
    }

    ngOnChanges() {
        this.updateItems();
    }

    private updateItems() {
        this.items = Array(this.count).fill(0);
    }
}
