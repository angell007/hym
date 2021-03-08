import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { TableroDirective } from './tablero.directive';
import { Type } from '@angular/compiler/src/output/output_ast';
import { TableroauditoriaComponent } from "../tableros/tableroauditoria/tableroauditoria.component";
import { TablerocajeroComponent } from "../tableros/tablerocajero/tablerocajero.component";
import { TablerocajeroprincipalComponent } from "../tableros/tablerocajeroprincipal/tablerocajeroprincipal.component";
import { TableroconsultorComponent } from "../tableros/tableroconsultor/tableroconsultor.component";
import { TablerogerenciaComponent } from "../tableros/tablerogerencia/tablerogerencia.component";
import { VistaprincipalconsultorComponent } from '../tableros/tableroconsultor/vistaprincipalconsultor/vistaprincipalconsultor.component';
import { TablerocajerorecaudadorComponent } from '../tablerocajerorecaudador/tablerocajerorecaudador.component';


@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})

export class TableroComponent implements OnInit {

  Tablero = [];
  @ViewChild(TableroDirective) tableroDinamico: TableroDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private http: HttpClient, private globales: Globales) {

  }

  ngOnInit() {

    this.http.get(this.globales.ruta + 'php/perfiles/dashboard.php', {
      params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario }
    }).subscribe((data: any) => {

      var vari: any;
      // vari = TablerogerenciaComponent
      switch (data.Id_Perfil) {
        case '1':
          vari = TablerocajeroprincipalComponent;
          break;
        case '2':
          vari = TablerocajeroComponent;
          break;
        case '3':
          vari = TablerocajeroComponent;
          break;
        case '4':
          vari = VistaprincipalconsultorComponent;
          break;
        case '5':
          vari = TablerocajeroprincipalComponent;
          break;
        case '6':
          vari = TablerocajeroprincipalComponent;
          break;
        case '100':
          vari = TablerocajerorecaudadorComponent;
          break;
      }

      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(vari);
      let viewContainerRef = this.tableroDinamico.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(componentFactory);

    });

  }

}
