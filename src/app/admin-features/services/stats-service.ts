import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PQRSStatistics } from '../../models/pqrsstatistics';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = environment.apiUrl + '/stats';
  private http = inject(HttpClient);

  public getStatistics(params?: any) {
    return this.http.get<PQRSStatistics>(`${this.apiUrl}/overview`, { params });
  }

  getPriorityComplaints(params?: any): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/priorities`, { params });
    }
}