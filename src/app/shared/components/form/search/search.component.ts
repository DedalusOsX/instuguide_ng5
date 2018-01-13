import {
  Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, OnInit
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'instu-search',
  templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit {
  @Input() public label: string;

  @Output() public onType: EventEmitter<any> = new EventEmitter();
  @Output() public onBlur: EventEmitter<any> = new EventEmitter();
  @Output() public onFocus: EventEmitter<any> = new EventEmitter();

  constructor() {
    //
  }

  public ngOnInit() {

  }


}
