import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ManageService } from '../../services/manage-service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationBar } from "../../../components/navigation-bar/navigation-bar";

@Component({
  selector: 'app-manage-complaint',
  imports: [DatePipe, ReactiveFormsModule, NavigationBar],
  templateUrl: './manage-complaint.html',
  styleUrl: './manage-complaint.css'
})
export class ManageComplaint {
  private manageService = inject(ManageService);
  private activatedRoute = inject(ActivatedRoute);
  complaintId = signal<string | null>(null);
  complaint:any = null;

  loading = false;
  error: string | null = null;

  statusNames = ["Pendiente","En progreso","Resuelta","Cerrada"];  
  categoryNames = [
    "Servicio de Buses",
    "Tarifas y Pagos",
    "Horarios", 
    "Rutas",
    "Infraestructura",
    "Atención al cliente",
    "Accesibilidad",
    "Seguridad",
    "Otros"
  ];

  typeNames = [
    "Petición",
    "Queja",
    "Reclamo",
    "Sugerencia",
    "Felicitación"
  ];

  complaintForm = new FormGroup({    
    status: new FormControl(0,[ Validators.required]),
    department: new FormControl(''),
    response: new FormControl('',[ Validators.maxLength(800)])
  });

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.setUpComplaintId(params);
      this.setUpView();     
    });
  }

  setUpComplaintId(params:Params){
    if (this.checkIfParamHasValue(params,'id')) {
      this.complaintId.set(params['id']);
      return;
    } 
    
    this.complaintId.set(null);
    return;
  }

  checkIfParamHasValue(params:any, key:string): boolean {
    return params[key] !== undefined && params[key] !== null && params[key] !== '';
  }

  setUpView() {
    if (this.complaintId()) {
      this.loadComplaint(this.complaintId()!);
    } else {
      this.error = 'Invalid complaint ID';
      this.complaint = null;
      this.loading = false;    
    }
  }

  public loadComplaint(id: string) {
    this.loading = true;
    this.error = null;
    this.manageService.getComplaint(id).subscribe({
      next: (response) => {
        this.complaint = response;
        this.initializateForm();      
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading complaint: ' + error.message;
        this.loading = false;
        this.complaint = null;
      }
    });
  }

  initializateForm() {
    if (this.complaint) {
      this.complaintForm.patchValue({
        status: this.complaint.status||0, 
        department: this.complaint.department||'', 
        response: this.complaint.response||''
      });
    }
  }

  updateComplaint() {
    if (!this.complaintId()) {
      this.error = 'Invalid complaint ID';
      return;
    }
    let id = this.complaintId()!;
    let updateRequest:any = {
      status: Number(this.complaintForm.value.status)||0,
      department: this.complaintForm.value.department||'',
      response: this.complaintForm.value.response||''     
    }
    this.loading = true;
    this.error = null;    
    this.manageService.updateComplaint(id, updateRequest).subscribe({
      next: (response) => {
        this.complaint = response; 
        console.log(this.complaint); 
        this.initializateForm();     
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error actualizando radicado: ' + error.message;
        this.loading = false;
        this.complaint = null;
      }
    });
  }

  showStatusName(statusCode: number): string {
    if (statusCode >=0 && statusCode < this.statusNames.length) {
      return this.statusNames[statusCode];
    }
    return "Desconocido";
  }

  showCategoryName(categoryCode: number): string {
    if (categoryCode >=0 && categoryCode < this.categoryNames.length) {
      return this.categoryNames[categoryCode];
    }
    return "Desconocida";
  }
  showTypeName(typeCode: number): string {
    if (typeCode >=0 && typeCode < this.typeNames.length) {
      return this.typeNames[typeCode];
    }
    return "Desconocido";
  }

  showUserFullName(user:any): string {
    if (user && user.name && user.lastname) {
      return user.name + ' ' + user.lastname;
    }
    return "Anónimo";
  }

  showUserEmail(user:any): string {
    if (user && user.email) {
      return user.email;
    }
    return "No proporcionado";
  }

  showPerformedBy(trace:any): string {
    if (trace && trace.performedBy) {
      return trace.performedBy;
    }
    return "Sistema";
  }

  get status() { return this.complaintForm.get('status'); }
  get department() { return this.complaintForm.get('department'); } 
  get response() { return this.complaintForm.get('response'); }
}
