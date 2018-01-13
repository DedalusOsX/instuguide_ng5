import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, URLSearchParams } from '@angular/http';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';

import { CourseRest } from '../models/course/course-rest.model';
import { User } from '../models/user/user.model';
import { Course } from '../models/course/course.model';
import { tokenNotExpired } from 'angular2-jwt';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';

@Injectable()
export class UserService {

  public ROUTE_URL = 'api/user';
  public currentUser;

  private _currentUser: BehaviorSubject<any> = new BehaviorSubject<User>(new User());
  private dataStore: any = {
    user: new User(),
    courses: [] as CourseRest[]
  };

  constructor(private http: Http, private errorCatcher: ErrorCatcherService) {
    this.currentUser = this._currentUser.asObservable();
    if (tokenNotExpired()) {
      this.getCurrentUser();
    }
  }

  public getCurrentUser(): any {
    let url = `${this.ROUTE_URL}`;
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.dataStore.user = JSON.parse(user);
      return this._currentUser.next(this.dataStore.user);
    }
    return this.http.get(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err))
      .subscribe((data: any) => this._updateUser(data.user));
  }

  public getUserById(id: string): Observable<any> {
    let url = `${this.ROUTE_URL}/${id}`;
    return this.http.get(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public getUserCourseById(id: string): Observable<any> {
    let course = this.dataStore.courses.find(item => item.id == id);
    if (course) {
      return Observable.of({ course });
    }

    let url = `${this.ROUTE_URL}/course/${id}`;
    return this.http.get(url)
      .map(this.extractData)
      .do(data => {
        this.dataStore.courses.push(data.course);
      })
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public updateProfile(request: FormData) {
    let url = `${this.ROUTE_URL}`;
    return this.http.put(url, request)
      .map((response: Response) => {
        let data = this.extractData(response);
        return this._updateUser(data.user);
      })
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public tryToBookmarkCourse(course: CourseRest, action: string) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('action', action);
    params.set('course', course.id);

    let options = new RequestOptions({ params });
    return this.http.post(this.ROUTE_URL, {}, options)
      .map((response: Response) => {
        // @TODO: need to add course which received from server
        if (action === 'bookmark') {
          this.dataStore.user.bookmarked_courses.push(course);
        } else {
          let ind = this.dataStore.user.bookmarked_courses.findIndex(item => item.id == course.id);
          if (ind > -1) {
            this.dataStore.user.bookmarked_courses.splice(ind, 1);
          }
        }
        return this._updateUser();
      })
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public tryToStartCourse(course: CourseRest) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('action', 'start');
    params.set('course', course.id);

    let options = new RequestOptions({ params });
    return this.http.post(this.ROUTE_URL, {}, options)
      .map((response: Response) => {
        // @TODO: need to add course which received from server
        this.addNewCourse(course);
      })
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public addNewCourse(course: any) {
    // if (course.id) {
    //   let reservedCourse = this.dataStore.user.courses.findIndex(c => c.id === course.id);
    //   if (reservedCourse > -1) {
    //     this.dataStore.user.courses[reservedCourse] = Object.assign({}, course);
    //   }
    // } else {
    let _course = {
      name: course.name,
      avatar: course.avatar,
      created_by: course.created_by,
      code: course.code,
      id: course.id || course._id
    };
    this.dataStore.user.courses.push(_course);
    // }
    this._updateUser();
  }

  public isTeacher() {
    return this.dataStore.user.role === 'teacher';
  }

  public isBookmarkBelongsUser(courseId: string) {
    return this.dataStore.user.bookmarked_courses
      && this.dataStore.user.bookmarked_courses.some(item => item.id === courseId);
  }

  public isCourseBelongsUser(courseId: string) {
    return this.dataStore.user.courses
      && this.dataStore.user.courses.some(item => item.id === courseId);
  }

  public clearSession() {
    localStorage.removeItem('currentUser');
    this.dataStore.user = new User();
    this._currentUser.next(this.dataStore.user);
  }

  private _updateUser(user = this.dataStore.user) {
    this.dataStore.user = Object.assign({}, user);
    localStorage.setItem('currentUser', JSON.stringify(this.dataStore.user));
    this._currentUser.next(this.dataStore.user);
    return user;
  }

  private extractData(response: any) {
    return response.json() || {};
  }

}
