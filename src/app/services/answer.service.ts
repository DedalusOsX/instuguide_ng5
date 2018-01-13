import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/share';
import { ErrorCatcherService } from '../shared/services/error-catcher.service';

@Injectable()
export class AnswerService {

  public ROUTE_URL = 'api/answers';
  private dataStore: any = {
    answers: {}
  };

  constructor(private http: Http, private errorCatcher: ErrorCatcherService) {
  }


  public getMaterialAnswers(courseId: string, materialId: string): Observable<any> {
    let url = `${this.ROUTE_URL}/${materialId}`;

    if (this.dataStore.answers.hasOwnProperty(materialId)) {
      return this.dataStore.answers[materialId];
    }

    return this.http.get(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public submitAnswer(answer: any) {
    let url = `${this.ROUTE_URL}`;
    if (answer.id) {
      url += `/${answer.id}`;
    }

    let request = this.prepareRequest(answer);

    return this.http[answer.id ? 'put' : 'post'](url, request)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public submitGrade(student: any) {
    let url = this.ROUTE_URL;
    if (student.answer_id) {
      url += `/${student.answer_id}`;
    }
    let request = this.prepareRequest(student);
    return this.http[student.answer_id ? 'put' : 'post'](url, request)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  private extractData(response: any) {
    return response.json() || {};
  }

  private prepareRequest(material): FormData {
    let formData = new FormData(); // Currently empty
    let _material = Object.assign(material);

    if (_material.reviewed) {
      _material.reviewed.forEach(file => {
        formData.append('reviewed[]', file);
      });
    }
    if (_material.content) {
      _material.content.forEach(file => {
        formData.append('content[]', file);
      });
    }

    let json = Object.assign({}, _material);
    delete _material.content;
    delete _material.reviewed;
    formData.append('fields', JSON.stringify(json));

    return formData;
  }
}
