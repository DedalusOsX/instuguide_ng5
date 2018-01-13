import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'instu-dropdown',
  templateUrl: './dropdown.component.html'
})

export class DropdownComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public selected: string;
  @Input() public propLabel: string;
  @Input() public propValue: string;
  @Input() public data: any[];
  @Input() public required: boolean;
  @Input() public default: boolean;
  @Input() public label: string;
  @Input() public helperText: string;

  @Output() public valueUpdated: EventEmitter<any> = new EventEmitter();

  public iterable: any[] = [];
  public opened: boolean = false;

  private _clickEvent: string = 'click';

  constructor(private el: ElementRef, @Inject(DOCUMENT) private document: any) {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream && 'ontouchstart' in window) {
      this._clickEvent = 'touchstart';
    }
  }

  public ngOnInit() {
    if (!Array.isArray(this.data)) {
      throw new Error('"[data]" property must be an array');
    }
    if (this.default && !this.selected) {
      this.selected = this.data[0];
    }

    if (this._isPrimitiveArray()) {
      this.iterable = this.data.slice(0);
    } else {
      this.iterable = this.data.map((item: any) => item[this.propLabel]);
    }
  }

  public ngAfterViewInit() {
    this.document.addEventListener(this._clickEvent, this._outsideClickHandler.bind(this));
  }

  public setValue(index: number): void {
    this.opened = false;
    let value = this.iterable[index];
    if (!this._isPrimitiveArray()) {
      value = this.data[index][this.propValue];
    }
    this.selected = value;
    this.valueUpdated.emit(value);
  }

  public trackByFn(index) { return index; }

  public ngOnDestroy() {
    this.document.removeEventListener(this._clickEvent, this._outsideClickHandler.bind(this));
  }

  private _isPrimitiveArray() {
    return !this.propLabel && !this.propValue;
  }

  private _outsideClickHandler(e) {
    if (!this.el.nativeElement.contains(e.target)) {
      this.opened = false;
    }
  }
}
