import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[iconPicker]'
})

export class IconPickerDirective implements OnInit {

  @Input('iconPicker') public className: string;

  constructor(private el: ElementRef) {
  }

  public ngOnInit() {
    let icon = '';
    switch (this.className) {
      case 'doc':
        icon = 'icon-Brain';
        break;
      case 'docx':
        icon = 'icon-Brain';
        break;
      case 'xls':
        icon = 'icon-Book';
        break;
      case 'xlsx':
        icon = 'icon-Book';
        break;
      case 'ppt':
        icon = 'icon-Book';
        break;
      case 'pptx':
        icon = 'icon-Book';
        break;
      case 'jpg':
        icon = 'icon-Book';
        break;
      case 'png':
        icon = 'icon-Book';
        break;
      case 'pdf':
        icon = 'icon-Book';
        break;
      default:
        icon = 'icon-Book';
    }

    this.el.nativeElement.className += icon;
  }
}
