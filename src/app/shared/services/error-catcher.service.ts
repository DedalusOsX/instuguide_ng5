import { ErrorHandler, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorCatcherService implements ErrorHandler {

  constructor(private router: Router) {
  }

  public handleError(error): void {
    console.error(error);
  }

  public handleRequestError(error: any): any {
    if (error) {
      let err = {} as any;
      if (error instanceof Error) {
        err.fullMessage = error.message.toString();
      } else {
        err = error.json();
        err.fullMessage = '';
        if (err.errors) {
          err.errors.forEach(item => err.fullMessage += `${item.message} <br>`);

          switch (error.status) {
            case 400: // BAD REQUEST (validation error)
              return Observable.throw(err);
            case 401: // UnAuthorize
              return Observable.throw(err);
            case 404: // Internal
              this.router.navigate(['/404.html']);
              return Observable.throw(err);
            case 500: // Internal
              return Observable.throw(err);
            default:
              return Observable.throw(err);

          }
        }
        return Observable.throw(err);
      }

      return Observable.throw(err);
    }
  }

  public generateError(message: string | string[]) {
    let output = {
      errors: []
    };
    message = !Array.isArray(message) && [message];
    message.forEach(msg => {
      output.errors.push({
        message: msg.toString()
      });
    });
    return output;
  }

  public setFieldError(err, form) {
    let errorExist = false;
    if (err.errors) {
      err.errors.forEach(item => {
        if (item.params) {
          for (let key in form.controls) {
            if (key == item.params.field) {
              errorExist = true;
              form.controls[key].markAsTouched();
              form.controls[key].setErrors({}, errorExist);
            }
          }
        }
      });
    }

    if (errorExist) {
      window.scrollTo(0, 100);
    }

  }

  public logErrorToServer(err) {
    // make http call to server
    console.log(err);
  }
}
