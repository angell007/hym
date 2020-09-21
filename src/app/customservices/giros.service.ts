import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Globales } from '../shared/globales/globales';
import { GeneralService } from '../shared/services/general/general.service';

@Injectable()
export class GirosService {

  Giros = [];
  GirosBuscar = [];
  public GirosAprobados = [];
  public RutaGifCargando: string;
  public CargandoGiros: boolean = false;
  public Cargando: boolean = true;
  public FiltrosRecibidos: any = {
    codigo: '',
    funcionario: '',
    tipo: ''
  };
  public FiltrosAprobados: any = {
    codigo: '',
    funcionario: '',
    tipo: ''
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
  public user = JSON.parse(localStorage['User']);
  public Cambios: any = [];
  constructor(private generalService: GeneralService, public globales: Globales, private http: HttpClient

  ) {

    this.RutaGifCargando = generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    console.log('Iniciando servicio Giros y user es : ', this.user);
    this.CargarGirosDiarios()
    this.CargarGirosAprobados()
  }
  public filtroCustom: string;

  // ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
  //   this.alertSwal.type = tipo;
  //   this.alertSwal.title = titulo;
  //   this.alertSwal.text = msg;
  //   this.alertSwal.show();
  // }

  // @ViewChild('alertSwal') alertSwal: any;

  // SetFiltros(paginacion: boolean) {
  //   let params: any = {};
  //   params.funcionario = this.user.Identificacion_Funcionario

  //   if (paginacion === true) {
  //     params.pag = this.page;
  //   } else {
  //     this.page = 1;
  //     params.pag = this.page;
  //   }

  //   if (this.Filtros.codigo.trim() != "") {
  //     params.codigo = this.Filtros.codigo;
  //   }

  //   params.tipo = this.Filtros.tipo;
  //   return params;
  // }

  // ConsultaFiltrada(paginacion: boolean = false) {
  //   this.Cambios = [];
  //   var p = this.SetFiltros(paginacion);
  //   if (p === '') {
  //     this.ResetValues();
  //     return;
  //   }

  //   this.http.get(this.globales.ruta + 'php/cambio/get_filtre_cambios.php?', { params: p }).subscribe((data: any) => {
  //     if (data.codigo == 'success') {
  //       this.Cambios = data.query_data;
  //       this.SetInformacionPaginacion(data.query_data);
  //     }
  //   });
  // }

  FiltrarGiroCedula(value) {

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
        console.log(' this.GirosBuscar',  this.GirosBuscar );
        if (this.GirosBuscar.length > 0) {
          this.Aparecer = true;
        }
      });
    }
  }

  SetInformacionPaginacionAprobados(data: any) {
    // console.log(data);
    this.InformacionPaginacionRecibidos.TotalItems = data.length
    // console.log('', this.InformacionPaginacionRecibidos.TotalItems);
    var calculoHasta = (this.InformacionPaginacionRecibidos.page * this.InformacionPaginacionRecibidos.pageSize);
    var desde = calculoHasta - this.InformacionPaginacionRecibidos.pageSize + 1;
    var hasta = calculoHasta > this.InformacionPaginacionRecibidos.TotalItems ? this.InformacionPaginacionRecibidos.TotalItems : calculoHasta;
    this.InformacionPaginacionRecibidos.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacionRecibidos.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacionRecibidos.InformacionPaginacion['total'] = this.InformacionPaginacionRecibidos.TotalItems;
  }

  SetInformacionPaginacionRecibidos(data: any) {
    // console.log(data);
    this.InformacionPaginacionAprobados.TotalItems = data.length
    // console.log('', this.InformacionPaginacionAprobados.TotalItems);
    var calculoHasta = (this.InformacionPaginacionAprobados.page * this.InformacionPaginacionAprobados.pageSize);
    var desde = calculoHasta - this.InformacionPaginacionAprobados.pageSize + 1;
    var hasta = calculoHasta > this.InformacionPaginacionAprobados.TotalItems ? this.InformacionPaginacionAprobados.TotalItems : calculoHasta;
    this.InformacionPaginacionRecibidos['desde'] = desde;
    this.InformacionPaginacionRecibidos['hasta'] = hasta;
    this.InformacionPaginacionRecibidos['total'] = this.InformacionPaginacionAprobados.TotalItems;
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
      // console.log('Giros aprobados', this.GirosAprobados);
    });
  }


  ResetValues() {
    this.FiltrosRecibidos = {
      codigo: '',
      funcionario: '',
      tipo: '',
    };
    this.FiltrosAprobados = {
      codigo: '',
      funcionario: '',
      tipo: '',
    };
  }
}
