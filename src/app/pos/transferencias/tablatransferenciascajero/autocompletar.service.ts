import { Injectable, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { Globales } from '../../../shared/globales/globales';
import { GeneralService } from '../../../shared/services/general/general.service';
import { TransferenciaService } from '../../../shared/services/transferencia/transferencia.service';

@Injectable()
export class AutocompletarService {
  public user = JSON.parse(localStorage['User']);

  //MODELO PARA TRANSFERENCIAS
  public TransferenciaModel: any = {
    Forma_Pago: 'Efectivo',
    Tipo_Transferencia: 'Transferencia',

    //DATOS DEL CAMBIO
    Moneda_Origen: '2',
    Moneda_Destino: '',
    Cantidad_Recibida: '',
    Cantidad_Transferida: '',
    Cantidad_Transferida_Con_Bolivares: '0',
    Tasa_Cambio: '',
    Identificacion_Funcionario: this.user.Identificacion_Funcionario,
    // Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja,
    Observacion_Transferencia: '',

    //DATOS REMITENTE
    Documento_Origen: '',
    Nombre_Remitente: '',
    Telefono_Remitente: '',

    //DATOS CREDITO
    Cupo_Tercero: 0,
    Bolsa_Bolivares: '0',

    //DATOS CONSIGNACION
    Id_Tercero_Destino: '',
    Id_Cuenta_Bancaria: '',
    Tipo_Origen: 'Remitente',
    Tipo_Destino: 'Destinatario'
  };

  public RutaGifCargando: string;
  public CargandoGiros: boolean = false;
  public Cargando: boolean = true;
  public Filtros: any = {
    codigo: '',
    funcionario: '',
    tipo: ''
  };

  //Paginación
  // public maxSize = 10;
  public pageSize = 10;
  public TotalItems: number;
  public page = 1;
  public InformacionPaginacion: any = {
    desde: 0,
    hasta: 0,
    total: 0
  }
  public Cambios: any = [];

  public RecibosTransferencia: Array<any> = [];

  constructor(private generalService: GeneralService, public globales: Globales, private http: HttpClient, private _transferenciaService: TransferenciaService
  ) {

    this.RutaGifCargando = generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    // console.log('Iniciando servicio y user es : ', this.user);
    this.CargarTransferencias()
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
    // Limitar tamaño del filtro 
    // params.tam = this.pageSize;
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

    params.tipo = this.Filtros.tipo;
    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {
    this.Cambios = [];
    var p = this.SetFiltros(paginacion);
    if (p === '') {
      this.ResetValues();
      return;
    }

    this.http.get(this.globales.ruta + 'php/cambio/get_filtre_cambios.php?', { params: p }).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Cambios = data.query_data;
        this.SetInformacionPaginacion(data.query_data);
      }
    });
  }


  CargarTransferencias() {
    this.RecibosTransferencia = [];
    // console.log('Cargando transferencias ');

    this.http.get(this.globales.ruta + 'php/transferencias/get_recibos_transferencias_funcionario.php', { params: { id_funcionario: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
      // console.log('tranferencias cargadas', data);
      if (data.codigo == 'success') {
        this.RecibosTransferencia = data.query_data;
        this.SetInformacionPaginacion(data.query_data)
      } else {
        this.RecibosTransferencia = [];
      }
    });
  }

  ResetValues() {
    this.Filtros = {
      codigo: '',
      funcionario: '',
      tipo: '',
    };
  }

  SetInformacionPaginacion(data: any) {
    // console.log(data);
    this.TotalItems = data.length
    // console.log('', this.TotalItems);
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;
    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }
}
