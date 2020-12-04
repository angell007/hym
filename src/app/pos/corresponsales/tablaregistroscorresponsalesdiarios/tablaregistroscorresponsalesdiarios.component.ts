import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { CorresponsalbancarioService } from '../../../shared/services/corresponsalesbancarios/corresponsalbancario.service';
import { HourPipe } from '../../../hour.pipe';

@Component({
  selector: 'app-tablaregistroscorresponsalesdiarios',
  templateUrl: './tablaregistroscorresponsalesdiarios.component.html',
  styleUrls: ['./tablaregistroscorresponsalesdiarios.component.scss', '../../../../style.scss'],
  providers: [HourPipe]
})
export class TablaregistroscorresponsalesdiariosComponent implements OnInit, OnDestroy {

  @Input() ActualizarTabla: Observable<any> = new Observable();

  @ViewChild('modalMensaje') modalMensaje: any

  private _updateTablaSubscription: any;

  public RegistrosCorresponsales: Array<any> = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;

  public Filtros: any = {
    remitente: '',
    recibo: '',
    recibido: '',
    transferido: '',
    tasa: '',
    estado: ''
  };

  public corresponsalEdit: any = {
    Consignacion: '',
    Fecha: '',
    Funcionario: '',
    Hora: '',
    Id_Caja: '',
    Id_Corresponsal_Bancario: '',
    Id_Corresponsal_Diario: '',
    Id_Moneda: '',
    Id_Oficina: '',
    Identificacion_Funcionario: '',
    Nombre: '',
    Retiro: '',
    Total_Corresponsal: '',
  }

  public CorresponsalesBancarios: Array<any> = [];

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
    // private _toastService: ToastService,
    private _corresponsalService: CorresponsalbancarioService) {
    this.RutaGifCargando = _generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
    this.ConsultaFiltrada();
  }

  ngOnInit() {
    this._updateTablaSubscription = this.ActualizarTabla.subscribe(data => {
      this.ConsultaFiltrada();
    });
  }

  ngOnDestroy(): void {
    if (this._updateTablaSubscription != null) {
      this._updateTablaSubscription.unsubscribe();
    }
  }

  SetFiltros(paginacion: boolean) {
    let params: any = {};

    // params.tam = this.pageSize;
    params.id_funcionario = this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario;

    if (paginacion === true) {
      params.pag = this.page;
    } else {
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    // if (this.Filtros.remitente.trim() != "") {
    //   params.remitente = this.Filtros.remitente;
    // }

    // if (this.Filtros.recibo.trim() != "") {
    //   params.recibo = this.Filtros.recibo;
    // }

    // if (this.Filtros.recibido.trim() != "") {
    //   params.recibido = this.Filtros.recibido;
    // }

    // if (this.Filtros.transferido.trim() != "") {
    //   params.transferido = this.Filtros.transferido;
    // }

    // if (this.Filtros.tasa.trim() != "") {
    //   params.tasa = this.Filtros.tasa;
    // }

    // if (this.Filtros.estado.trim() != "") {
    //   params.estado = this.Filtros.estado;
    // }

    return params;
  }

  ConsultaFiltrada(paginacion: boolean = false) {

    var p = this.SetFiltros(paginacion);

    if (p === '') {
      this.ResetValues();
      return;
    }

    this.Cargando = true;
    this._corresponsalService.GetRegistrosDiarios(p).subscribe((data: any) => {

      // console.log(data);

      if (data.codigo == 'success') {
        this.RegistrosCorresponsales = data.query_data;
        // this.TotalItems = data.numReg;
      } else {
        this.RegistrosCorresponsales = [];
        this._swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion(data.query_data);
    });
  }

  ResetValues() {
    this.Filtros = {
      remitente: '',
      recibo: '',
      recibido: '',
      transferido: '',
      tasa: '',
      estado: ''
    };
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

  GetCorresponsalesBancarios() {
    this._corresponsalService.getCorresponsales().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CorresponsalesBancarios = data.query_data;
      } else {
        this.CorresponsalesBancarios = [];
        // let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        // this._toastService.ShowToast(toastObj);
      }
    });
  }

  editarCorresponsal(data: any) {

    this.corresponsalEdit.Consignacion = data.Consignacion
    this.corresponsalEdit.Fecha = data.Fecha
    this.corresponsalEdit.Funcionario = data.Funcionario
    this.corresponsalEdit.Hora = data.Hora
    this.corresponsalEdit.Id_Caja = data.Id_Caja
    this.corresponsalEdit.Id_Corresponsal_Bancario = data.Id_Corresponsal_Bancario
    this.corresponsalEdit.Id_Corresponsal_Diario = data.Id_Corresponsal_Diario
    this.corresponsalEdit.Id_Moneda = data.Id_Moneda
    this.corresponsalEdit.Id_Oficina = data.Id_Oficina
    this.corresponsalEdit.Identificacion_Funcionario = data.Identificacion_Funcionario
    this.corresponsalEdit.Nombre = data.Nombre
    this.corresponsalEdit.Retiro = data.Retiro
    this.corresponsalEdit.Total_Corresponsal = data.Total_Corresponsal
    this.modalMensaje.show()

  }


  CerrarModal(id: any) {
    this.modalMensaje.hide()
  }
}
