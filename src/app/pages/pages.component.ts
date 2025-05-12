import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "../layout/header/header.component";
import {SidebarComponent} from "../layout/sidebar/sidebar.component";

@Component({
  selector: 'app-pages',
  standalone:true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit{
  isPage = false;
  esRutaOculta = false;
  rutasOcultas: string[] = ['/survey/respond-evaluation'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.verificarRuta();
      }
    });

    this.verificarRuta();
  }

  verificarRuta() {
    const rutaActual = this.router.url;
    console.log(rutaActual);
    this.esRutaOculta = this.rutasOcultas.includes(rutaActual);
    console.log(this.esRutaOculta);
  }


}
