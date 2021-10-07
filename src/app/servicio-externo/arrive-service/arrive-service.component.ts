import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, delay, tap } from 'rxjs/operators';
import { SexternosService } from '../../customservices/sexternos.service';
import { AccionTableroCajero } from '../../shared/Enums/AccionTableroCajero';
import { Globales } from '../../shared/globales/globales';
import { GeneralService } from '../../shared/services/general/general.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { PermisoService } from '../../shared/services/permisos/permiso.service';
import { ServiciosexternosService } from '../../shared/services/serviciosexternos/serviciosexternos.service';
import { SwalService } from '../../shared/services/swal/swal.service';
// import { SocketProviderConnect } from './web-socket.service';

@Component({
  selector: 'app-arrive-service',
  templateUrl: './arrive-service.component.html',
  styleUrls: ['./arrive-service.component.scss'],
  providers: [SexternosService]
})
export class ArriveServiceComponent implements OnInit {

  public Servicios: Array<any> = [];
  public Paises: any = [];
  public Monedas: any = [];
  public Cargando: boolean = false;
  public RutaGifCargando: string;
  public ListaServiciosExternos: any = [];

  public Total_Servicio: number = 0;
  public currentService: number = 0;


  public AbrirModalCrear: Subject<any> = new Subject<any>();

  public Filtros: any = {
    nombre: '',
    comision: '',
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

  /**************************************************************************************************************************************************************************************/

  public monedaPeso: any = [];

  Servicio2 = false;
  Servicio1 = true;
  public cajas_externo;

  public funcionario_data: any = this.generalService.SessionDataModel.funcionarioData;
  public IdOficina: any = this.generalService.SessionDataModel.idOficina;
  public IdCaja: any = this.generalService.SessionDataModel.idCaja;
  public tipoCliente: any = 'Cliente';
  public tercero: any = null;
  public ObservacionByFinalizar: any = null;

  public ServicioExternoModel: any = {
    Tercero: '',
    tipoCliente: '',
    Id_Funcionario_Destino: '',
    Id_Servicio: '',
    Servicio_Externo: '',
    Comision: '',
    Valor: '',
    Detalle: '',
    Id_Moneda: '',
    Estado: 'Activo',
    Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
    Id_Caja: this.IdCaja == '' ? '0' : this.IdCaja
  };

  public searchComisionServicio: Subject<string> = new Subject<string>();
  public searchComisionService$ = this.searchComisionServicio.asObservable();
  public comisionServicioSubscription: any;
  public Comision_Anterior_Servicio: number = 0;
  public corresponsalView: Subject<any> = new Subject<any>();


  @ViewChild('FormUploadEvidence') FormUploadEvidence: any;
  @ViewChild('ArchivoServicioExterno') ArchivoServicioExterno: ElementRef;
  @ViewChild('selectCustomClient') selectCustomClient: any;



  /**************************************************************************************************************************************************************************************/

  constructor(private generalService: GeneralService,
    private swalService: SwalService,
    public globales: Globales,
    private http: HttpClient,
    private servicioService: ServiciosexternosService,
    private _sexternos: SexternosService,
    private _monedaService: MonedaService,
    private permisoService: PermisoService,
  ) {
    this.RutaGifCargando = generalService.RutaImagenes + 'GIFS/reloj_arena_cargando.gif';
  }


  ngOnInit(): void {
    this.ConsultaFiltrada();
    this.search_caja_oficina();
    this.settearMoneda();
    this.getComision();
  }

  public getComision() {

    this.comisionServicioSubscription = this.searchComisionService$.pipe(
      debounceTime(500),
      switchMap(value => value != '' ?
        this.http.get(this.globales.ruta + 'php/serviciosexternos/comision_servicios.php', { params: { valor: value } }) : ''
      )
    ).subscribe((response: any) => {
      this.Comision_Anterior_Servicio = parseInt(response);
      this.ServicioExternoModel.Comision = parseInt(response);
      this.Total_Servicio = this.ServicioExternoModel.Valor + parseInt(response);
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

    if (this.Filtros.nombre.trim() != "") {
      params.nombre = this.Filtros.nombre;
    }

    if (this.Filtros.comision.trim() != "") {
      params.comision = this.Filtros.comision;
    }

    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
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
    this.servicioService.getServicios(p).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Servicios = data.query_data;
        this.TotalItems = data.numReg;
      } else {
        this.Servicios = [];
        this.swalService.ShowMessage(data);
      }

      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues() {
    this.Filtros = {
      nombre: '',
      comision: '',
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

  CambiarEstadoServicio(idServicio: string) {
    let datos = new FormData();
    datos.append("id_servicio_externo", idServicio);
    this.servicioService.cambiarEstadoServicio(datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.ConsultaFiltrada();
      }

      this.swalService.ShowMessage(data);
    });
  }




  /**************************************************************************************************************************************************************************************/

  CambiarVista(tipo) {

    switch (tipo) {
      case "Servicio":
        this.search_caja_oficina();
        this.Servicio2 = true;
        this.Servicio1 = false;
        this.ListaServiciosExternos = this.globales.ServiciosExternos
        break;
    }
  }


  search_caja_oficina() {
    this.http.get(this.globales.ruta + 'php/cajas/get_caja_funcionarios.php').subscribe(data => {
      this.cajas_externo = data;
    })
  }

  public ActualizarTablasServiciosExternos(tipo?) {
    console.log('updating', tipo);
    this._sexternos.CargarDatosServicios(tipo);
  }

  DescargarServicio(doc: string) {
    window.open(this.globales.ruta + 'php/serviciosexternos/descargar_documento.php?' + 'doc=' + doc, "_blank")
  }


  async settearMoneda() {
    await this.GetMonedas().then((monedas) => {
      this.monedaPeso = monedas.filter((moneda: any) => {
        return moneda.Id_Moneda == '2'
      })
    })
    this.monedaPeso = await Object.assign({}, this.monedaPeso[0])
  }

  // Custom pesos
  async GetMonedas() {
    return await this._monedaService.getMonedas().pipe().toPromise().then((data: any) => {
      if (data.codigo == 'success') {
        return data.query_data;
      } else {
        return [];
      }
    });
  }

  volverReciboServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
    this.Total_Servicio = 0;
  }


  public BloquearService(idService: Number) {
    this.http.post(this.globales.rutaNueva + 'locked-servicio-externo', { 'id': idService, 'funcionario': this.funcionario_data.Identificacion_Funcionario }).subscribe(data => {
      this.swalService.ShowMessage(['success', 'success', 'Buen trabajo !']);
      this.ActualizarTablasServiciosExternos();
    })
  }

  public showModal(modal: any, currentService: any) {
    this.currentService = currentService;
    modal.show();
  }

  public TranslateService(modal: any) {
    modal.hide();
    this.http.post(this.globales.rutaNueva + 'translate-servicio-externo', { 'id': this.currentService, 'funcionario': this.ServicioExternoModel.Id_Funcionario_Destino }).subscribe(data => {
      this.ActualizarTablasServiciosExternos();
      this.swalService.ShowMessage(['success', 'success', 'Buen trabajo !']);
    })
  }

  public showModalTranslate(modal: any, currentService: any) {
    this.currentService = currentService;
    modal.show();
  }

  public OcultarFormularios(modal) {
    modal.hide();
  }

  public saveFinaliceService(modal) {
    let datos = new FormData();

    if (this.ArchivoServicioExterno.nativeElement.files.length === 1) {
      let archivo = this.ArchivoServicioExterno.nativeElement.files[0];
      datos.append('archivo', archivo);
      datos.append('id', String(this.currentService));
      datos.append('tipoCliente', String(this.tipoCliente));
      datos.append('documento', String(this.tercero.Id_Tercero));
      datos.append('ObservacionByFinalizar', String(this.ObservacionByFinalizar));
      datos.append('funcionario', String(this.funcionario_data.Identificacion_Funcionario));

      this.http.post(this.globales.rutaNueva + 'terminar_servicio', datos).subscribe(data => {
        modal.hide();
        this.ActualizarTablasServiciosExternos();
        this.swalService.ShowMessage(['success', 'success', 'Buen trabajo !']);
        this.currentService = 0;

      })
    }
  }


  search_destino3 = (text$: Observable<string>) => text$.pipe(distinctUntilChanged(), switchMap(term => term.length < 2 ? [] : this.http.get(this.globales.rutaNueva + 'terceros-filter', { params: { id_destinatario: term, tipo: this.selectCustomClient.nativeElement.value } }).map((response) => {
    return response;
  }).do((data) => data)));

  formatterClienteCambioCompra = (x: { Nombre: string }) => x.Nombre;


  download(file) {
    window.open(this.globales.rutaNueva + 'main/public/file/' + file, "_blank")
  }

  printReciboExternoPagado(id) {
    this.http.get(this.globales.rutaNueva + 'print-cambio', { params: { id: id, modulo: 'externoPagado' }, responseType: 'blob' }).subscribe((data: any) => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  AsignarComisionServicioExterno2() {

    let valorAsignado = this.ServicioExternoModel.Valor;

    if (valorAsignado == '' || valorAsignado == undefined || valorAsignado == '0') {
      this.swalService.ShowMessage(['warning', 'Alerta', 'El valor no puede estar vacio ni ser 0!']);
      this.ServicioExternoModel.Valor = '';
      this.ServicioExternoModel.Comision = '';
      this.Total_Servicio = 0;
      return;
    } else {
      this.searchComisionServicio.next(valorAsignado);
    }
  }


  public AprobarCambioComision() {
    let comision = this.ServicioExternoModel.Comision;
    if (comision != '') {
      let p = { accion: "servicio_externo", value: comision };
      this.permisoService._openSubject.next(p);
    } else {
      this.swalService.ShowMessage(['warning', 'Alerta', 'La comisión no puede ser 0 ni estar vacia!']);
    }
  }

  GuardarServicio(formulario: NgForm, modal, tipo: string = 'creacion', tipo2) {

    if (this.ServicioExternoModel.Servicio_Externo == '' || this.ServicioExternoModel.Valor == '' || this.ServicioExternoModel.Comision == '') {
      this.swalService.ShowMessage(['warning', 'Alerta', 'Ingrese valores !']);
      return
    }

    let info = this.generalService.normalize(JSON.stringify(this.ServicioExternoModel));
    let datos = new FormData();

    if (tipo == 'creacion') {
      if (this.ArchivoServicioExterno.nativeElement.files.length === 1) {
        let archivo = this.ArchivoServicioExterno.nativeElement.files[0];
        datos.append('archivo', archivo);
      }
    }

    datos.append("modulo", 'Servicio');
    datos.append('id_oficina', this.IdOficina);
    datos.append("datos", info);
    datos.append("origin", 'admin');
    datos.append("tercero", this.ServicioExternoModel.Tercero['Id_Tercero']);


    this.http.post(this.globales.ruta + 'php/serviciosexternos/guardar_servicio.php', datos).subscribe((data: any) => {
      if (data.codigo == 'success') {

        this.LimpiarModeloServicios(tipo);
        this.volverServicio();
        this._sexternos.CargarServiciosDiarios(this._sexternos.FiltrosRealizados);
      }
      this.swalService.ShowMessage(data);
    });
  }


  LimpiarModeloServicios(tipo: string) {
    this.ServicioExternoModel = {
      Id_Servicio: '',
      Servicio_Externo: '',
      Comision: '',
      Valor: '',
      Detalle: '',
      Estado: 'Activo',
      Identificacion_Funcionario: this.funcionario_data.Identificacion_Funcionario,
      Id_Caja: this.generalService.SessionDataModel.idCaja
    };
    this._sexternos.ResetValues();
    this.Total_Servicio = 0;
  }

  volverServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
    this.corresponsalView.next(AccionTableroCajero.Cerrar);
    this.LimpiarModeloServicios('creacion');
  }

  /**************************************************************************************************************************************************************************************/


}
