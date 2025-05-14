import { Component } from '@angular/core';

import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

@Component({
    selector: 'app-sidebar',
    imports: [ NgClass],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarOpen = false;
  selectedMenu = '';

  resource = {
    id: 1,
    name: 'Cuadrilla',
    status: 'Activo',
    description: 'Lorem ipsum dolor sit amet...',
  };

  menuItems = [
    { label: 'Inicio', icon: 'home', url: '/main' },
    { label: 'Reportes', icon: 'description', url: '/main/report' },
    { label: 'Operaciones', icon: 'work', url: '/main/operation' },

    // { label: 'Seguridad', icon: 'verified_user', url: '/security' },
    // { label: 'Acceso', icon: 'lock' },
    // { label: 'Reportes', icon: 'description' },
    // { label: 'Administración', icon: 'settings' },
  ];

  constructor(

    private router: Router,
  ) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  selectMenu(item: any) {
    this.selectedMenu = item.label;
    this.router.navigate([`${item.url}`]);
    //this.openDynamicDialog();
  }
}
