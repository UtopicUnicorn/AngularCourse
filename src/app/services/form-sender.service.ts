import { of, Observable } from 'rxjs';
import { map,catchError, delay } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';import { Injectable } from '@angular/core';
import { SendFormEntity } from '../shared/from-ent';


@Injectable({
  providedIn: 'root'
})
export class FormSenderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService:ProcessHTTPMsgService) { }


  getVacancies(): Observable<SendFormEntity[]>{
    return this.http.get<SendFormEntity[]>(baseURL + 'vacancy').pipe(catchError(this.processHTTPMsgService.handleError));
  }



  postForm(sendForm:SendFormEntity): Observable<SendFormEntity>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Conent-Type': 'application/json'
      })
    };
    return this.http.post<SendFormEntity>(baseURL + 'vacancy', sendForm, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
