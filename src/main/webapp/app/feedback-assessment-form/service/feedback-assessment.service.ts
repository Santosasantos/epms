import { Injectable, inject } from '@angular/core';
import {ApplicationConfigService} from "../../core/config/application-config.service";
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackAssessmentService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/drafts');
  getDraft(responderId:number):Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.resourceUrl}/get-feedback-assessment`, {observe: 'response', params: {responderId: responderId}});
  }

  saveDraft(responderId: number, draftData:any):Observable<void>{
    const params = new HttpParams().set('responderId', responderId.toString());
    return this.http.post<void>(`${this.resourceUrl}/save-feedback-assement`, draftData, {
      params: params
    });
  }

  deleteDraft(responderId:number):Observable<HttpResponse<void>>{
    return this.http.delete<void>(`${this.resourceUrl}/delete-feedback-assessment`, {observe: 'response', params: {responderId: responderId}});
  }
}
