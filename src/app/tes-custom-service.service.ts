import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Globales } from './shared/globales/globales';

@Injectable()
export class TesCustomServiceService {


  public Filtros: any = {
    fecha: null,
    codigo: '',
    cajero: '',
    valor: '',
    pendiente: '',
    cedula: '',
    cta_destino: '',
    nombre_destinatario: '',
    estado: ''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  public Id_Funcionario: string = JSON.parse(localStorage['User']).Identificacion_Funcionario;
  private _rutaBase: string = this.globales.ruta + 'php/transferencias/';
  public TransferenciasListar: any;
  public subjec = new Subject();
  public observer$ = this.subjec.asObservable();


  constructor(private _http: HttpClient, private globales: Globales) {

  }

  testcustom() {
    this.subjec.next('data')
  }

  SetFiltros(paginacion: boolean = false, filter: string) {
    let params: any = {};

    params.tam = this.pageSize;
    params.id_funcionario = this.Id_Funcionario;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    params.estado = 'Pagada' ;


    return params;
  }


  async customConsultaFiltrada(paginacion: boolean = false, filter) {

    var p = this.SetFiltros(paginacion, filter);

    if (p === '') {
      this.ResetValues();
      return;
    }

    // const resp = this._http.get(this._rutaBase + 'get_filter_transferencias_consultores.php', { params: p }).subscribe((data) => {
      this.subjec.next(filter)
    // });

  }

  ResetValues() {
    this.Filtros = {
      fecha: '',
      codigo: '',
      cajero: '',
      valor: '',
      pendiente: '',
      cedula: '',
      cta_destino: '',
      nombre_destinatario: '',
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
