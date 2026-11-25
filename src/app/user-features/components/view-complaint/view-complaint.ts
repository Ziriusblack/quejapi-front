import { Component, inject, signal } from '@angular/core';
import { ComplaintService } from '../../services/complaint-service';
import { TiempoPrediccionService, RespuestaTiempoPqr } from '../../../services/tiempo-prediccion';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NavigationBar } from "../../../components/navigation-bar/navigation-bar";

@Component({
  selector: 'app-view-complaint',
  imports: [DatePipe, NavigationBar, RouterLink],
  templateUrl: './view-complaint.html',
  styleUrl: './view-complaint.css'
})
export class ViewComplaint {
  private complaintService = inject(ComplaintService);
  private tiempoPrediccionService = inject(TiempoPrediccionService);
  private activatedRoute = inject(ActivatedRoute);

  complaintId = signal<string | null>(null);
  complaint: any = null;

  loading = false;
  error: string | null = null;

  // Predicción automática de tiempo de respuesta
  prediccionTiempo = signal<RespuestaTiempoPqr | null>(null);
  cargandoPrediccion = signal(false);

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

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.setUpComplaintId(params);
      this.setUpView();     
    });
  }

  setUpComplaintId(params: Params) {
    if (this.checkIfParamHasValue(params, 'id')) {
      this.complaintId.set(params['id']);
      return;
    } 
    this.complaintId.set(null);
  }

  checkIfParamHasValue(params: any, key: string): boolean {
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
    this.complaintService.getComplaint(id).subscribe({
      next: (response) => {
        this.complaint = response;               
        this.loading = false;
        this.obtenerEstimacionTiempo(response);
      },
      error: (error) => {
        this.error = 'Error loading complaint: ' + error.message;
        this.loading = false;
        this.complaint = null;
      }
    });
  }

  private obtenerEstimacionTiempo(pqr: any) {
    this.cargandoPrediccion.set(true);
    this.tiempoPrediccionService.predecirTiempo({
      type: pqr.type ?? 0,
      category: pqr.category ?? 0,
      subject: pqr.subject || '',
      description: pqr.description || ''
    }).subscribe({
      next: (res) => {
        this.prediccionTiempo.set(res);
        this.cargandoPrediccion.set(false);
      },
      error: () => {
        this.cargandoPrediccion.set(false);
      }
    });
  }

  showStatusName(statusCode: number): string {
    if (statusCode >= 0 && statusCode < this.statusNames.length) {
      return this.statusNames[statusCode];
    }
    return "Desconocido";
  }

  showCategoryName(categoryCode: number): string {
    if (categoryCode >= 0 && categoryCode < this.categoryNames.length) {
      return this.categoryNames[categoryCode];
    }
    return "Desconocida";
  }

  showTypeName(typeCode: number): string {
    if (typeCode >= 0 && typeCode < this.typeNames.length) {
      return this.typeNames[typeCode];
    }
    return "Desconocido";
  }

  showUserFullName(user: any): string {
    if (user && user.name && user.lastname) {
      return user.name + ' ' + user.lastname;
    }
    return "Anónimo";
  }

  showUserEmail(user: any): string {
    if (user && user.email) {
      return user.email;
    }
    return "No proporcionado";
  }

  showPerformedBy(trace: any): string {
    if (trace && trace.performedBy) {
      return trace.performedBy;
    }
    return "Sistema";
  }
}