import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Injectable } from '@angular/core';

@Injectable()
export class NotifierService {

  constructor(public toastr: ToastsManager) {
  }

  /**
   * Set view container for alert box
   * inited from app.components
   * @param vcr
   */
  public setViewContainer(vcr) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  public showSuccess(message) {
    this.toastr.success(message, 'Success!');
  }

  public showError(message) {
    this.toastr.error(message, 'Error!', {enableHTML: true});
  }

  public showWarning() {
    this.toastr.warning('You are being warned.', 'Alert!');
  }

  public showInfo() {
    this.toastr.info('Just some information for you.');
  }

  public showCustom() {
    // this.toastr.custom('<span style='"color: red">Message in red.</span>', null, {enableHTML: true});
  }
}
