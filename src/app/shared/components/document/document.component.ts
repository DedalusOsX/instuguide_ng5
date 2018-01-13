import { Component, Input } from '@angular/core';
import { DocumentModel } from './document.model';

@Component({
  selector: 'document',
  templateUrl: 'document.component.html'
})
export class DocumentComponent {
  @Input() public document: DocumentModel;

  constructor() {}

  private setIcon(extension: string) {
    switch (extension) {
      case 'doc':
        return '/assets/images/fileicons/word.svg';
      case 'docx':
        return '/assets/images/fileicons/word.svg';
      case 'xls':
        return '/assets/images/fileicons/excel.svg';
      case 'xlsx':
        return '/assets/images/fileicons/excel.svg';
      case 'ppt':
        return '/assets/images/fileicons/ppoint.svg';
      case 'pptx':
        return '/assets/images/fileicons/ppoint.svg';
      case 'jpg':
        return '/assets/images/fileicons/jpg.svg';
      case 'png':
        return '/assets/images/fileicons/png.svg';
      case 'pdf':
        return '/assets/images/fileicons/adobe.svg';
      default:
        return '/assets/images/fileicons/randomfile.svg';
    }
  }
}
