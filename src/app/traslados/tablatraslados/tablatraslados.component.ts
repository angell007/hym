import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { TrasladoService } from '../../shared/services/traslados/traslado.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TerceroService } from '../../shared/services/tercero/tercero.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';

@Component({
  selector: 'app-tablatraslados',
  templateUrl: './tablatraslados.component.html',
  styleUrls: ['./tablatraslados.component.scss', '../../../style.scss']
})
export class TablatrasladosComponent implements OnInit {

  public Traslados: Array<any> = [];
  public Monedas: Array<any> = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;

  public AbrirModalAgregar: Subject<any> = new Subject<any>();
  public AbrirModalEdit: Subject<any> = new Subject<any>();

  public Filtros: any = {
    fecha: '',
    codigo: '',
    funcionario: '',
    origen: '',
    destino: '',
    tipo_origen: '',
    tipo_destino: '',
    moneda: '',
    estado: '',
    valor: ''
  };

  public Origen: any = '';
  public Destino: any = '';

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

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _toastService: ToastService,
    private _trasladoService: TrasladoService,
    private _monedaService: MonedaService,
    private _terceroService: TerceroService,
    private _cuentaBancariaService: CuentabancariaService) {
    this.RutaGifCargando = _generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
    this.GetMonedas();
  }

  async GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {
      this.Monedas = data;
    });
  }

  ConsultaOrigen(match: string) {

    if (this.Filtros.tipo_origen == 'Cliente') {
      return this._terceroService.getTercerosPorTipo('Cliente', match);
    } else if (this.Filtros.tipo_origen == 'Proveedor') {
      return this._terceroService.getTercerosPorTipo('Proveedor', match);
    } else if (this.Filtros.tipo_origen == 'Cuenta Bancaria') {
      return this._cuentaBancariaService.getFiltrarCuentasBancarias(match);
    }
  }

  ConsultaDestino(match: string) {

    if (this.Filtros.tipo_destino == 'Cliente') {
      return this._terceroService.getTercerosPorTipo('Cliente', match);
    } else if (this.Filtros.tipo_destino == 'Proveedor') {
      return this._terceroService.getTercerosPorTipo('Proveedor', match);
    } else if (this.Filtros.tipo_destino == 'Cuenta Bancaria') {
      return this._cuentaBancariaService.getFiltrarCuentasBancarias(match);
    } else if (this.Filtros.tipo_destino == 'Cajero') {
      console.log(this._cuentaBancariaService.getFiltrarCajero(match));
      return this._cuentaBancariaService.getFiltrarCajero(match);
    }
  }


  search_origen = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 3 ? [] :
          this.ConsultaOrigen(term)
            .map(response => response)
            .do(data => data)
        )
      );
  formatter_origen = (x: { Nombre: string }) => x.Nombre;


  search_destino = (text$: Observable<string>) =>
    text$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(term => term.length < 3 ? [] :
          this.ConsultaDestino(term)
            .map(response => response)
            .do(data => data)
        )
      );
  formatter_destino = (x: { Nombre: string }) => x.Nombre;

  AbrirModal(idTraslado: string) {
    this.AbrirModalAgregar.next(idTraslado);
  }

  AbrirModal2(idTraslado: any) {
    this.AbrirModalEdit.next(idTraslado);
  }

  SetFiltros(paginacion: boolean) {
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

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.funcionario.trim() != "") {
      params.funcionario = this.Filtros.funcionario;
    }

    if (this.Filtros.tipo_origen.trim() != "") {
      params.tipo_origen = this.Filtros.tipo_origen;
    }

    if (this.Filtros.tipo_destino.trim() != "") {
      params.tipo_destino = this.Filtros.tipo_destino;
    }

    if (this.Filtros.origen.trim() != "") {
      params.origen = this.Filtros.origen;
    }

    if (this.Filtros.destino.trim() != "") {
      params.destino = this.Filtros.destino;
    }

    if (this.Filtros.moneda.trim() != "") {
      params.moneda = this.Filtros.moneda;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {

    var p = this.SetFiltros(paginacion);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this._trasladoService.getListaTraslados(p).subscribe((data: any) => {

      if (data.codigo == 'success') {
        this.Traslados = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.Traslados = [];
        this._swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  BuscarOrigen() {
    if (this.Filtros.tipo_origen == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe escoger el tipo de origen primero']);
      this.Filtros.origen = '';
    } else {

      this.ConsultaFiltrada();
    }
  }

  BuscarDestino() {
    if (this.Filtros.tipo_destino == '') {
      this._swalService.ShowMessage(['warning', 'Alerta', 'Debe escoger el tipo de destino primero']);
      this.Filtros.destino = '';
    } else {

      this.ConsultaFiltrada();
    }
  }

  ResetValues() {
    this.Filtros = {
      fecha: '',
      codigo: '',
      funcionario: '',
      origen: '',
      destino: '',
      tipo_origen: '',
      tipo_destino: '',
      moneda: '',
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

  AnularTraslado(modelo: any) {
    let datos = new FormData();
    datos.append("modelo", JSON.stringify(modelo));
    this._trasladoService.anularTraslado(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ConsultaFiltrada();
        this._swalService.ShowMessage(['success', 'Exito', 'Operacion realizada correctamente']);
        // let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        // this._toastService.ShowToast(toastObj);
      } else {
        this._swalService.ShowMessage(data);
      }
    });
  }


  CompletarOrigen(value) {

    if (typeof (value) == 'object') {
      this.Filtros.origen = this.Filtros.tipo_origen == 'Cuenta Bancaria' ? value.Id_Cuenta_Bancaria : value.Id_Tercero;
      this.ConsultaFiltrada();
    } else {
      this.Filtros.origen = '';
      this.ConsultaFiltrada();
    }

  }

  CompletarDestino(value) {

    if (typeof (value) == 'object') {

      this.Filtros.destino = this.Filtros.tipo_destino == 'Cuenta Bancaria' ? value.Id_Cuenta_Bancaria : String(value.Id_Tercero);
      console.log(this.Filtros.destino);
      this.ConsultaFiltrada();
    } else {
      this.Filtros.destino = '';
      this.ConsultaFiltrada();
    }

  }

  ConsultaSelectOrigen() {
    if (this.Filtros.tipo_origen == '') {
      this.Origen = '';
      this.Filtros.origen = '';
      this.ConsultaFiltrada();
    } else {

      this.ConsultaFiltrada();
    }
  }

  ConsultaSelectDestino() {
    if (this.Filtros.tipo_destino == '') {
      this.Destino = '';
      this.Filtros.destino = '';
      this.ConsultaFiltrada();
    } else {

      this.ConsultaFiltrada();
    }
  }


  cleanfilter() {
    this.Filtros.fecha = '';
    this.Filtros.codigo = '';
    this.Filtros.funcionario = '';
    this.Filtros.origen = '';
    this.Filtros.destino = '';
    this.Filtros.tipo_origen = '';
    this.Filtros.tipo_destino = '';
    this.Filtros.moneda = '';
    this.Filtros.estado = '';
  }


}
