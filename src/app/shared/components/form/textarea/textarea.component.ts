import {
  Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnChanges, SimpleChanges, ElementRef, OnInit
} from '@angular/core';
import { UUID } from 'angular2-uuid';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'instu-textarea',
  templateUrl: './textarea.component.html'
})

export class TextareaComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() public label: string;

  @Input() public required: boolean = false;
  @Input() public readonly: boolean = false;

  @Input() public error: string;
  @Input() public helper: string;
  @Input() public value: string;

  @Output() public onFocus: EventEmitter<any> = new EventEmitter();
  @Output() public onBlur: EventEmitter<any> = new EventEmitter();
  @Output() public onType: EventEmitter<any> = new EventEmitter();

  public field: string = UUID.UUID();
  public textarea: FormControl = new FormControl('', []);

  constructor() {
    //
  }

  public ngOnInit() {
    if (this.required) {
      this.textarea.setValidators([Validators.required]);
    }
  }

  public ngAfterViewInit() {
    this.setValue(this.value);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.setValue(changes.value.currentValue);
    }
  }

  public onChange(value: string) {
    this.onType.emit(value);
  }

  public setValue(value: string) {
    if (value != void 0) {
      this.textarea.setValue(value);
    }
  }
}
