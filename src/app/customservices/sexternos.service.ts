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
  public FiltrosPagados: any = {
    codigo: '',
    servicio: '',
  };
  public FiltrosPendientes: any = {
    codigo: '',
    servicio: '',
  };
  public FiltrosRealizados: any = {
    codigo: '',
    servicio: '',
  };
  //Paginación
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public page1 = 1;
  public page2 = 1;
  public page3 = 1;
  public TotalItems1: number;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }
  ListaServiciosExternos = [];
  Servicios = [];
  Servicios_Caja = [];
  Servicios_Pagos = [];
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

  SetFiltros(paginacion: boolean, filtro: any) {
    let params: any = {};
    params.id_funcionario = this.user.Identificacion_Funcionario

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1;
      params.pag = this.page;
    }

    if (filtro.codigo.trim() != "") {
      params.codigo = filtro.codigo;
    }

    if (filtro.servicio.trim() != "") {
      params.servicio = filtro.servicio;
    }
    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false, filtro) {
    this.Servicios = [];
    var p = this.SetFiltros(paginacion, filtro);
    if (p === '') {
      this.ResetValues();
      return;
    }


    this.http.get(this.globales.ruta + 'php/serviciosexternos/get_lista_servicios.php?', { params: p }).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.page1 = 1;
        this.TotalItems1 = this.TotalItems1 = data.query_data.length;

        this.Servicios = data.query_data;
        this.SetInformacionPaginacion(data.query_data);
        this.Cargando = false;
      }
    });
  }

  SetInformacionPaginacion(data: any) {
    this.page = 1;
    this.TotalItems = data.length
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }


  CargarDatosServicios(tipo?) {
    this.Cargando = true;
    this.Servicios = [];
    this.Servicios_Caja = [];
    this.Servicios_Pagos = [];
    if (tipo == 'Enviados') {

      this.CargarServiciosDiarios(this.FiltrosRealizados);
    } else if (tipo == 'Pagado' || tipo == 'Activo') {

      this.CargarMisServicios(tipo);

    } else if (!tipo) {

      this.CargarServiciosDiarios(this.FiltrosRealizados);
      this.CargarMisServicios('Activo');
      this.CargarMisServicios('Pagado');
    }
    this.ListaServiciosExternos = [];
    this.ListaServiciosExternos = this.globales.ServiciosExternos;
  }

  CargarServiciosDiarios(filtro) {
    this.Servicios = [];
    var p = this.SetFiltros(false, filtro);
    if (p === '') {
      this.ResetValues();
      return;
    }



    this.Servicios = [];
    this.Cargando = true;
    this.http.get(this.globales.ruta + 'php/serviciosexternos/get_lista_servicios.php', { params: p }).subscribe((data: any) => {
      this.Servicios = data.query_data;
      this.SetInformacionPaginacion(data.query_data);
      this.page1 = 1;
      this.TotalItems1 = data.query_data.length;
      this.Cargando = false;
    });
  }

  CargarMisServicios(tipo) {
    this.Cargando = true;
    var filtro: any = {}

    if (tipo == 'Activo') {
      this.Servicios_Caja = [];
      filtro = this.FiltrosPendientes
    } else if ('Pagado') {
      this.Servicios_Pagos = [];
      filtro = this.FiltrosPagados
    }
    var p: any = this.SetFiltros(false, filtro);
    if (p === '') {
      this.ResetValues();
      return;
    }
    p.Id_Caja = this.generalService.Caja
    p.Estado = tipo

    this.http.get(this.globales.ruta + 'php/serviciosexternos/get_servicios_by_caja.php',
      {
        params: p
      }).subscribe((data: any) => {
        if (tipo == 'Activo') {
          this.page2 = 1;
          this.Servicios_Caja = data;

        } else {
          this.page3 = 1;
          this.Servicios_Pagos = data;
        }
        this.Cargando = false;

        this.SetInformacionPaginacion(data);
      });


  }



  ResetValues() {
    this.FiltrosRealizados = {
      codigo: '',
      servicio: '',
    };
    this.FiltrosPagados = {
      codigo: '',
      servicio: '',
    };
    this.FiltrosPendientes = {
      codigo: '',
      servicio: '',
    };
  }

  cambiarEstadoServicio(datos: FormData): Observable<any> {
    return this.http.post(this.globales.ruta + 'php/serviciosexternos/cambiar_estado_servicio_custom.php', datos);
  }



}
