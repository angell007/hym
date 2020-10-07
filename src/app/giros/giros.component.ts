import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
import '../../assets/charts/amchart/continentsLow.js';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Globales } from '../shared/globales/globales';
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";
import { debounceTime, map } from 'rxjs/operators';
import { GiroService } from '../shared/services/giro/giro.service';

@Component({
  selector: 'app-giros',
  templateUrl: './giros.component.html',
  styleUrls: ['./giros.component.css', '../../style.scss']
})
export class GirosComponent implements OnInit {

  public fecha = new Date();
  public Giros: Array<any> = [];
  public Funcionario: any = JSON.parse(localStorage['User']);
  public Cargando: boolean = false;
  public DetalleGiro: any = {};
  public Conteo: any = {
    Totales: '0',
    Realizados: '0',
    Devueltos: '0',
    Anulados: '0'
  };

  @ViewChild('alertSwal') alertSwal: any;
  @ViewChild('ModalDetalleGiro') ModalDetalleGiro: any;

  public Filtros: any = {
    fecha: '',
    oficina: '',
    remitente: '',
    destinatario: '',
    monto: '',
    estado: ''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems: number = 0;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  constructor(private giroService: GiroService) {
    this.ConsultaFiltrada();
    this.GetConteo();
  }

  ngOnInit() {
  }

  GetDetalleGiro(idGiro: string) {
    this.giroService.getDetalleGiro(idGiro).subscribe((data: any) => {
      this.Giros = data.giros;
    });
  }

  GetConteo() {
    this.giroService.getConteoGiros().subscribe((data: any) => {
      this.Conteo = data.conteo;
    });
  }

  ActualizarTabla() {
    this.ConsultaFiltrada();
  }

  VerDetalleGiro(idGiro: string) {
    this.giroService.getDetalleGiro(idGiro).subscribe((data: any) => {
      this.DetalleGiro = data.query_data;
      this.ModalDetalleGiro.show();
    });
  }

  CerrarModalDetalle() {
    this.LimpiarModeloDetalleGiro();
    this.ModalDetalleGiro.hide();
  }

  LimpiarModeloDetalleGiro() {
    this.DetalleGiro = {};
  }

  SetFiltros(paginacion) {
    let params: any = {};

    params.tam = this.pageSize;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.fecha.trim() != "") {
      params.fecha = this.Filtros.fecha;
    }
    if (this.Filtros.oficina.trim() != "") {
      params.oficina = this.Filtros.oficina;
    }
    if (this.Filtros.remitente.trim() != "") {
      params.remitente = this.Filtros.remitente;
    }
    if (this.Filtros.destinatario.trim() != "") {
      params.destinatario = this.Filtros.destinatario;
    }
    if (this.Filtros.monto.trim() != "") {
      params.monto = this.Filtros.monto;
    }
    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    return queryString;
  }

  ConsultaFiltrada(paginacion: boolean = false) {

    var params = this.SetFiltros(paginacion);

    console.log([params, this.Filtros.Estado]);

    if (params === '') {
      this.ResetValues();
      this.Cargando = false;
      return;
    }

    this.Cargando = true;
    this.giroService.getGiros(params).subscribe((data: any) => {

      console.log(data);
      
      this.Giros = data.query_data;
      this.TotalItems = data.numReg;
      this.SetInformacionPaginacion();
      this.Cargando = false;
    });
  }

  ConsultaFiltradax(estadoFilter) {
    this.Filtros.estado = estadoFilter;
    this.ConsultaFiltrada();
  }

  ResetValues() {

    this.Filtros = {
      fecha: '',
      oficina: '',
      remitente: '',
      destinatario: '',
      monto: '',
      estado: ''
    };
  }

  SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }
}
