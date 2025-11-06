import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination-controls',
  imports: [],
  templateUrl: './pagination-controls.html',
  styleUrl: './pagination-controls.css'
})
export class PaginationControls implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  totalPages: number = 0;
  pageRange: number[] = [];

  maxPageButtons: number = 7;  // Number of page buttons to show at once

  ngOnChanges(changes: SimpleChanges): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = Math.min(Math.max(this.currentPage, 1), this.totalPages || 1);
    this.pageRange = this.calculatePageRange();
  }

  private calculatePageRange(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxButtons = this.maxPageButtons;
    const halfRange = Math.floor(maxButtons / 2);

    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1);
    } else if (current <= halfRange + 1) {
      // Beginning range
      return Array.from({ length: maxButtons }, (_, i) => i + 1);
    } else if (current >= total - halfRange) {
      // Ending range
      return Array.from({ length: maxButtons }, (_, i) => total - maxButtons + 1 + i);
    } else {
      // Middle range
      return Array.from({ length: maxButtons }, (_, i) => current - halfRange + i);
    }
  }

  goToPage(page: number) {    
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;   
    this.pageChange.emit(this.currentPage);
    this.pageRange = this.calculatePageRange();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  firstPage() {
    this.goToPage(1);
  }

  lastPage() {
    this.goToPage(this.totalPages);
  }

  onPageSizeChange(event: Event) {
    const newSize = Number((event.target as HTMLSelectElement).value);
    if (newSize !== this.pageSize) {
      this.pageSize = newSize;
      this.pageSizeChange.emit(this.pageSize);

      // Reset to first page on page size change
      this.goToPage(1);
    }
  }
}
