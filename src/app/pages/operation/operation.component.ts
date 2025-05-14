import { Component } from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SelectModule} from "primeng/select";
import {DatePickerModule} from "primeng/datepicker";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {TableComponent} from "../../components/table/table.component";
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-operation',
  template: `
    <div>
      <div *ngIf="!isRouteHide">
        <div class="uflex gap20 bogenetables-tabs">
          <p-menubar [model]="items">
            <ng-template #item let-item>
              <a
                class="p-menubar-item-link"
                routerLinkActive="p-menubar-item-link-active"
                [routerLink]="item.routerLink">
                <i class="material-symbols-outlined">{{ item.icon }}</i>
                <span>{{ item.label }}</span>
              </a>
            </ng-template>
          </p-menubar>
        </div>
        <hr class="udividerow" />
      </div>
      <div class="">
        <router-outlet />
      </div>
    </div>
  `,
  imports: [CommonModule, MenubarModule, RouterModule, RouterOutlet],
  styleUrl: './operation.component.css',
})
export class OperationComponent {

  isRouteHide = false;
  routeHidden: string[] = [

  ];

  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Lista de clientes',
        icon: 'group',
        routerLink: 'list-clients',
      },
      {
        label: 'Lista de clientes - servicio ',
        icon: 'loyalty',
        routerLink: 'list-client-services',
      },


    ];

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });

    this.checkRoute();
    // console.log(this.showTabs);
  }

  checkRoute() {
    const currentRoute = this.router.url;
    console.log(currentRoute);
    this.isRouteHide = this.routeHidden.some(routeitem => currentRoute.startsWith(routeitem));
    console.log(this.isRouteHide);
  }
}
