import { Component, Input, OnChanges } from '@angular/core';
import { ErrorModel } from '../../models/error.model';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
})

export class AlertComponent implements OnChanges {
  @Input() public errorResponse: ErrorModel;

  public errors: string[];

  constructor() {
    //  constructor
  }

  public ngOnChanges(changes) {
    this.showError(changes.errorResponse.currentValue);
  }

  private showError(err: any) {
    this.errors = [];
    if (err.errors.length) {
      err.errors.forEach(error => {
        this.errors.push(error.message);
      });
    } else {
      this.errors.push('Something going wrong.');
    }
  }
}
