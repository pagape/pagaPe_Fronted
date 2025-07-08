import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterModule, RouterOutlet} from "@angular/router";
import {MenuItem} from "primeng/api";
import {CommonModule} from "@angular/common";
import {MenubarModule} from "primeng/menubar";

@Component({
  selector: 'app-report',
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
  styleUrl: './report.component.css'
})
export class ReportComponent {
  isRouteHide = false;
  routeHidden: string[] = [

  ];

  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [

      {
        label: 'Evaluacion de usuario',
        icon: 'pending_actions',
        routerLink: 'user-evaluation',
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
