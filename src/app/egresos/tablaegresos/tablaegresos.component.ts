import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';
import { ToastService } from '../../shared/services/toasty/toast.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { EgresoService } from '../../shared/services/egresos/egreso.service';
import { GrupoterceroService } from '../../shared/services/grupotercero.service';

@Component({
  selector: 'app-tablaegresos',
  templateUrl: './tablaegresos.component.html',
  styleUrls: ['./tablaegresos.component.scss', '../../../style.scss']
})
export class TablaegresosComponent implements OnInit {

  public Egresos: Array<any> = [];
  public GruposTerceros: Array<any> = [];
  public Monedas: Array<any> = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;

  public AbrirModalAgregar: Subject<any> = new Subject<any>();

  public Filtros: any = {
    codigo: '',
    funcionario: '',
    grupo: '',
    tercero: '',
    moneda: '',
    valor: ''
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

  ShowSwal(tipo: string, titulo: string, msg: string, confirmCallback = null, cancelCallback = null) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }
  @ViewChild('alertSwal') alertSwal: any;

  constructor(private _generalService: GeneralService,
    private _swalService: SwalService,
    private _toastService: ToastService,
    private _monedaService: MonedaService,
    private _egresoService: EgresoService,
    private _grupoService: GrupoterceroService) {
    this.RutaGifCargando = _generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
    this.GetMonedas();
    this.GetGrupos();
  }

  ngOnInit() {
  }

  GetMonedas() {
    this._monedaService.getMonedas().subscribe((data: any) => {

      if (data.length > 0) {
        this.Monedas = data.query_data;
      } else {

        this.Monedas = [];
        this.ShowSwal('warning', 'Warning', 'No se encontraron registros!');

        // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        // this._toastService.ShowToast(toastObj);
      }
    });
  }

  AbrirModal(idEgreso: string) {
    this.AbrirModalAgregar.next(idEgreso);
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

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.funcionario.trim() != "") {
      params.funcionario = this.Filtros.funcionario;
    }

    if (this.Filtros.tercero.trim() != "") {
      params.tercero = this.Filtros.tercero;
    }

    if (this.Filtros.grupo.trim() != "") {
      params.grupo = this.Filtros.grupo;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
    }

    if (this.Filtros.moneda.trim() != "") {
      params.moneda = this.Filtros.moneda;
    }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {

    var p = this.SetFiltros(paginacion);

    // console.log('consulta filtrada ', p );
    if (p === '') {
      this.ResetValues();
      return;
    }

    // Danilo Custom switch para egresos 
    this.Cargando = true;
    this._egresoService.getListaEgresos(p).subscribe((data: any) => {

      // console.log('data egresos ', data);

      if (data.codigo == 'success') {
        let user = JSON.parse(localStorage['User']);
        switch (user.Id_Perfil) {
          case '6':
            this.Egresos = data.query_data
            break;
          default:
            this.Egresos = data.query_data.filter((egreso) => egreso.Identificacion_Funcionario == JSON.parse(localStorage['User']).Identificacion_Funcionario && new Date().toISOString().slice(0, 10) == new Date(egreso.Fecha).toISOString().slice(0, 10))
            break;
        }
        // this.TotalItems = data.numReg;
      } else {
        this.Egresos = [];
        this._swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion(this.Egresos);
    });
  }

  ResetValues() {
    this.Filtros = {
      codigo: '',
      funcionario: '',
      grupo: '',
      tercero: '',
      moneda: '',
      valor: ''
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


  AnularEgreso(idEgreso: string) {
    let datos = new FormData();
    datos.append("id_egreso", idEgreso);
    this._egresoService.anularEgreso(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ConsultaFiltrada();
        this.ShowSwal('success', 'Success', 'Operacion realizada correctamente!');

        // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        // this._toastService.ShowToast(toastObj);
      } else {
        // this._swalService.ShowMessage(data);
        this.ShowSwal('warning', 'Warning', data);

      }
    });
  }



  public GetGrupos() {
    this._grupoService.getGrupos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.GruposTerceros = data.query_data;
      } else {

        this.GruposTerceros = [];
        this.ShowSwal('warning', 'Warning', 'No se encontraron registros!');

        // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        // this._toastService.ShowToast(toastObj);
      }
    });
  }

}
