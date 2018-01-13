import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/observable/throw';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';

@Injectable()
export class UnitsService {

  public ROUTE_URL: string = 'api/units';

  constructor(private http: Http, private errorCatcher: ErrorCatcherService) {
  }

  public createUnit(request) {
    return this.http.post(this.ROUTE_URL, request)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public updateUnit(request, id: string) {
    let url = `${this.ROUTE_URL}/${id}`;
    return this.http.put(url, request)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public removeUnit(id: string) {
    let url = `${this.ROUTE_URL}/${id}`;
    return this.http.delete(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  private extractData(response: Response) {
    return response.json() || {};
  }
}
