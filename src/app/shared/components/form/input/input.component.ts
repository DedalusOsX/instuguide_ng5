import {
  Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, OnChanges, SimpleChanges, ElementRef, OnInit
} from '@angular/core';
import { UUID } from 'angular2-uuid';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'instu-input',
  templateUrl: './input.component.html'
})

export class InputComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() public prefix: string = '';
  @Input() public suffix: string;

  @Input() public label: string;
  @Input() public min: number = 0;
  @Input() public max: number;

  @Input() public required: boolean = false;
  @Input() public readonly: boolean = false;

  @Input() public type: string = 'text';
  @Input() public tmpType: string;

  @Input() public error: string;
  @Input() public helper: string;
  @Input() public value: string;

  @Output() public onFocus: EventEmitter<any> = new EventEmitter();
  @Output() public onBlur: EventEmitter<any> = new EventEmitter();
  @Output() public onType: EventEmitter<any> = new EventEmitter();

  public field: string = UUID.UUID();
  public input: FormControl = new FormControl('', []);

  constructor() {
    //
  }

  public ngOnInit() {
    if (this.required) {
      this.input.setValidators([Validators.required]);
    }
    this.tmpType = this.type;
  }

  public ngAfterViewInit() {
    if (this.prefix.length) {
      this.prefix += ' ';
    }
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
    if (value != undefined) {
      this.input.setValue(value);
    }
  }

  public togglePassword() {
    if (this.type === 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
