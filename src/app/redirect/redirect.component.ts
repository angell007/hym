import { Component, OnInit } from '@angular/core';
import { HandlerrouteService } from '../handlerroute.service';

import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable, ViewChild } from '@angular/core';
import { TablerogerenciaComponent } from '../tableros/tablerogerencia/tablerogerencia.component';
import { TablerocajeroComponent } from '../tableros/tablerocajero/tablerocajero.component';
import { VistaprincipalconsultorComponent } from '../tableros/tableroconsultor/vistaprincipalconsultor/vistaprincipalconsultor.component';
import { TablerocajeroprincipalComponent } from '../tableros/tablerocajeroprincipal/tablerocajeroprincipal.component';
import { TablerocajerorecaudadorComponent } from '../tablerocajerorecaudador/tablerocajerorecaudador.component';
import { TableroDirective } from '../tablero/tablero.directive';
import { Globales } from '../shared/globales/globales';
import { TableroconsultorvisualComponent } from '../tableros/tableroconsultor/tableroconsultorvisual/tableroconsultorvisual.component';
import { TableroauditoriaComponent } from '../tableros/tableroauditoria/tableroauditoria.component';
import { TableroconsultorComponent } from '../tableros/tableroconsultor/tableroconsultor.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  Tablero = [];
  @ViewChild(TableroDirective) tableroDinamico: TableroDirective;

  // private componentFactoryResolver: ComponentFactoryResolver
  // private http: HttpClient
  // private globales: Globales
  public id = '2';

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private http: HttpClient, private globales: Globales, private router: Router) { }

  ngOnInit() {

    // console.log(this.router.url);

    this.redirect(this.router.url)

  }

  // entryComponents: [TableroauditoriaComponent, TablerocajerorecaudadorComponent, Tablero cajeroComponent, TablerocajeroprincipalComponent, TableroconsultorComponent, TableroconsultorvisualComponent, TablerogerenciaComponent, VistaprincipalconsultorComponent]

  redirect(url) {
    var vari: any;
    switch (url) {
      case '/consultor':
        vari = VistaprincipalconsultorComponent
        break;
      case '/recaudador':
        vari = TablerocajerorecaudadorComponent
        break;
      case '/cajero':
        vari = TablerocajeroComponent
        break;
      case '/cajero-principal':
        vari = TablerocajeroprincipalComponent
        break;
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(vari);
    let viewContainerRef = this.tableroDinamico.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);


  }


}
