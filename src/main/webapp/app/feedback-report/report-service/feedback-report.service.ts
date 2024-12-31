import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {ApplicationConfigService} from "../../core/config/application-config.service";
import { Observable, map } from 'rxjs';
import {IEmployee} from "../../entities/employee/employee.model";
import {IRatingScale} from "../../entities/rating-scale/rating-scale.model";
export type EntityResponseTypeforEmployee = HttpResponse<IEmployee>;
export type EntityResponseTypeforRating = HttpResponse<IRatingScale>;

@Injectable({
  providedIn: 'root'
})
export class FeedbackReportService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrlforfeedbackdetails = this.applicationConfigService.getEndpointFor('api/feedback-details');
  protected resourceUrlforemployees = this.applicationConfigService.getEndpointFor('api/employees');
  protected resourceUrlforratings = this.applicationConfigService.getEndpointFor('api/ratings');
  findByPin(pin: string): Observable<EntityResponseTypeforEmployee> {
    return this.http
      .get<EntityResponseTypeforEmployee>(`${this.resourceUrlforemployees}/pin/${pin}`);
  }

  fetchRatingfromOthers(pin: string, feedbacksubname: string, year: number): Observable<number> {
    const params = new HttpParams()
      .set('pin', pin)
      .set('feedbacksubname', feedbacksubname)
      .set('year', year);
    return this.http.get<number>(`${this.resourceUrlforfeedbackdetails}/fetchratingfromothers`,{params})
      .pipe(
        map(res => res ?? null)
      );
  }

  fetchRatingforSelf(pin: string, feedbacksubname: string, year: number): Observable<number> {
    const params = new HttpParams()
      .set('pin', pin)
      .set('feedbacksubname', feedbacksubname)
      .set('year', year);
    return this.http.get<number>(`${this.resourceUrlforfeedbackdetails}/fetchratingforself`,{params})
      .pipe(
        map(res => res ?? null)
      );


  }

  findbyratingvalue(ratingvalue: number): Observable<HttpResponse<IRatingScale>> {
    return this.http.get<IRatingScale>(`${this.resourceUrlforratings}/getrating/${ratingvalue}`, { observe: 'response' });
  }
}
