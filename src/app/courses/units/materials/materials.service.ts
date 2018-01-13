import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ErrorCatcherService } from '../../../shared/services/error-catcher.service';
import 'rxjs/add/observable/throw';

@Injectable()
export class MaterialsService {

  private ROUTE_URL: string = 'api/units';

  constructor(private http: Http, private errorCatcher: ErrorCatcherService) {
  }

  public submitMaterial(unitId: string, material: any) {
    let url = `${this.ROUTE_URL}/${unitId}/materials`;
    if (material.id) {
      url += `/${material.id}`;
    }
    let request = this.prepareRequest(material);
    return this.http[material.id ? 'put' : 'post'](url, request)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  public getVimeoVideo(materialId) {
    let url = `${this.ROUTE_URL}/vimeo/${materialId}`;

    return this.http.get(url)
      .map(this.extractData)
      .catch(err => this.errorCatcher.handleRequestError(err));
  }

  private extractData(response: Response) {
    return response.json() || {};
  }

  private prepareRequest(material): FormData {
    let formData = new FormData(); // Currently empty
    let _material = Object.assign({}, material);

    if (_material.media) {
      _material.media.forEach(file => {
        formData.append('media', file);
      });
    }

    if (_material.solutions) {
      _material.solutions.forEach(file => {
        formData.append('solutions', file);
      });
    }

    let json = Object.assign({}, _material);

    if (_material.type === 'assignment') {
      json.end_date = new Date(json.end_date).setHours(Math.floor(json.end_time / 60), json.end_time % 60, 0, 0);
    } else {
      json.start_date = new Date(json.end_date).setHours(Math.floor(json.start_time / 60), json.start_time % 60, 0, 0);
      json.end_date = new Date(json.end_date).setHours(Math.floor(json.end_time / 60), json.end_time % 60, 0, 0);
    }
    delete json._new;
    delete json.solutions;
    delete json.media;
    formData.append('fields', JSON.stringify(json));
    return formData;
  }
}
