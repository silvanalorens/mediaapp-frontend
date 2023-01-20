import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../model/patient';
import { PatientSign } from '../model/patientSign';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignService extends GenericService<PatientSign> {
  private patientSignChange = new Subject<PatientSign[]>;
  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(http,
      `${environment.HOST}/signs`)
   }

   listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

   findPatientById(id: number): Observable<Patient> {
    return this.http.get<any>(`${this.url}/parent/${id}`);
  }
  setPatientSignChange(data: PatientSign[]){
    this.patientSignChange.next(data);
  }

  getPatientSignChange(){
    return this.patientSignChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
