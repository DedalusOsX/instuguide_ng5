import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';

@Injectable()
export class SettingsService {

  public dataStoreObservable$: Observable<any>;
  private dataStore: any = {};

  constructor(private http: Http, private errorCatcher: ErrorCatcherService) {
  }


  public getSettings() {
    if (this.dataStore.settings) {
      return Observable.of(this.dataStore.settings);
    } else if (this.dataStoreObservable$) {
      // if `this.dataStoreObservable$` is set then the request is in progress
      // return the `Observable` for the ongoing request
      return this.dataStoreObservable$;
    }
    this.dataStoreObservable$ = this.http.get('api/common')
      .map(res => {
        // when the cached data is available we don't need the `Observable` reference anymore
        this.dataStoreObservable$ = null;

        let extracted = this.extractData(res);
        this.dataStore.settings = Object.assign({}, extracted.settings);
        return this.dataStore.settings;
      })
      .share()
      .catch(err => this.errorCatcher.handleRequestError(err));

    return this.dataStoreObservable$;
  }

  private extractData(response: any) {
    return response.json() || {};
  }
}
