import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PQRSStatistics } from '../../models/pqrsstatistics';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = environment.apiUrl + '/stats';
  private http = inject(HttpClient);

  public getStatistics(params?: any) {
    return this.http.get<PQRSStatistics>(`${this.apiUrl}/overview`, { params });
  }

  getPriorityComplaints() {
  return this.http.get<any[]>('http://localhost:8080/api/stats/priorities');
}
}
