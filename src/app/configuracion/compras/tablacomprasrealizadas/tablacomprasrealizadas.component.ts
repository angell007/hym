import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { MonedaService } from '../../../shared/services/monedas/moneda.service';
import { CompraService } from '../../../shared/services/compra/compra.service';

@Component({
  selector: 'app-tablacomprasrealizadas',
  templateUrl: './tablacomprasrealizadas.component.html',
  styleUrls: ['./tablacomprasrealizadas.component.scss', '../../../../style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TablacomprasrealizadasComponent implements OnInit {

  public Compras: Array<any> = [];
  public Monedas: Array<any> = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;

  public Filtros: any = {
    fecha: '',
    codigo: '',
    funcionario: '',
    tercero: '',
    moneda: '',
    valor: '',
    tasa: '',
    valor_peso: ''
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

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _toastService: ToastService,
    private _monedaService: MonedaService,
    private _compraService: CompraService) {
    this.RutaGifCargando = _generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    this.GetMonedas();
  }

  ngOnInit() {
  }

  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      } else {

        this.Monedas = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
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

    if (this.Filtros.tercero.trim() != "") {
      params.tercero = this.Filtros.tercero;
    }

    if (this.Filtros.moneda.trim() != "") {
      params.moneda = this.Filtros.moneda;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
    }

    if (this.Filtros.tasa.trim() != "") {
      params.tasa = this.Filtros.tasa;
    }

    if (this.Filtros.valor_peso.trim() != "") {
      params.valor_peso = this.Filtros.valor_peso;
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
    this._compraService.getListaCompra(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Compras = data.query_data;
        this.TotalItems = data.numReg;

        console.log(data.query_data);

      } else {
        this.Compras = [];
        this._swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues() {
    this.Filtros = {
      fecha: '',
      codigo: '',
      funcionario: '',
      tercero: '',
      moneda: '',
      valor: '',
      tasa: '',
      valor_peso: ''
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

  AnularCompra(idCompra: string) {
    let datos = new FormData();
    datos.append("id_compra", idCompra);
    this._compraService.anularCompra(datos).subscribe((data: any) => {
      // if (data.codigo == 'success') {
      this.ConsultaFiltrada();
      let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
      this._toastService.ShowToast(toastObj);
      // } else {
      //   this._swalService.ShowMessage(data);
      // }
    });
  }



}
