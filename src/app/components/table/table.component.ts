import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    TableModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    PaginatorModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnChanges {
  @Input() columns: { field: string; title?:string; header: string; type?: string; colorMap?: any; value?: any , tooltipText?: any, actions? : any[], icon?:any }[] = [];
  @Input() data: T[] = [];
  @Input() showPaginator: boolean = true;
  @Input() actions: { icon: string, action: (row: any) => void }[] = [];
  @Input() totalRecords: number = 0;
  @Input() transparentHeader: boolean = false;
  paginatedData: any[] = [];
  rowsPerPage = 10; // Default rows per page - aligned with template
  currentPage = 0;
  @Input() sortOrder: number = 1;
  first = 0; // Track first record index

  @Output() lazyLoad = new EventEmitter<any>();
  @Output() checkboxChange = new EventEmitter<{ row: any, checked: boolean }>();

  ngOnInit() {
    // Initialize pagination with proper setup
    this.initializePagination();
  }

  ngOnChanges(changes: SimpleChanges) {
    // When data changes, update pagination
    if (changes['data'] && this.data) {
      // Reset to first page when data changes
      this.first = 0;
      this.currentPage = 0;
      
      // Set total records if not provided
      if (!this.totalRecords) {
        this.totalRecords = this.data.length;
      }
      
      // Update pagination display
      this.updatePagination();
    }
  }

  private initializePagination() {
    // Initialize with first page if paginator is enabled
    if (this.showPaginator) {
      this.updatePagination();
    } else {
      // If no paginator, show all data
      this.paginatedData = [...this.data];
    }
  }
  
  private updatePagination() {
    // Handle empty data
    if (!this.data || this.data.length === 0) {
      this.paginatedData = [];
      return;
    }

    // Trigger lazy load event for current page
    this.onLazyLoad({
      first: this.first,
      rows: this.rowsPerPage,
      sortField: null,
      sortOrder: this.sortOrder,
      filters: {},
    });
  }

  getTagColor(value: string): string {
    return this.columns.find(col => col.colorMap && col.colorMap[value])?.colorMap[value] || 'gray';
  }

  onLazyLoad(event: any) {
    // Update internal state
    this.first = event.first || 0;
    this.rowsPerPage = event.rows || this.rowsPerPage;
    this.currentPage = Math.floor(this.first / this.rowsPerPage);
    
    // Emit event for parent component to handle server-side pagination if needed
    this.lazyLoad.emit(event);
    
    // If parent component is handling pagination (has lazyLoad subscribers), don't do local pagination
    if (this.lazyLoad.observed) {
      return;
    }
    
    // Perform local pagination
    this.performLocalPagination(this.first, this.rowsPerPage);
  }
  
  private performLocalPagination(first: number, rows: number) {
    // Calculate start and end indices
    const startIndex = first;
    const endIndex = first + rows;
    
    // Slice data for current page
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    this.first = event.first ?? (this.currentPage * this.rowsPerPage);
    
    // Update pagination display
    this.onLazyLoad({
      first: this.first,
      rows: this.rowsPerPage,
      sortField: null,
      sortOrder: this.sortOrder,
      filters: {},
    });
  }
  
  // Utility method to reset pagination to first page
  resetPagination() {
    this.first = 0;
    this.currentPage = 0;
    this.updatePagination();
  }
  
  // Utility method to get current pagination info
  getPaginationInfo() {
    return {
      currentPage: this.currentPage + 1, // 1-based for display
      totalPages: Math.ceil((this.totalRecords || this.data.length) / this.rowsPerPage),
      totalRecords: this.totalRecords || this.data.length,
      recordsPerPage: this.rowsPerPage,
      first: this.first,
      last: Math.min(this.first + this.rowsPerPage, this.totalRecords || this.data.length)
    };
  }
}
