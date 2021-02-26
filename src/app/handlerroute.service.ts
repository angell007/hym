import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable, ViewChild } from '@angular/core';
import { RedirectComponent } from './redirect/redirect.component';
import { Globales } from './shared/globales/globales';
import { TableroDirective } from './tablero/tablero.directive';
import { TablerocajerorecaudadorComponent } from './tablerocajerorecaudador/tablerocajerorecaudador.component';
import { TablerocajeroComponent } from './tableros/tablerocajero/tablerocajero.component';
import { TablerocajeroprincipalComponent } from './tableros/tablerocajeroprincipal/tablerocajeroprincipal.component';
import { VistaprincipalconsultorComponent } from './tableros/tableroconsultor/vistaprincipalconsultor/vistaprincipalconsultor.component';
import { TablerogerenciaComponent } from './tableros/tablerogerencia/tablerogerencia.component';

@Injectable()
export class HandlerrouteService {
  private componentFactoryResolver: ComponentFactoryResolver
  private http: HttpClient
  private globales: Globales
  public id = '2';

  Tablero = [];
  @ViewChild(TableroDirective) tableroDinamico: TableroDirective;

  constructor() {
    this.redirect();
  }

  redirect() {
    // var vari: any;
    // vari = TablerogerenciaComponent
    // switch (this.id) {
    //   case '1':
    //     break;
    //   case '2':
    //     vari = TablerocajeroComponent;
    //     break;
    //   case '3':
    //     vari = TablerocajeroComponent;
    //     break;
    //   case '4':
    //     vari = VistaprincipalconsultorComponent;
    //     break;
    //   case '5':
    //     vari = TablerocajeroprincipalComponent;
    //     break;
    //   case '6':
    //     vari = TablerocajeroprincipalComponent;
    //     break;
    //   case '100':
    //     vari = TablerocajerorecaudadorComponent;
    //     break;
    // }

    // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(vari);
    // let viewContainerRef = this.tableroDinamico.viewContainerRef;
    // viewContainerRef.clear();
    // viewContainerRef.createComponent(componentFactory);


  }

}
