import { Component, inject } from '@angular/core';
import { ComplaintService } from '../../services/complaint-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComplaintRequest } from '../../../models/complaint-request';
import { Router, RouterLink } from '@angular/router';
import { NavigationBar } from '../../../components/navigation-bar/navigation-bar';
import { RadioCard } from '../../../components/radio-card/radio-card';

@Component({
  selector: 'app-create-complaint',
  imports: [ReactiveFormsModule, NavigationBar, RouterLink, RadioCard],
  templateUrl: './create-complaint.html',
  styleUrl: './create-complaint.css'
})
export class CreateComplaint {
  private complaintService = inject(ComplaintService);
  private router = inject(Router);
  
  complaintForm = new FormGroup({
    type: new FormControl(null, [Validators.required]),
    category: new FormControl(0, [Validators.required]),
    subject: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(800)])
  });
  errorMessage: string | null = null;

  categoryOptions = [
    {label:"Servicio de Buses", value:0},
    {label:"Tarifas y Pagos", value:1},
    {label:"Horarios", value:2},
    {label:"Rutas", value:3},
    {label:"Infraestructura", value:4},
    {label:"Atención al cliente", value:5},
    {label:"Accesibilidad", value:6},
    {label:"Seguridad", value:7},
    {label:"Otros", value:8}
  ];

  typeOptions = [
    {label:"Petición", value:0, icon:"📋"},
    {label:"Queja", value:1, icon:"😞"},
    {label:"Reclamo", value:2, icon:"⚠️"},
    {label:"Sugerencia", value:3, icon:"💡"},
    {label:"Felicitación", value:4, icon:"🎉"}
  ];

  createComplaint() {
    let registerRequest:ComplaintRequest = {
      type: this.complaintForm.value.type ?? 0,
      category: Number(this.complaintForm.value.category) || 0,
      subject: this.complaintForm.value.subject || '',
      description: this.complaintForm.value.description || ''     
    }
    console.log(registerRequest);
    
    this.complaintService.createComplaint(registerRequest).subscribe({
      next: (response) => {
        console.log('Queja creada con éxito');
        this.router.navigate(['/user']);        
      },
      error: (error) => {
        this.errorMessage = 'Parace que hubo un error intente nuevamente un momento.';
      }
    }); 
  }

  get type() { return this.complaintForm.get('type.selected'); }
  get category() { return this.complaintForm.get('category'); } 
  get subject() { return this.complaintForm.get('subject'); }
  get description() { return this.complaintForm.get('description');}
}
