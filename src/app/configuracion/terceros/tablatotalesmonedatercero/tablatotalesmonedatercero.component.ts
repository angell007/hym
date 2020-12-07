import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { MovimientoterceroService } from '../../../shared/services/movimientostercero/movimientotercero.service';
import { CustomcurrencyPipe } from '../../../common/Pipes/customcurrency.pipe';
import { TerceroService } from '../../../shared/services/tercero/tercero.service';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';

@Component({
  selector: 'app-tablatotalesmonedatercero',
  templateUrl: './tablatotalesmonedatercero.component.html',
  styleUrls: ['./tablatotalesmonedatercero.component.scss', '../../../../style.scss']
})
export class TablatotalesmonedaterceroComponent implements OnInit, OnChanges {

  @Input() Id_Moneda: string;
  @Input() Id_Tercero: string;

  public MovimientosTercero: Array<any> = [];
  public Movimientos: Array<any> = [];
  public MostrarTotales: boolean = false;
  public Balance: string = "0";
  public TotalesMonedas: Array<any> = [];
  public totalObj: any = { Total: "0" };
  public AbrirModalAgregar: Subject<any> = new Subject<any>();
  public Cargando: boolean = false;
  public RutaGifCargando: string;
  public CodigoMonedaActual: string = '';

  public Filtros: any = {
    fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_fin: new Date().toISOString().slice(0, 10),
    movimiento: '',
    cajero: '',
    detalle: ''
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

  constructor(private _monedaService: MonedaService,
    private _toastService: ToastService,
    private _swalService: SwalService,
    private _movimientoService: MovimientoterceroService,
    private _customCurrency: CustomcurrencyPipe,
    private _terceroService: TerceroService,
    private _generalService: GeneralService) {
    this.RutaGifCargando = _generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';

  }

  ngOnInit() {
    this.ConsultaFiltrada();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.Id_Moneda.previousValue != undefined) {
      this.ConsultaFiltrada();
    }
  }

  GetTotalesMonedas() {
    this._terceroService.getTotalesMonedasTercero(this.Id_Tercero).subscribe((data: any) => {
      if (data.length > 0) {
        this.TotalesMonedas = data;
      } else {
        this.TotalesMonedas = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }

      this.ActualizarBalance();
    });
  }

  GetMovimientos() {
    // // if (this.Id_Moneda != '' && this.Id_Moneda != undefined) {
    // //   this._movimientoService.getMovimientosTercero(this.Id_Tercero, this.Id_Moneda).subscribe((data:any) => {
    // //     if (data.codigo == 'success') {
    // //       this.MovimientosTercero = data.query_data;
    // //       this.Movimientos = data.query_data.movimientos;
    // //       this.MostrarTotales = true;
    // //     }else{
    // //       this.MovimientosTercero = [];
    // //       this.Movimientos = [];
    // //       this.MostrarTotales = false;
    // //       let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
    // //       this._toastService.ShowToast(toastObj);
    // //     }  

    // //     this.GetTotalesMonedas();
    // //   });  
    // }    
  }

  ActualizarBalance() {
    if (this.TotalesMonedas.length > 0) {
      this.totalObj = this.TotalesMonedas.find(x => x.Id_Moneda == this.Id_Moneda);
      this.Balance = this._customCurrency.transform(this.totalObj.Total, this.totalObj.Codigo);
    } else {
      this.Balance = '0';
    }
  }

  AbrirModal(idMovimiento: string) {
    let obj = { id_movimiento: idMovimiento, id_moneda: this.Id_Moneda, id_tercero: this.Id_Tercero };
    this.AbrirModalAgregar.next(obj);
  }

  AnularMovimientoTercero(idMovimiento: string) {
    let datos = new FormData();
    datos.append("id_movimiento", idMovimiento);
    this._movimientoService.anularMovimientoTercero(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.GetMovimientos();
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      } else {
        this._swalService.ShowMessage(data);
      }
    });
  }

  private SetFiltros(paginacion: boolean) {
    let params: any = {};

    params.id_tercero = this.Id_Tercero;

    if (this.Id_Moneda == '') {
      this.Id_Moneda = '1';
    }

    params.id_moneda = this.Id_Moneda;
    params.tam = this.pageSize;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.fecha_inicio.trim() != "") {
      params.fecha_inicio = this.Filtros.fecha_inicio;
    }

    if (this.Filtros.fecha_fin.trim() != "") {
      params.fecha_fin = this.Filtros.fecha_fin;
    }

    if (this.Filtros.movimiento.trim() != "") {
      params.movimiento = this.Filtros.movimiento;
    }

    if (this.Filtros.cajero.trim() != "") {
      params.cajero = this.Filtros.cajero;
    }

    if (this.Filtros.detalle.trim() != "") {
      params.detalle = this.Filtros.detalle;
    }

    return params;
  }

  public ConsultaFiltrada(paginacion: boolean = false) {

    var p = this.SetFiltros(paginacion);

    console.log(p);

    this.Cargando = true;
    this._movimientoService.getMovimientosTercero(p).subscribe((data: any) => {

      if (data.codigo == 'success') {
        this.MovimientosTercero = data.query_data;
        this.Movimientos = data.query_data.movimientos;
        this.MostrarTotales = true;
        this.TotalItems = data.numReg;
        this.Balance = data.balance;
        this.CodigoMonedaActual = data.codigo_moneda;
      } else {
        this.MovimientosTercero = [];
        this.Movimientos = [];
        this.CodigoMonedaActual = data.codigo_moneda;
        this.Balance = '0';
        this.MostrarTotales = false;
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  private SetInformacionPaginacion() {
    var calculoHasta = (this.page * this.pageSize);
    var desde = calculoHasta - this.pageSize + 1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }

}
