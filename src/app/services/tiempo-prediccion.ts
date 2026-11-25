
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SolicitudTiempoPqr {
  type: number | string;
  category: number | string;
  subject: string;
  description: string;
}

export interface RespuestaTiempoPqr {
  prediccion: 'MuyRapido' | 'Rapido' | 'Lento' | 'MuyLento' | string;
  prediccion_legible: string;
  confianza: number;
  probabilidades: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class TiempoPrediccionService {
  private readonly endpoint = `${environment.iaUrl}/predecir`;

  constructor(private http: HttpClient) {}

  predecirTiempo(datos: SolicitudTiempoPqr): Observable<RespuestaTiempoPqr> {
    return this.http.post<RespuestaTiempoPqr>(this.endpoint, datos);
  }
}