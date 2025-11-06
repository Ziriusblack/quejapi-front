import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ComplaintSearchRequest } from '../../models/complaint-search-request';
import { PageResponse } from '../../models/page-response';
import { CreatedComplaint } from '../../models/created-complaint';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  private apiUrl = environment.apiUrl + '/admin';
  private http = inject(HttpClient);
  
  public searchComplaints(request: ComplaintSearchRequest) {
    return this.http.post<PageResponse>(`${this.apiUrl}/complaints`, request);
  }

  public getComplaint(id: string) {
    return this.http.get(`${this.apiUrl}/complaints/${id}`);
  }
  
  public updateComplaint(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/complaints/${id}`, data);
  }
 
}
