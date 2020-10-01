import { Injectable, ViewChild } from '@angular/core';
import { GeneralService } from '../shared/services/general/general.service';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class SexternosService {

  public RutaGifCargando: string;
  public CargandoGiros: boolean = false;
  public Cargando: boolean = true;
  public Filtros: any = {
    codigo: '',
    servicio: '',
  };
  //Paginación
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }
  ListaServiciosExternos = [];
  Servicios = [];
  public user = JSON.parse(localStorage['User']);
  constructor(private generalService: GeneralService, public globales: Globales, private http: HttpClient

  ) {
    this.CargarDatosServicios()
  }
  public filtroCustom: string;

  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  @ViewChild('alertSwal') alertSwal: any;

  SetFiltros(paginacion: boolean) {
    let params: any = {};
    params.funcionario = this.user.Identificacion_Funcionario

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.servicio.trim() != "") {
      params.servicio = this.Filtros.servicio;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Servicios = [];
    var p = this.SetFiltros(paginacion);
    if (p === '') {
      this.ResetValues();
      return;
    }

    this.http.get(this.globales.ruta + 'php/serviciosexternos/get_lista_servicios_filter.php?', { params: p }).subscribe((data: any) => {
      console.log(data);
      if (data.codigo == 'success') {
        this.Servicios = data.query_data;
        this.SetInformacionPaginacion(data.query_data);
      }
    });
  }

  SetInformacionPaginacion(data: any) {
    this.TotalItems = data.length
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }


  CargarDatosServicios() {
    this.CargarServiciosDiarios();

    this.ListaServiciosExternos = [];
    this.ListaServiciosExternos = this.globales.ServiciosExternos;
  }

  CargarServiciosDiarios() {
    this.Servicios = [];
    this.http.get(this.globales.ruta + 'php/serviciosexternos/get_lista_servicios.php', { params: { id_funcionario: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Servicios = data.query_data;
      this.SetInformacionPaginacion(data.query_data);
    });
  }

  ResetValues() {
    this.Filtros = {
      codigo: '',
      servicio: '',
    };
  }

  cambiarEstadoServicio(datos: FormData): Observable<any> {
    return this.http.post(this.globales.ruta + 'php/serviciosexternos/cambiar_estado_servicio_custom.php', datos);
  }
}
