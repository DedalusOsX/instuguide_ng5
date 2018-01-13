import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'instu-list',
  templateUrl: './list.component.html'
})

export class ListComponent implements OnChanges {

  @Input() public data: any[];
  @Input() public field: string;
  @Input() public label: string;
  @Input() public theme: string;
  @Input() public iconGroup: string;
  @Input() public helperText: string;

  @Output() public valueUpdated = new EventEmitter();

  public selected: any;

  constructor(@Inject(DOCUMENT) private document: any) {

  }

  public ngOnChanges() {
    this.data.push('');
  }

  public onFocus(index) {
    if (this.data[index].length && index != this.data.length) {
      return false;
    } else {
      this.data.push('');
    }
  }

  public onBlur(index) {
    if (this.data[index].length) {
      return false;
    } else {
      this.data.splice(index, 1);
    }
  }

  public trackByFn(index) {
    return index;
  }

}
