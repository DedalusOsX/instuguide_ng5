import {
  ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output,
  SimpleChanges
} from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { DOCUMENT } from '@angular/common';
import { NotifierService } from '../../../../services/notifier.service';

@Component({
  selector: 'image-uploader',
  templateUrl: './image-uploader.component.html'
})

export class ImageUploaderComponent implements OnChanges, OnInit {
  @Input() public options: any;
  @Input() public field: string;
  @Input() public label: string;
  @Input() public theme: string;
  @Input() public view: string = 'circle';

  @Output() public fileUpdated: EventEmitter<any> = new EventEmitter();
  @Output() public fileExternalPreview: EventEmitter<any> = new EventEmitter();

  public ALLOWED_FILE_TYPES: string[] = ['doc', 'docx', 'pdf', 'xls', 'xlxs', 'png', 'jpg', 'jpeg', 'ppt', 'pptx'];
  public FILE_MAX_SIZE: number = 10 * 1024 * 1024;
  public uploaderInstance: FileUploader;
  public defaultOptions: any = {};

  constructor(@Inject(DOCUMENT) private document: any, private notifier: NotifierService, private cd: ChangeDetectorRef) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.files) {
      this._installUploader();
    }
  }

  public ngOnInit() {
    this._installUploader();
    this.registerListeners();
  }

  private _installUploader(options = {}): any {
    for (let key in this.defaultOptions) {
      if (!options.hasOwnProperty(key) || !options[key]) {
        options[key] = this.defaultOptions[key];
      }
    }
    Object.assign(this.options, options);

    this.uploaderInstance = new FileUploader({
      autoUpload: false,
      allowedFileType: this.options.allowedFileType || this.ALLOWED_FILE_TYPES,
      maxFileSize: this.options.maxFileSize || this.FILE_MAX_SIZE,
    });
  }

  private registerListeners() {
    this.uploaderInstance.onAfterAddingFile = (file: FileItem) => {
      this.readFile(file._file, (base64Image: string) => {
        this.options.previewImage = base64Image;
        this.fileExternalPreview.emit(base64Image);
        if (this.options.showAsBackground) {
          let container = <HTMLElement> this.document.querySelector(this.options.showAsBackground);
          if (container) {
            container.style.backgroundImage = `url('${this.options.previewImage}')`;
          }
        }
        this.cd.markForCheck();
      });
      this.fileUpdated.emit(file);
    };

    this.uploaderInstance.onWhenAddingFileFailed = (item, filter, options) => {
      if (filter.name == 'fileSize') {
        this.notifier.showError('File is too large, maximum file size 10mb');
      } else if (filter.name == 'fileType') {
        this.notifier.showError('This file type, not allowed.');
      }
      return;
    };
  }

  private readFile(file: File, callback: Function) {
    if (file) {
      let reader = new FileReader();
      reader.onload = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  }

}
