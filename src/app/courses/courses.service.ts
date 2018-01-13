import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';

@Injectable()
export class CoursesService {

  public courses: any[] = [];
  public ROUTE_URL: string = 'api/courses';

  constructor(private http: Http, private errorCatcher: ErrorCatcherService) {
  }

  public getCourses(query): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    for (let key in query) {
      if (query.hasOwnProperty(key)) {
        params.append(key.toString(), query[key]);
      }
    }
    return this.http.get(this.ROUTE_URL, { params })
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public getCourseById(id: string, expand?: string[]): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    let options;

    if (expand) {
      expand.forEach(option => {
        params.append('expand', option);
      });
    }
    let url = `${this.ROUTE_URL}/${id}`;
    return this.http.get(url, { params })
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public submitCourse(request: any, courseId?: string): Observable<any> {
    let method = 'post';
    let url = this.ROUTE_URL;
    if (courseId) {
      url += '/' + courseId;
      method = 'put';
    }
    return this.http[method](url, request)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  private extractData(response: Response) {
    return response.json() || {};
  }

}
