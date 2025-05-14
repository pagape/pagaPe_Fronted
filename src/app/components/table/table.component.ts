import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class TableComponent<T> {
  @Input() columns: { field: string; title?:string; header: string; type?: string; colorMap?: any; value?: any , tooltipText?: any, actions? : any[], icon?:any }[] = [];
  @Input() data: T[] = [];
  @Input() showPaginator: boolean = true;
  @Input() actions: { icon: string, action: (row: any) => void }[] = [];
  @Input() totalRecords: number = 0;
  @Input() transparentHeader: boolean = false;
  paginatedData: any[] = [];
  rowsPerPage = 5; // Filas por página
  currentPage = 0;
  @Input() sortOrder: number = 1;

  @Output() lazyLoad = new EventEmitter<any>();
  @Output() checkboxChange = new EventEmitter<{ row: any, checked: boolean }>();

  ngOnInit() {


  }

  getTagColor(value: string): string {
    return this.columns.find(col => col.colorMap && col.colorMap[value])?.colorMap[value] || 'gray';
  }

  onLazyLoad(event: any) {
    this.lazyLoad.emit(event);
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.rowsPerPage = event.rows;
    const first = event.first ?? (this.currentPage * this.rowsPerPage);
    this.lazyLoad.emit({
      first,
      rows: this.rowsPerPage,
      sortField: null,
      sortOrder: this.sortOrder,
      filters: {},
    });

  }
}
