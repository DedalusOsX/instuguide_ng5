import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';

@Injectable()
export class GradesService {

  public ROUTE_URL: string = 'api/grades';

  constructor(private http: Http, private errorCatcher: ErrorCatcherService) { }

  public getCourseGPA(courseId?: string) {
    let url = `${this.ROUTE_URL}/course-gpa-dynamics`;
    if (courseId) {
      url += `/${courseId}`;
    }
    return this.http.get(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public getCourseDeliverable(courseId?: string) {
    let url = `${this.ROUTE_URL}/course-dynamics`;
    if (courseId) {
      url += `/${courseId}`;
    }
    return this.http.get(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public getCourseGrades(courseId: string) {
    let url = `${this.ROUTE_URL}/table-of-course-grades/${courseId}`;
    return this.http.get(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  private extractData(response: Response) {
    return response.json() || {};
  }
}
