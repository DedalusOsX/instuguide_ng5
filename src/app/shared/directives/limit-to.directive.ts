import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[limitTo]'
})

export class LimitToDirective {
  @Input('limitTo') public limitTo;

  @HostListener('keypress', ['$event'])
  public _onKeypress(e) {
    const limit = +this.limitTo;
    if (e.target.value.length === limit) {
      e.preventDefault();
    }
  }
}
