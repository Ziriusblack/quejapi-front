import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { RouterLink } from "@angular/router";
import { StatsService } from '../../admin-features/services/stats-service';
import { PQRSStatistics } from '../../models/pqrsstatistics';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavigationBar, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  statistics = signal<PQRSStatistics | null>(null);

  private statsService = inject(StatsService);

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statsService.getStatistics({}).subscribe({
      next: (data) => {
        this.statistics.set(data);
      },
      error: (err) => {
        console.error('Error cargando estadísticas', err);
      }
    });
  }

  features = [
    {
      icon: 'zap',
      title: 'Gestión Rápida',
      description: 'Procesa quejas y reclamos en tiempo real'
    },
    {
      icon: 'shield',
      title: 'Seguimiento Seguro',
      description: 'Rastreo completo de cada solicitud'
    },
    {
      icon: 'users',
      title: 'Para la Comunidad',
      description: 'Mejorando el servicio de transporte público'
    }
  ];

  collageImages = [
    {
      src: 'assets/img/transcaribe.png',
      alt: 'Bus Transcaribe',
      title: 'Sistema PQRS'
    },
    {
      src: 'assets/img/seguimiento.jpg',
      alt: 'Dashboard de seguimiento',
      title: 'Seguimiento'
    },
    {
      src: 'assets/img/comunidad.jpg',
      alt: 'Comunidad de usuarios',
      title: 'Comunidad'
    },
    {
      src: 'assets/img/rapido.png',
      alt: 'Respuesta rápida',
      title: 'Respuesta Rápida'
    }
  ];
}