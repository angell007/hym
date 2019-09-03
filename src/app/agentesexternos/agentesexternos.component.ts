// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />

import { Component, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient } from '@angular/common/http';
import { ThemeConstants } from '../shared/config/theme-constant';
import { NgForm } from '@angular/forms';
import 'ammap3';
import 'ammap3/ammap/maps/js/usaLow';

import 'assets/js/jquery.sparkline/jquery.sparkline.js';
import * as $ from 'jquery';
import { Globales } from '../shared/globales/globales';

@Component({
  selector: 'app-agentesexternos',
  templateUrl: './agentesexternos.component.html',
  styleUrls: ['./agentesexternos.component.css']
})
export class AgentesexternosComponent implements OnInit {
  public fecha = new Date();
  agentes = [];
  conteoTransferencias:any = {};
  conteoTransferenciasGrafica = [];
  
  //variables de formulario
  public Identificacion: any = [];
  public Nombre: any = [];
  public Documento: any = [];
  public Cupo: any = [];
  public Username: any = [];
  public Password: any = [];

  public tEnero: Number;
  public tFebrero: Number;
  public tMarzo: Number;
  public tAbril: Number;
  public tMayo: Number;
  public tJunio: Number;
  public tJulio: Number;
  public tAgosto: Number;
  public tSeptiembre: Number;
  public tOctubre: Number;
  public tNoviembre: Number;
  public tDiciembre: Number;
  public teEnero: Number;
  public teFebrero: Number;
  public teMarzo: Number;
  public teAbril: Number;
  public teMayo: Number;
  public teJunio: Number;
  public teJulio: Number;
  public teAgosto: Number;
  public teSeptiembre: Number;
  public teOctubre: Number;
  public teNoviembre: Number;
  public teDiciembre: Number;

  public boolNombre:boolean = false;
  public boolDocumento:boolean = false;
  public boolCupo:boolean = false;
  public boolUsername:boolean = false;
  public boolPassword:boolean = false;

  @ViewChild('ModalAgente') ModalAgente: any;
  @ViewChild('ModalEditarAgente') ModalEditarAgente: any;
  @ViewChild('FormAgenteAgregar') FormAgenteAgregar: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private http: HttpClient, private colorConfig: ThemeConstants, private globales: Globales) {
  }

  themeColors = this.colorConfig.get().colors;
  //Line Chart Config
  public lineChartLabels: Array<any> = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  public lineChartData: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Transferencias Montadas' },
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Transferencias Exitosas' }
  ];;
  public lineChartOptions: any = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false
        }
      ]
    }
  };
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';
  public lineChartColors: Array<any> = [
    {
      backgroundColor: this.themeColors.infoInverse,
      borderColor: this.themeColors.info
    },
    {
      backgroundColor: this.themeColors.successInverse,
      borderColor: this.themeColors.success
    }
  ];

  esconder = true;
  ngOnInit() {

    var perfil = JSON.parse(localStorage.Perfil);
    switch(perfil){
      case 5:{
        this.esconder = false;
        break;
      }
      default:{
        this.esconder = true;
        break;
      }
    }

    this.http.get(this.globales.ruta + 'php/agentesexternos/lista.php').subscribe((data: any) => {
      this.agentes = data;
    });
    this.http.get(this.globales.ruta + 'php/agentesexternos/conteo.php').subscribe((data: any) => {
      this.conteoTransferencias = data[0];
    });
    this.http.get(this.globales.ruta + 'php/agentesexternos/conteo_grafica.php').subscribe((data: any) => {
      this.conteoTransferenciasGrafica = data[0];

      for (var key in this.conteoTransferenciasGrafica) {
        if (key == "TotalTransferenciasEnero") {
          this.tEnero = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasFebrero") {
          this.tFebrero = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasMarzo") {
          this.tMarzo = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasAbril") {
          this.tAbril = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasMayo") {
          this.tMayo = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasJunio") {
          this.tJunio = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasJulio") {
          this.tJulio = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasAgosto") {
          this.tAgosto = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasSeptiembre") {
          this.tSeptiembre = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasOctubre") {
          this.tOctubre = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasNoviembre") {
          this.tNoviembre = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TotalTransferenciasDiciembre") {
          this.tDiciembre = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasEnero") {
          this.teEnero = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasFebrero") {
          this.teFebrero = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasMarzo") {
          this.teMarzo = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasAbril") {
          this.teAbril = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasMayo") {
          this.teMayo = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasJunio") {
          this.teJunio = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasJulio") {
          this.teJulio = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasAgosto") {
          this.teAgosto = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasSeptiembre") {
          this.teSeptiembre = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasOctubre") {
          this.teOctubre = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasNoviembre") {
          this.teNoviembre = this.conteoTransferenciasGrafica[key];
        }
        if (key == "TransferenciasExitosasDiciembre") {
          this.teDiciembre = this.conteoTransferenciasGrafica[key];
        }
      }

      this.lineChartData = [
        { data: [this.tEnero, this.tFebrero, this.tMarzo, this.tAbril, this.tMayo, this.tJunio, this.tJulio, this.tAgosto, this.tSeptiembre, this.tOctubre, this.tNoviembre, this.tDiciembre], label: 'Transferencias Montadas' },
        { data: [this.teEnero, this.teFebrero, this.teMarzo, this.teAbril, this.teMayo, this.teJunio, this.teJulio, this.teAgosto, this.teSeptiembre, this.teOctubre, this.teNoviembre, this.teDiciembre], label: 'Transferencias Exitosas' }
      ];
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      //this.FormAgenteAgregar.reset();
      this.OcultarFormularios();
    }
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolDocumento = false;
    this.boolCupo = false;
    this.boolUsername = false;
    this.boolPassword = false;
  }

  GuardarAgente(formulario: NgForm, modal: any) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo", 'Agente_Externo');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos).subscribe((data: any) => {
      this.agentes = data;
      formulario.reset();
    });
  }

  EditarAgente(id, modal) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Agente_Externo', id: id }
    }).subscribe((data: any) => {
      this.Identificacion = data.Id_Agente_Externo;
      this.Nombre = data.Nombre;
      this.Documento = data.Documento;
      this.Cupo = data.Cupo;
      this.Username = data.Username;
      this.Password = data.Password;
      modal.show();
    });
  }
  VerAgente(id, modal) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Agente_Externo', id: id }
    }).subscribe((data: any) => {
      this.Identificacion = data.Id_Agente_Externo;
      this.Nombre = data.Nombre;
      this.Documento = data.Documento;
      this.Cupo = data.Cupo;
      this.Username = data.Username;
      this.Password = data.Password;
      modal.show();
    });
  }

  OcultarFormulario(modal) {
    this.Identificacion = null;
    this.Nombre = null;
    this.Documento = null;
    this.Cupo = null;
    this.Username = null;
    this.Password = null;
    modal.hide();
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalAgente);
    //this.OcultarFormulario(this.ModalVerAgente);
    this.OcultarFormulario(this.ModalEditarAgente);
  }

  EliminarAgente(id) {
    let datos = new FormData();
    datos.append("modulo", 'Agente_Externo');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos).subscribe((data: any) => {
      this.agentes = data;
      this.deleteSwal.show();
    })
  }

}
