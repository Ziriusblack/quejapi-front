import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreatedComplaint } from '../../models/created-complaint';
import { ComplaintRequest } from '../../models/complaint-request';
import { ComplaintSearchRequest } from '../../models/complaint-search-request';
import { PageResponse } from '../../models/page-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = environment.apiUrl + '/user';
  private http = inject(HttpClient);

  public createComplaint(complaint: ComplaintRequest) {
    return this.http.post<CreatedComplaint>(`${this.apiUrl}/complaint`, complaint);
  }

  public getComplaint(id: string) {
    return this.http.get(`${this.apiUrl}/complaints/${id}`);
  }

  public searchComplaints(request: ComplaintSearchRequest) {
    return this.http.post<PageResponse>(`${this.apiUrl}/complaints`, request);
  }
}
