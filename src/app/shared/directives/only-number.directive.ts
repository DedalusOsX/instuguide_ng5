import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective implements AfterViewInit {
  public input: HTMLInputElement;

  @Input() public min: string;
  @Input() public max: string;

  constructor(private el: ElementRef) {

  }

  public ngAfterViewInit() {
    this.input = this.el.nativeElement.querySelector('input');
    if (!this.input) {
      this.input = this.el.nativeElement;
    }
    this.input.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  public onKeyDown(event: KeyboardEvent) {
    let e = <KeyboardEvent> event;
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true || e.metaKey) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true || e.metaKey) ||
      // Allow: Ctrl+V
      (e.keyCode == 86 && e.ctrlKey === true || e.metaKey) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true || e.metaKey) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }

    let value = this.input.value + String.fromCharCode(e.which);
    if (this.min) {
      if (+value < +this.min) {
        e.preventDefault();
      }
    }

    if (this.max) {
      if (+value > +this.max) {
        e.preventDefault();
      }
    }
  }
}
