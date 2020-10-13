import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globales } from '../shared/globales/globales';
import { GeneralService } from '../shared/services/general/general.service';

@Injectable()
export class GirosService {

  // Los Giros aprobados son los que aparecen pagados 
  // Los Giros  son los que aparecen enviados  
  public GirosAprobados = [];
  public Giros = [];
  public GirosBuscar = [];
  public CargandoGiros: boolean = false;
  public Cargando: boolean = true;
  public user = JSON.parse(localStorage['User']);

  public FiltrosRecibidos: any = {
    codigo: '',
    documento: '',
    nombreDestinatario: '',
    nombreRemitente: '',
    funcionario: '',
  };
  public FiltrosAprobados: any = {
    codigo: '',
    documento: '',
    nombreDestinatario: '',
    nombreRemitente: '',
    funcionario: '',
  };
  public Aparecer = false;
  //Paginación
  public InformacionPaginacionAprobados: any = {
    desde: 0,
    hasta: 0,
    total: 0,
    pageSize: 10,
    TotalItems: 0,
    page: 1
  }

  public InformacionPaginacionRecibidos: any = {
    desde: 0,
    hasta: 0,
    total: 0,
    pageSize: 10,
    TotalItems: 0,
    page: 1
  }
  constructor(public globales: Globales, private http: HttpClient) {
    this.CargarGirosDiarios()
    this.CargarGirosAprobados()
    this.ResetValues();

  }
  public filtroCustom: string;

  SetFiltros(paginacion: boolean) {
    let params: any = {};
    params.funcionario = this.user.Identificacion_Funcionario

    if (paginacion === true) {
      params.pag = this.InformacionPaginacionRecibidos.page;
    } else {
      this.InformacionPaginacionRecibidos.page = 1;
      params.pag = this.InformacionPaginacionRecibidos.page;
    }

    if (this.FiltrosRecibidos.codigo.trim() != "") {
      params.codigo = this.FiltrosRecibidos.codigo;
    }

    if (this.FiltrosRecibidos.documento.trim() != "") {
      params.documento = this.FiltrosRecibidos.documento;
    }

    if (this.FiltrosRecibidos.nombreDestinatario.trim() != "") {
      params.destinatario = this.FiltrosRecibidos.nombreDestinatario;
    }

    if (this.FiltrosRecibidos.nombreRemitente.trim() != "") {
      params.remitente = this.FiltrosRecibidos.nombreRemitente;
    }

    return params;
  }

  SetFiltrosAprobados(paginacion: boolean) {
    let params: any = {};
    params.funcionario = this.user.Identificacion_Funcionario

    if (paginacion === true) {
      params.pag = this.InformacionPaginacionAprobados.page;
    } else {
      this.InformacionPaginacionAprobados.page = 1;
      params.pag = this.InformacionPaginacionAprobados.page;
    }

    if (this.FiltrosAprobados.codigo.trim() != "") {
      params.codigo = this.FiltrosAprobados.codigo;
    }

    if (this.FiltrosAprobados.documento.trim() != "") {
      params.documento = this.FiltrosAprobados.documento;
    }

    if (this.FiltrosAprobados.nombreDestinatario.trim() != "") {
      params.destinatario = this.FiltrosAprobados.nombreDestinatario;
    }

    if (this.FiltrosAprobados.nombreRemitente.trim() != "") {
      params.remitente = this.FiltrosAprobados.nombreRemitente;
    }

    return params;
  }

  ConsultaFiltradaAprobados(paginacion: boolean = false) {
    this.GirosAprobados = [];
    var p = this.SetFiltrosAprobados(paginacion);
    if (p === '') {
      this.ResetValues();
      return;
    }

    this.http.get(this.globales.ruta + 'php/giros/listar_giros_funcionario_filter_aprobados.php?', { params: p }).subscribe((data: any) => {
      // console.log(data);
      if (data.codigo == 'success') {
        this.GirosAprobados = data.query_data;
        this.SetInformacionPaginacionAprobados(data.query_data);
      }
    });
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Giros = [];
    var p = this.SetFiltros(paginacion);
    if (p === '') {
      this.ResetValues();
      return;
    }

    this.http.get(this.globales.ruta + 'php/giros/listar_giros_funcionario_filter.php?', { params: p }).subscribe((data: any) => {
      // console.log(data);
      if (data.codigo == 'success') {
        this.Giros = data.query_data;
        this.SetInformacionPaginacionRecibidos(data.query_data);
      }
    });
  }

  FiltrarGiroCedula(value: any) {

    this.Aparecer = false;
    this.CargandoGiros = true;

    if (value == '') {
      this.GirosBuscar = [];
      this.Aparecer = true;
      this.CargandoGiros = false;
    } else {
      this.http.get(this.globales.ruta + 'php/giros/giros_cedula.php', { params: { id: value, funcionario: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
        this.CargandoGiros = false;
        this.GirosBuscar = data;
        // console.log(' this.GirosBuscar', this.GirosBuscar);
        if (this.GirosBuscar.length > 0) {
          this.Aparecer = true;
        }
      });
    }
  }

  SetInformacionPaginacionRecibidos(data: any) {
    this.InformacionPaginacionRecibidos.TotalItems = data.length
    var calculoHasta = (this.InformacionPaginacionRecibidos.page * this.InformacionPaginacionRecibidos.pageSize);
    var desde = calculoHasta - this.InformacionPaginacionRecibidos.pageSize + 1;
    var hasta = calculoHasta > this.InformacionPaginacionRecibidos.TotalItems ? this.InformacionPaginacionRecibidos.TotalItems : calculoHasta;
    this.InformacionPaginacionRecibidos['desde'] = desde;
    this.InformacionPaginacionRecibidos['hasta'] = hasta;
    this.InformacionPaginacionRecibidos['total'] = this.InformacionPaginacionRecibidos.TotalItems;
  }

  SetInformacionPaginacionAprobados(data: any) {
    this.InformacionPaginacionAprobados.TotalItems = data.length
    var calculoHasta = (this.InformacionPaginacionAprobados.page * this.InformacionPaginacionAprobados.pageSize);
    var desde = calculoHasta - this.InformacionPaginacionAprobados.pageSize + 1;
    var hasta = calculoHasta > this.InformacionPaginacionAprobados.TotalItems ? this.InformacionPaginacionAprobados.TotalItems : calculoHasta;
    this.InformacionPaginacionAprobados['desde'] = desde;
    this.InformacionPaginacionAprobados['hasta'] = hasta;
    this.InformacionPaginacionAprobados['total'] = this.InformacionPaginacionAprobados.TotalItems;
  }


  CargarGirosDiarios() {
    this.Giros = [];
    this.http.get(this.globales.ruta + 'php/giros/listar_giros_funcionario.php', { params: { modulo: 'Giro', funcionario: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Giros = data;
    });
  }

  CargarGirosAprobados() {
    this.GirosAprobados = [];
    this.http.get(this.globales.ruta + '/php/giros/giros_aprobados.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      this.GirosAprobados = data;
    });
  }


  ResetValues() {
    this.FiltrosRecibidos = {
      codigo: '',
      documento: '',
      nombreDestinatario: '',
      nombreRemitente: '',
      funcionario: '',
    };
    this.FiltrosAprobados = {
      codigo: '',
      documento: '',
      nombreDestinatario: '',
      nombreRemitente: '',
      funcionario: '',
    };
  }
}
