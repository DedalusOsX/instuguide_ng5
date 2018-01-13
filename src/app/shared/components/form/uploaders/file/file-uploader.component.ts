import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { NotifierService } from '../../../../services/notifier.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html'
})

export class FileUploaderComponent implements OnInit {
  @Input() public options: any;
  @Input() public uploadPermission: boolean;
  @Input() public theme: string;
  @Input() public structure: string;
  @Input() public files: any;
  @Input() public triger: boolean;

  @Output() public filesAdded = new EventEmitter();
  @Output() public filesDeleted = new EventEmitter();

  public field: string = UUID.UUID();

  public ALLOWED_FILE_TYPES: string[] = ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'png', 'jpg', 'jpeg', 'ppt', 'pptx'];
  public FILE_MAX_SIZE: number = 10 * 1024 * 1024;
  public acceptedFormats: string = '';

  public uploaderInstance: FileUploader;

  public removedItemsList: any;
  public existingFiles: any;

  constructor(private notifier: NotifierService, private cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this._installUploader();
    this._registerListeners();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.files) {
      this._installUploader();
    }
  }

  public setIcon(extension: string): string {
    if (!extension) {
      return;
    }
    let extensionProccessed = extension.split('.')[1] || extension;
    switch (extensionProccessed) {
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

  public removeItem(index) {
    this.removedItemsList.push(this.existingFiles[index]);
    this.existingFiles.splice(index, 1);
    this.filesDeleted.emit(this.removedItemsList);
  }

  public _installUploader() {
    this.acceptedFormats = '';

    if (this.files && this.files.length) {
      this.existingFiles = this.files.slice();
    } else {
      this.existingFiles = [];
    }

    this.options = this.options || {};
    this.uploaderInstance = new FileUploader({
      autoUpload: false,
      allowedFileType: this.options.allowedFileType || this.ALLOWED_FILE_TYPES,
      maxFileSize: this.options.maxFileSize || this.FILE_MAX_SIZE
    });
    this.removedItemsList = [];
    this.options.allowedFileType.forEach((ext) => {
      this.acceptedFormats += '.' + ext + ',';
    });
  }

  public _registerListeners() {
    this.uploaderInstance.onAfterAddingAll = (files: any) => {
      this.filesAdded.emit(this.uploaderInstance.queue.map(file => file._file));
    };

    this.uploaderInstance.onWhenAddingFileFailed = (item, filter, options) => {
      if (filter.name == 'fileSize') {
        this.notifier.showError('File is too large, maximum file size 10mb');
        return;
      } else if (filter.name == 'fileType') {
        this.notifier.showError('This file type, not allowed.');
        return;
      }
    }
  }
}
