import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PQRSStatistics } from '../../../models/pqrsstatistics';
import { StatsService } from '../../services/stats-service';
import { NavigationBar } from '../../../components/navigation-bar/navigation-bar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule,NavigationBar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit{
  statistics = signal<PQRSStatistics | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  startDate = signal<string>('');
  endDate = signal<string>('');
  
  selectedView = signal<'overview' | 'employees' | 'trends'>('overview');
  private pqrsService = inject(StatsService);

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading.set(true);
    this.error.set(null);
    
    const params: any = {};
    if (this.startDate()) params.startDate = this.startDate();
    if (this.endDate()) params.endDate = this.endDate();

    this.pqrsService.getStatistics(params).subscribe({
      next: (data) => {
        this.statistics.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar las estadísticas');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.loadStatistics();
  }

  clearFilters(): void {
    this.startDate.set('');
    this.endDate.set('');
    this.loadStatistics();
  }

  getStatusPercentage(count: number): number {
    const total = this.statistics()?.totalPqrs || 1;
    return Math.round((count / total) * 100);
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  getObjectValue(obj: any, key: string): number {
    return obj?.[key] || 0;
  }

  changeView(view: 'overview' | 'employees' | 'trends'): void {
    this.selectedView.set(view);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Radicada': 'bg-blue-500',
      'En Revisión': 'bg-yellow-500',
      'En Proceso': 'bg-orange-500',
      'Cerrada': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  }

  getTypeColorClass(type: string): string {
    const colors: { [key: string]: string } = {
      'Petición': 'bg-gradient-to-br from-blue-400 to-blue-500',
      'Queja': 'bg-gradient-to-br from-red-400 to-red-500',
      'Reclamo': 'bg-gradient-to-br from-orange-400 to-orange-500',
      'Sugerencia': 'bg-gradient-to-br from-green-400 to-green-500'
    };
    return colors[type] || 'bg-gradient-to-br from-gray-400 to-gray-500';
  }

  formatMonth(month: string): string {
    const [year, monthNum] = month.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[parseInt(monthNum) - 1]} ${year}`;
  }

  getMaxTrendValue(): number {
    const trends = this.statistics()?.monthlyTrends || [];
    return Math.max(...trends.map(t => Math.max(t.totalReceived, t.totalResolved))) || 100;
  }

  getTrendBarHeight(value: number): number {
    const max = this.getMaxTrendValue();
    return (value / max) * 100;
  }

  getEfficiencyClass(received: number, resolved: number): string {
    const efficiency = (resolved / received) * 100;
    if (efficiency >= 80) return 'bg-green-100 text-green-800';
    if (efficiency >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  calculateEfficiency(received: number, resolved: number): number {
    return Math.round((resolved / received) * 100);
  }
}
