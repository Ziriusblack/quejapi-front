import { Component, inject, OnInit } from '@angular/core';
import { PaginationControls } from '../../../components/pagination/pagination-controls/pagination-controls';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComplaintSearchRequest } from '../../../models/complaint-search-request';
import { ComplaintService } from '../../services/complaint-service';
import { PageResponse } from '../../../models/page-response';
import { Router } from '@angular/router';
import { NavigationBar } from '../../../components/navigation-bar/navigation-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  imports: [ReactiveFormsModule, PaginationControls, NavigationBar, DatePipe],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {
  private complaintService = inject(ComplaintService);
  private router = inject(Router);
  page = 1;
  totalItems = 0;
  pageSize = 5;
  complaints: any[] = [];
  loading = false;
  error: string | null = null;

  // Sort
  sortBy = 'recievedDate';
  sortDir = 'desc';

  statusOptions = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Abierto' },
    { value: 2, label: 'En Progreso' },
    { value: 3, label: 'Resuelto' },
    { value: 4, label: 'Cerrado' }
  ];

  typeNames = [
    "Petición",
    "Queja",
    "Reclamo",
    "Sugerencia",
    "Felicitación"
  ];

  // Search form
  searchForm = new FormGroup({
    searchTerm: new FormControl(''),
    status: new FormControl(0)
  });

  ngOnInit(): void {
    this.loadData();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    console.log('New Page:', this.page);
    this.loadData();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.loadData();
  }

  searchComplaints() {
    this.page = 1;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = null;
    let search: ComplaintSearchRequest = {
      searchTerm: this.searchForm.value.searchTerm || null,
      status: Number(this.searchForm.value.status) === 0 ? null : (Number(this.searchForm.value.status) - 1),
      page: (this.page - 1),
      size: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDir
    }

    this.complaintService.searchComplaints(search).subscribe({
      next: (response: PageResponse) => {
        this.complaints = response.content;
        this.totalItems = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading complaints: ' + error.message;
        this.loading = false;
        this.complaints = [];
      }
    });

  }

  viewComplaint(id: string) {
    this.router.navigate(['/user/complaints', id]);
  }

  classForStatus(status: any): string {
    let numberstatus: number = Number.parseInt(status);
    let classes = 'px-2 py-1 text-xs font-semibold rounded-full ';
    if (numberstatus >= 0 && numberstatus < 4) {
      switch (numberstatus) {
        case 0: return classes + 'bg-blue-100 text-blue-700 border border-blue-300';
        case 1: return classes + 'bg-yellow-100 text-yellow-700 border border-yellow-300';
        case 2: return classes + 'bg-green-100 text-green-700 border border-green-300';
        case 3: return classes + 'bg-red-100 text-red-700 border border-red-300';
        default: return classes + 'bg-gray-100 text-gray-700 border border-gray-300';
      }
    }
    return classes + 'bg-gray-100 text-gray-700';
  }

  labelForStatus(status: any): string {
    let numberstatus: number = Number.parseInt(status);
    if (numberstatus >= 0 && numberstatus < 4) {
      switch (numberstatus) {
        case 0: return 'Abierto';
        case 1: return 'En Progreso';
        case 2: return 'Resuelto';
        case 3: return 'Cerrado';
        default: return 'Desconocido';
      }
    }
    return 'Desconocido';
  }

  classForType(type:any): string {
    let typeNumber: number = Number.parseInt(type);
    let classes = 'font-medium text-sm line-clamp-2 flex items-center gap-2';
    if (typeNumber >= 0 && typeNumber < 5) {
      switch (typeNumber) {
        case 0: return classes + ' text-blue-600';
        case 1: return classes + ' text-red-600';
        case 2: return classes + ' text-orange-600';
        case 3: return classes + ' text-green-600';
        case 4: return classes + ' text-purple-600';
        default: return classes + ' text-gray-600';
      }
    }
    return classes + 'text-gray-600';
  }

  showTypeName(typeCode: number): string {
    if (typeCode >= 0 && typeCode < this.typeNames.length) {
      return this.typeNames[typeCode];
    }
    return "Desconocido";
  }

}
