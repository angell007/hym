import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tablerocajero',
  templateUrl: './tablerocajero.component.html',
  styleUrls: ['./tablerocajero.component.scss']
})
export class TablerocajeroComponent implements OnInit {
  public IdentificacionFuncionario: any[];
  public Destinatarios: any[] = [];
  public Remitentes: any[] = [];
  public Paises: any[] = [];
  public Bancos: any[] = [];
  public TipoCuentas: any[] = [];
  public Clientes: any[] = [];
  public DestinatariosFiltrados: any[] = [];
  public RemitentesFiltrados: any[] = [];
  public DatosRemitente: any[] = [];
  public Funcionarios: any[] = [];
  public ServiciosExternos: any[] = [];
  public CorresponsalesBancarios: any[] = [];
  public Documentos: any[];
  public Cuentas: any[] = [{
    Id_Destinatario: '',
    Id_Pais: "",
    Id_Banco: '',
    Numero_Cuenta: '',
    Id_Tipo_Cuenta: ''
  }];

  public Envios: any[] = [{
    Destino: '',
    Numero_Documento_Destino: '',
    Nombre: '',
    Id_Destinatario_Cuenta: '',
    Valor_Transferencia_Bolivar: '',
    Valor_Transferencia_Peso: '',
    Cuentas: [],
    esconder: false,
    disabled: false
  }];
  public CuentasDestinatario: any[];
  public Cajas: any[];
  public Cambios: any[];
  public Monedas: any[];
  public Recibe: any = "Transferencia";
  public MonedaRecibe: any = "Bolivares";
  public IdCorresponsal: number;
  public IdOficina: number;
  public IdCaja: number;
  public Estado: string;
  public DetalleCorresponsal: string;
  public Detalle: any[];
  public Indice: any[];

  public MonedaRecibida: any;
  public Cedula: any[];
  public IdRemitente: any[];
  public FormaPago: string;
  public Costo: number;
  public PrecioSugeridoEfectivo: any;
  public CantidadRecibida: number;
  public CantidadTransferida: number;
  public ValorTotal: number;
  public ValorEntrega: number;
  public ValorCorresponsal: number;
  public CorresponsalBancario: number;
  public ComisionServicioExterno: number;
  public Comision: number = 0;
  public NumeroDocumentoR: number = 0;

  //Bool validaciones
  public boolFormaPago: boolean = false;
  public boolRecibePara: boolean = false;
  public boolSeleccioneCliente: boolean = false;
  public boolNumeroDocumento: boolean = false;

  //Valores por defecto
  formaPagoDefault: string = "Efectivo";
  recibeParaDefault: string = "Transferencia";
  seleccioneClienteDefault: string = "";
  //numeroDocumentoDefault: string = "";

  @ViewChild('ModalDestinatario') ModalDestinatario: any;
  @ViewChild('ModalRemitente') ModalRemitente: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('warnSwal') warnSwal: any;
  @ViewChild('warnTotalSwal') warnTotalSwal: any;
  @ViewChild('destinatarioCreadoSwal') destinatarioCreadoSwal: any;
  @ViewChild('remitenteCreadoSwal') remitenteCreadoSwal: any;
  @ViewChild('bancoNoIdentificadoSwal') bancoNoIdentificadoSwal: any;
  @ViewChild('transferenciaExitosaSwal') transferenciaExitosaSwal: any;
  @ViewChild('movimientoExitosoSwal') movimientoExitosoSwal: any;
  @ViewChild('ModalHistorial') ModalHistorial: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('ModalTrasladoEditar') ModalTrasladoEditar: any;
  @ViewChild('ModalServicioEditar') ModalServicioEditar: any;
  @ViewChild('ModalGiroEditar') ModalGiroEditar: any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario: any;
  @ViewChild('ModalCrearDestinatarioTransferencia') ModalCrearDestinatarioTransferencia: any;
  @ViewChild('ModalAnularTransferencia') ModalAnularTransferencia: any;

  @ViewChild('FormMoneda') FormMoneda: any;
  @ViewChild('FormTransferencia') FormTransferencia: any;
  @ViewChild('FormGiro') FormGiro: any;
  @ViewChild('FormTraslado') FormTraslado: any;
  @ViewChild('FormCorresponsal') FormCorresponsal: any;
  @ViewChild('FormServicio') FormServicio: any;
  @ViewChild('ModalVerRecibo') ModalVerRecibo: any;
  @ViewChild('ModalSaldoInicio') ModalSaldoInicio: any;
  @ViewChild('ModalVerCambio') ModalVerCambio: any;
  @ViewChild('ModalAprobarGiro') ModalAprobarGiro: any;
  @ViewChild('confirmacionGiro') confirmacionGiro: any;

  vueltos: number;
  Venta = false;
  TextoBoton = "Vender";
  entregar: any;
  cambiar: any;
  MonedaOrigen: any;
  MonedaDestino: any = "Pesos";
  Tipo: string;
  Cambios1 = true;
  Cambios2 = false
  Transferencia = [];
  Transferencia1 = true;
  Transferencia2 = false;
  Traslado1 = true;
  Traslado2 = false;
  LimiteOficina: any;
  public MonedaTransferencia: any;
  MonedaTasaCambio: boolean;
  MonedaComision: boolean;
  PrecioSugeridoTransferencia: any;
  Historial = false;
  HistorialCliente = [];
  Giro1 = true;
  Giro2 = false;



  Giros = [];
  Departamentos = [];
  Municipios_Remitente = [];
  Municipios_Destinatario = [];
  GiroComision = [];
  ValorEnviar: any;
  Departamento_Remitente: any;
  Departamento_Destinatario: any;
  FuncionariosCaja = [];
  Funcionario: any;
  Traslados = [];
  idTraslado: any;
  Traslado = [];
  TrasladosRecibidos = [];
  ServicioComision = [];
  ValorComisionServicio: any;
  Servicio2 = false;
  Servicio1 = true;
  Servicios = [];
  Servicio = [];
  Giro = [];
  idGiro: any;
  Remitente = [];
  Destinatario = [];
  Tercero = [];
  CuentaBancaria = [];
  defectoDestino: string;
  defectoOrigen: string;
  MaxEfectivo: any;
  MinEfectivo: any;
  MaxCompra: any;
  MinCompra: any;
  PrecioSugeridoEfectivo1: any;
  MonedaRecibidaTransferencia: number;
  maximoTransferencia: any;
  minimoTransferencia: any;
  ActivarEdicion = false;
  Detalle_Destinatario = [];
  Lista_Destinatarios = [{
    Id_Pais: '2',
    Id_Banco: '',
    Bancos: [],
    Id_Tipo_Cuenta: '',
    Numero_Cuenta: '',
    Otra_Cuenta: '',
    Observacion: ''
  }];
  Identificacion: any;
  TipoDocumentoExtranjero = [];
  posiciontemporal: any;
  credito = false;
  consignacion = false;
  efectivo = true;
  Id_Destinatario: any;
  frame = false;
  urlCne: string;
  botonDestinatario = false;
  idTransferencia: any;
  frameRiff = false;
  urlRiff: string;
  DestinatarioCuenta = [];
  PrecioSugeridoCompra: any;
  IdentificacionCrearDestinatario: any;
  EncabezadoRecibo = [];
  DestinatarioRecibo = [];

  MontoInicial: any = 0;
  CierreCajaAyer: any = 0;
  IdDiario: any;
  verCambio = [];
  currencyOrigen: any;
  currencyDestino: any;
  cupoTercero: any;
  SaldoBolivar: any;
  tasaCambiaria: any;

  constructor(private http: HttpClient, private globales: Globales, public sanitizer: DomSanitizer) { }
  CierreCajaAyerBolivares = 0;
  MontoInicialBolivar = 0;

  GirosAprobados = [];

  ngOnInit() {

    this.actualizarVista();
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.IdOficina = JSON.parse(localStorage['Oficina']);
    this.IdCaja = JSON.parse(localStorage['Caja']);
    //this.Costo = 1;
    this.Estado = "Enviado";
    this.FormaPago = "Efectivo";
    this.MonedaRecibidaTransferencia = 2;
    this.Bancos_Pais(2, 0);
    this.bancosDestinatarios();

    //hacer la peticion si este usuario tiene un 'diario' ya registrado en la DB y si el saldo de inicio es vacio

    this.http.get(this.globales.ruta + 'php/diario/detalle_diario.php', { params: { id: this.IdentificacionFuncionario } }).subscribe((data: any) => {

      if (data.hoy[0]) {
        this.MontoInicial = data.hoy[0].MontoInicial;
        this.MontoInicialBolivar = data.hoy[0].MontoInicialBolivar;
        this.IdDiario = data.hoy[0].Diario;

        if (data.hoy[0].MontoInicial == "0" && data.hoy[0].MontoInicialBolivar == "0") {
          this.ModalSaldoInicio.show();
        }
      }

      if (data.ayer[0]) {
        this.CierreCajaAyer = data.ayer[0].MontoCierre;
        this.CierreCajaAyerBolivares = data.ayer[0].MontoCierreBolivar
      }


    });
  }



  GuardarMontoInicial(formulario: NgForm, modal) {

    var peso = formulario.value.Monto_Inicio;
    var bolivares = formulario.value.Monto_Inicio_Bolivar;

    if (peso > 0 && bolivares > 0) {
      let info = JSON.stringify(formulario.value);
      let datos = new FormData();
      datos.append("datos", info);
      datos.append("id", JSON.parse(localStorage['User']).Identificacion_Funcionario);
      datos.append("caja", "5");
      datos.append("oficina", "4");
      datos.append("idDiario", this.IdDiario);
      this.http.post(this.globales.ruta + 'php/diario/apertura_caja.php', datos)
        .catch(error => {
          console.error('An error occurred:', error.error);
          this.errorSwal.show();
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          formulario.reset();
          this.confirmacionSwal.title = "Apertura de caja";
          this.confirmacionSwal.text = "Se ha realizado la apertura de caja exitosamente";
          this.confirmacionSwal.type = "success";
          this.confirmacionSwal.show();
          modal.hide();

        });
    } else {
      this.confirmacionSwal.title = "Ojo";
      this.confirmacionSwal.text = "No se puede aperturar caja con los valores digitados, por favor compruebe";
      this.confirmacionSwal.type = "warning";
      this.confirmacionSwal.show();
    }

  }


  HabilitarGuardar(valor) {
    if (valor.length > 0) {
      if (this.Recibe == 'Cliente') {
        (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = false;
      } else {
        (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = false;
      }
    } else {
      if (this.Recibe == 'Cliente') {
        (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = true;
      } else {
        (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
      }
    }

  }

  bancosDestinatarios() {
    this.http.get(this.globales.ruta + '/php/destinatarios/cuenta_bancaria_destinatario.php').subscribe((data: any) => {
      this.DestinatarioCuenta = data;
    });
  }

  ngAfterViewInit() {
    if (this.recibeParaDefault == "Transferencia") {
      this.CambiarTasa(1);
      this.MonedaTransferencia = 1;
    }

    //(document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = true;

  }

  search_destino = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Destinatarios.filter(v => v.Id_Destinatario.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_destino = (x: { Id_Destinatario: string }) => x.Id_Destinatario;

  search_remitente = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Remitentes.filter(v => v.Id_Transferencia_Remitente.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_remitente = (x: { Id_Transferencia_Remitente: string }) => x.Id_Transferencia_Remitente;

  search_cuenta = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Remitentes.filter(v => v.Numero_Cuenta.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  formatter_cuenta = (x: { Numero_Cuenta: string }) => x.Numero_Cuenta;

  muestra_tabla(id) {
    var tot = document.getElementsByClassName('modulos').length;
    for (let i = 0; i < tot; i++) {
      var id2 = document.getElementsByClassName('modulos').item(i).getAttribute("id");
      document.getElementById(id2).style.display = 'none';

      this.volverCambioEfectivo();
      this.volverReciboTransferencia();
      this.volverReciboGiro();
      this.volverTraslado();
      this.volverServicio();
      this.volverReciboServicio();

    }
    document.getElementById(id).style.display = 'block';
  }

  AutoCompletarDestinatario(modelo, i) {
    if (modelo.Cuentas != undefined) {
      this.Envios[i].Numero_Documento_Destino = modelo.Id_Destinatario;
      this.Envios[i].Nombre = modelo.Nombre;
      this.Envios[i].Cuentas = modelo.Cuentas;
      this.Envios[i].esconder = true;
    } else {
      this.Envios[i].esconder = false;
    }
  }

  CrearDestinatrioModal(value, pos) {
    this.posiciontemporal = pos;
    var encontrar = this.Destinatarios.findIndex(x => x.Id_Destinatario === value);

    if (encontrar == -1) {
      var longitud = this.LongitudCarateres(value)
      if (longitud > 6) {
        this.IdentificacionCrearDestinatario = value;
        this.ModalCrearDestinatarioTransferencia.show();
        this.Id_Destinatario = value;
        this.Lista_Destinatarios = [{
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        }];
      }
      this.Bancos_Pais(2, 0);
    }
  }

  LongitudCarateres(i) {
    return parseInt(i.length);
  }

  BuscarCNE(valor) {

    var cedula = this.Id_Destinatario;
    if (cedula == undefined) {
      cedula = (document.getElementById("idDestinatario") as HTMLInputElement).value;
    }

    switch (valor) {
      case "V": {
        //this.frame = true;
        this.urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula;
        window.open("http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=" + cedula, '_blank');
        break;
      }
      case "E": {
        //this.frame = true;
        this.urlCne = "http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula;
        window.open("http://www4.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=E&cedula=" + cedula, '_blank');
        break;
      }
      default: {
        this.frame = false;
      }
      /*if (window.frames['myframe'] && !userSet){
         this.setAttribute('data-userset', 'true');
         frames['myframe'].location.href='http://test.com/hello?uname='+getUserName();
     }*/
    }


  }

  buscarRiff() {
    this.urlRiff = "http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp";
    //this.frameRiff = !this.frameRiff;
    window.open("http://contribuyente.seniat.gob.ve/BuscaRif/BuscaRif.jsp", '_blank');
  }

  recargarBancos(i, id) {
    this.http.get(this.globales.ruta + 'php/pos/cuentas_destinatarios.php', { params: { id: id } }).subscribe((data: any) => {
      this.Envios[i].Cuentas = data.Numero_Cuenta;
      this.ActivarEdicion = true;
    });
  }

  recargarDestinatario() {
    this.http.get(this.globales.ruta + 'php/pos/lista_destinatarios.php').subscribe((data: any) => {
      this.Destinatarios = data;
    });
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  ResetValues() {
    //////////console.log("resetear valores");
    this.PrecioSugeridoEfectivo = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Sugerido_Venta;
    this.MonedaTransferencia = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Nombre;
    this.MonedaRecibida = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Pesos")].Nombre;
  }

  GuardarMovimiento(formulario: NgForm) {

    formulario.value.Id_Oficina = 5;
    formulario.value.Id_Caja = 4;
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Tipo_Oficina = localStorage['Tipo_Oficina'];
    formulario.value.Cantidad_Transferida = this.entregar;
    var index = this.Monedas.findIndex(x=>x.Id_Moneda === formulario.value.Moneda_Destino);
    formulario.value.Moneda_Destino = this.Monedas[index].Nombre;
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info); 
    this.http.post(this.globales.ruta + 'php/pos/movimiento.php', datos)
    //this.http.post(this.globales.ruta + 'php/transferencias/pruebas_envio_transferencia.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.opcionDefaultFormaPago = "Efectivo";
        this.opcionTipoTransferencia  = "Transferencia";
        this.seleccioneClienteDefault = "";
        this.movimientoExitosoSwal.show();
        //////////console.log(data);
        this.TipoPagoTransferencia("Efectivo");
        this.Transferencia1 = true;
        this.Transferencia2 = false;
        this.actualizarVista();
        this.VerificarTipoTransferencia();
      });
  }

  AutoCompletarCuenta(modelo) {
    if (modelo) {
      if (modelo.length > 0) {
        this.CuentasDestinatario = this.CuentasDestinatario.filter(number => number.Id_Destinatario.slice(0, modelo.length) == modelo);
      }
      else {
        this.CuentasDestinatario = null;
      }
    }
  }

  LlenarValoresDestinatario(destinatario, index) {
    this.Indice = index;
    this.CuentasDestinatario = null;
    if (destinatario.length == 0) {
      return;
    }
    if (destinatario.length < 5 && destinatario.length > 0) {
      this.warnSwal.show();
    }
    else {
      this.http.get(this.globales.ruta + 'php/pos/cuentas_destinatarios.php', { params: { id: destinatario, nombre: destinatario } }).subscribe((data: any) => {

        if (data.length == 0) {
          this.Envios[index].Numero_Documento_Destino = 0;
          this.CrearDestinatario(destinatario);
        }
        else {
          this.Envios[index].Cuentas = data;
          this.CuentasDestinatario = data;
          (document.getElementById("Numero_Documento_Destino" + index) as HTMLInputElement).value = data[0].Id_Destinatario;
          this.Envios.push({
            Destino: '',
            Numero_Documento_Destino: '',
            Nombre: '',
            Id_Destinatario_Cuenta: '',
            Valor_Transferencia_Bolivar: 0,
            Valor_Transferencia_Peso: 0,
            Cuentas: [],
            esconder: false,
            disabled: false
          });
        }
      });
    }
  }

  AutoSumaBolivares(pos, valor) {
    var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
    this.Envios[pos].Valor_Transferencia_Peso = (parseInt(valor) * parseInt(divisor));
    this.Envios[pos].Valor_Transferencia_Bolivar = Math.round(this.Envios[pos].Valor_Transferencia_Peso / parseInt(divisor));
    this.AutoSuma(pos);
  }

  AutoSumaPeso(pos, valor) {
    var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
    this.Envios[pos].Valor_Transferencia_Bolivar = Math.round(parseInt(valor) / parseInt(divisor));
    this.Envios[pos].Valor_Transferencia_Peso = (this.Envios[pos].Valor_Transferencia_Bolivar * parseInt(divisor));
    this.AutoSuma(pos);
  }



  validarCamposBolivares(valor) {
    var longitud = 0;
    longitud = this.LongitudCarateres(valor);
    if (longitud > 0) {
      (document.getElementById("Valor_Transferencia_Bolivar0") as HTMLInputElement).disabled = false;
    } else {
      (document.getElementById("Valor_Transferencia_Bolivar0") as HTMLInputElement).disabled = true;
    }

  }

  EliminarDestinatario(index) {
    if (index > 0) {
      this.Envios.splice(index, 1);
    }
  }

  LlenarValoresRemitente(remitente) {
    this.DatosRemitente = [];
    if (remitente.length == 0) {
      return;
    }
    if (remitente.length < 5 && remitente.length > 0) {
      this.warnSwal.show();
    }
    else {
      this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Transferencia_Remitente', id: remitente } }).subscribe((data: any) => {
        if (data.length == 0) {
          this.NumeroDocumentoR = 0;
          this.CrearRemitente(remitente);
        }
        else {
          this.DatosRemitente = data;
        }
      });
    }
  }

  CrearRemitente(remitente) {
    this.ModalRemitente.show();
    this.IdRemitente = remitente;
  }


  CrearDestinatario(destinatario) {
    this.Cuentas = [{
      Id_Destinatario: '',
      Id_Pais: "",
      Id_Banco: '',
      Numero_Cuenta: '',
      Id_Tipo_Cuenta: ''
    }];
    this.ModalDestinatario.show();
    for (let i = 0; i < this.Cuentas.length; ++i) {
      this.Cuentas[i].Id_Destinatario = destinatario;
    }
    this.Cedula = destinatario;
  }

  AutoSeleccionarBanco(identificador: string, indice) {
    if (this.Bancos.filter(banco => banco.Identificador == identificador).length > 0) {
      this.Cuentas[indice].Banco = this.Bancos.filter(banco => banco.Identificador == identificador)[0].Nombre;
    }
  }

  AgregarFormCuenta() {
    let agregar: boolean = true;
    for (let i = 0; i < this.Cuentas.length; ++i) {
      if (this.Cuentas[i].Banco === "" || this.Cuentas[i].Pais === "" || this.Cuentas[i].Numero_Cuenta === "") {
        agregar = false;
        return;
      }
    }
    if (agregar) {
      this.Cuentas.push({
        Id_Destinatario: this.Cedula,
        Id_Pais: "",
        Id_Banco: '',
        Numero_Cuenta: '',
        Id_Tipo_Cuenta: ''
      });
    }
  }

  EliminarFormCuenta(index) {
    this.Cuentas.splice(index, 1);
  }

  recargarVistaDestinatario(identificador, i) {
    this.http.get(this.globales.ruta + 'php/pos/detalle_lista_destinatario.php', { params: { id: identificador } }).subscribe((data: any) => {
      this.Envios[i].Cuentas = data[0].Cuentas;
      this.Envios[i].Numero_Documento_Destino = data[0].Id_Destinatario;
      this.Envios[i].Nombre = data[0].Nombre;
      this.Envios[i].esconder = true;
    });
  }

  GuardarDestinatario(formulario: NgForm, modal) {

    this.Lista_Destinatarios.forEach((element, index) => {
      if (element.Numero_Cuenta == "") {
        this.Lista_Destinatarios.splice(index, 1);
      }
    });

    let info = JSON.stringify(formulario.value);
    let cuentas = JSON.stringify(this.Lista_Destinatarios);
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("destinatario", cuentas);

    this.http.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        //autocompletar destinatario
        var i = this.posiciontemporal
        this.recargarVistaDestinatario(this.IdentificacionCrearDestinatario, i);

        this.destinatarioCreadoSwal.show();
        formulario.reset();
        modal.hide();
        this.recargarDestinatario();
        this.Lista_Destinatarios = [{
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        }];

      });
    //this.actualizarVista();
  }

  GuardarRemitente(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", "Transferencia_Remitente");
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        //////////console.log(data);
        this.LlenarValoresRemitente(formulario.value.Id_Transferencia_Remitente);
        this.ModalRemitente.hide();
        this.remitenteCreadoSwal.show();
        formulario.reset();
      });
  }

  RealizarCambio(value, accion) {
    //////////console.log(value);    
    if (this.MonedaRecibida != this.MonedaTransferencia) {
      switch (accion) {
        case "transferir":
          this.CantidadTransferida = value * this.PrecioSugeridoEfectivo;
          break;

        case "recibir":
          this.CantidadRecibida = value / this.PrecioSugeridoEfectivo;
          break;
      }
    }
  }

  SeleccionarMonedaRecibe(moneda) {
    this.MonedaRecibe = moneda;
    var origen = ((document.getElementById("Moneda_Origen") as HTMLInputElement).value);

    if (parseInt(origen) > 0) {
      this.PrecioSugeridoEfectivo = this.Monedas[(parseInt(origen) - 1)].Sugerido_Venta;
    } else {
      this.PrecioSugeridoEfectivo = 0;
    }
  }

  CalcularTotal(value) {
    this.ValorTotal = Number.parseInt(value) + this.Costo;
    this.ValorEntrega = Number.parseInt(value) - this.Costo;
  }


  AsignarComisionServicioExterno(value) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Servicio_Externo', id: value }
    }).subscribe((data: any) => {
      this.ComisionServicioExterno = data.Comision;
    });
  }

  GuardarCorresponsal(formulario: NgForm) {
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Diario');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/corresponsaldiario/guardar_corresponsal_diario.php', datos).subscribe((data: any) => {
      formulario.reset();
      (document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = false;
    });
  }

  ConsultarCorresponsal(id) {
    this.CorresponsalBancario = id;
    this.ValorCorresponsal = 0;
    this.DetalleCorresponsal = "";
    let datos = new FormData();
    //let funcionario = this.IdentificacionFuncionario;
    datos.append("Identificacion_Funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    datos.append("Id_Corresponsal_Diario", id);
    this.http.post(this.globales.ruta + 'php/corresponsaldiario/lista_corresponsales.php', datos).subscribe((data: any) => {
      this.IdCorresponsal = data.Id_Corresponsal_Diario;
      this.ValorCorresponsal = data.Valor;
      this.DetalleCorresponsal = data.Detalle;
      (document.getElementById("GuardarCorresponsalBancario") as HTMLInputElement).disabled = false;
    });
  }


  // --------------------------------------------------------------------------- //  

  // aquí ando haciendo mis metodos


  // --------------------------------------------------------------------------- //

  MonedaOrigenCambio = [];
  MonedaOrigenDestino = [];
  FuncionariosCajaDestino = [];
  TerceroCliente = [];
  MonedasTransferencia = [];
  MonedasOrigen = [];
  TransferenciasAnuladas =[];
  RemitentesTransferencias = [];
  CuentasBancarias =[];
  actualizarVista() {
    this.Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario
    this.MonedaOrigenCambio = [];
    this.MonedaOrigenDestino = [];

    this.http.get(this.globales.ruta + 'php/cambio/lista_cambios.php', { params: { modulo: 'Cambio' } }).subscribe((data: any) => {
      this.Cambios = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento_Extranjero' } }).subscribe((data: any) => {
      this.TipoDocumentoExtranjero = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.Cuentas = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Documento' } }).subscribe((data: any) => {
      this.Documentos = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Corresponsal_Bancario' } }).subscribe((data: any) => {
      this.CorresponsalesBancarios = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Externo' } }).subscribe((data: any) => {
      this.ServiciosExternos = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Caja' } }).subscribe((data: any) => {
      this.Cajas = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      this.Monedas = data;
      this.MonedasTransferencia = [];
      this.MonedasOrigen = [];
      data.forEach(element => {
        if (element.Nombre != "Pesos") {
          this.MonedasTransferencia.push(element);
        }

        if (element.Nombre == "Pesos") {
          this.MonedasOrigen.push(element)
        }

      });

    });

    this.MonedaOrigenCambio = [];
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      data.forEach(element => {
        if (element.Nombre != "Pesos") {
          this.MonedaOrigenCambio.push(element);
        }
      });
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Funcionarios = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.TipoCuentas = data;
    });
    this.http.get(this.globales.ruta + 'php/pos/lista_destinatarios.php').subscribe((data: any) => {
      this.Destinatarios = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Transferencia_Remitente' } }).subscribe((data: any) => {
      this.Remitentes = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Pais' } }).subscribe((data: any) => {
      this.Paises = data;
    });
    this.http.get(this.globales.ruta + 'php/pos/lista_clientes.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Clientes = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.TerceroCliente = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Banco' } }).subscribe((data: any) => {
      this.Bancos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Oficina', id: '5' } }).subscribe((data: any) => {
      this.LimiteOficina = data.Limite_Transferencia;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_recibos_transferencia.php').subscribe((data: any) => {
      this.Transferencia = data;
    });

    this.http.get(this.globales.ruta + 'php/giros/listar_giros_funcionario.php', { params: { modulo: 'Giro', funcionario: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Giros = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
      this.Departamentos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Comision' } }).subscribe((data: any) => {
      this.GiroComision = data;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_cajeros_sistema.php').subscribe((data: any) => {
      this.FuncionariosCaja = data;
      this.FuncionariosCajaDestino = data;

      var index = this.FuncionariosCajaDestino.findIndex(x => x.Identificacion_Funcionario === JSON.parse(localStorage['User']).Identificacion_Funcionario);
      this.FuncionariosCajaDestino.splice(index, 1)
    });

    this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.Traslados = data;


    });

    this.http.get(this.globales.ruta + 'php/pos/traslado_recibido.php', { params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.TrasladosRecibidos = data;

    });


    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Comision' } }).subscribe((data: any) => {
      this.ServicioComision = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/listar_fecha_hoy.php', { params: { modulo: 'Servicio' } }).subscribe((data: any) => {
      this.Servicios = data;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_clientes.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      //this.Tercero = data;
      this.Tercero = [];
      data.forEach(element => {
        if (element.Cupo != "0") {
          this.Tercero.push(element);
        }
      });
    });

    this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_colombianos.php', { params: { modulo: 'Cuenta_Bancaria' } }).subscribe((data: any) => {
      this.CuentaBancaria = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
      this.MonedaOrigenDestino = [];
      data.forEach(element => {
        if (element.Nombre != "Pesos") {
          this.MonedaOrigenDestino.push(element);
        }

      });
    });


    this.http.get(this.globales.ruta + '/php/giros/giros_aprobados.php', { params: { funcionario: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.GirosAprobados = data;
    });

    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_anuladas.php').subscribe((data: any) => {
      this.TransferenciasAnuladas = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Transferencia_Remitente' } }).subscribe((data: any) => {
      this.RemitentesTransferencias = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Cuenta_Bancaria' } }).subscribe((data: any) => {
      this.CuentasBancarias = data;
    });

    this.CambiarTasa(1);

  }

  CambiarTasa(value) {
    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: value }
    }).subscribe((data: any) => {
      this.MaxEfectivo = data.Dependencia[0].Valor;
      this.MinEfectivo = data.Dependencia[1].Valor;
      this.PrecioSugeridoEfectivo = data.Dependencia[2].Valor;
      this.PrecioSugeridoEfectivo1 = data.Dependencia[2].Valor;

      this.MaxCompra = data.Dependencia[3].Valor;
      this.MinCompra = data.Dependencia[4].Valor;
      this.PrecioSugeridoCompra = data.Dependencia[5].Valor;

      this.maximoTransferencia = data.Dependencia[6].Valor;
      this.minimoTransferencia = data.Dependencia[7].Valor;
      this.PrecioSugeridoTransferencia = data.Dependencia[8].Valor;
      //this.MonedaDestino = data.Moneda[0].Nombre;
    });
  }

  validarPrecioSugerido(valor) {

    switch (this.Venta) {
      case true: { //vendo
        if (parseInt(this.MaxEfectivo) < parseInt(valor)) {
          this.PrecioSugeridoEfectivo = this.PrecioSugeridoEfectivo1;
          this.confirmacionSwal.title = "Error"
          this.confirmacionSwal.text = "El precio sugerido supera el máximo de efectivo"
          this.confirmacionSwal.type = "error"
          this.confirmacionSwal.show();
        }
        break;
      }
      case false: {
        //compro
        if (parseInt(this.MaxCompra) < parseInt(valor)) {
          this.PrecioSugeridoEfectivo = this.PrecioSugeridoEfectivo1;
          this.confirmacionSwal.title = "Error"
          this.confirmacionSwal.text = "El precio sugerido supera el máximo de compra"
          this.confirmacionSwal.type = "error"
          this.confirmacionSwal.show();
        }
        break;
      }
    }
  }

  Origen(moneda) {

    /*var index = this.MonedaOrigenDestino.findIndex(x => x.Id_Moneda === moneda);
    this.MonedaOrigenDestino.splice(index, 1)*/

    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: moneda }
    }).subscribe((data: any) => {
      //this.MonedaOrigen = data.Moneda[0].Nombre
      if (moneda == 2) {
        this.MonedaTasaCambio = true;
        this.MonedaComision = false;
      } else {
        this.MonedaTasaCambio = false;
        this.MonedaComision = true;
      }
    });

    var index = this.MonedaOrigenDestino.findIndex(x => x.Id_Moneda === moneda);
    this.MonedaOrigen = this.MonedaOrigenCambio[index].Nombre;
  }

  formulaCambio(valor) {
    if (this.Venta == false) {
      var origen = (document.getElementById("Origen") as HTMLInputElement).value;

      if (origen == "1") {
        var resultadoBolivares = valor / this.PrecioSugeridoEfectivo;
        this.entregar = resultadoBolivares;
      }

      if (origen == "2") {
        var resultadoPeso = valor * this.PrecioSugeridoEfectivo;
        this.entregar = resultadoPeso.toFixed(2);
      }


    } else {
      //venta
      //PrecioSugeridoEfectivo 
    }



  }

  RealizarCambioMoneda(value, tipo) {

    //////////console.log(value + " " +this.MonedaTasaCambio +  " " + this.MonedaComision)
    switch (tipo) {
      case 'cambia': {

        var divisor = 1;
        if (parseInt(value) > 0) {
          if (this.MonedaTasaCambio == true) {
            divisor = this.PrecioSugeridoEfectivo;
          } else {
            divisor = this.PrecioSugeridoTransferencia;
          }

          this.entregar = (parseInt(value) / divisor);
          this.entregar = this.entregar.toFixed(2);
          (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
        } else {
          if (this.entregar == 0 || this.entregar == "" || this.entregar == undefined) {
            (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = true;
          }
        }
        break;
      }
      case 'entrega': {
        var divisor = 1;
        if (parseInt(value) > 0) {
          if (this.MonedaTasaCambio == true) {
            divisor = this.PrecioSugeridoEfectivo;
          } else {
            divisor = this.PrecioSugeridoTransferencia;
          }
          this.cambiar = (parseInt(value) * divisor);
          (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
        } else {
          if (this.cambiar == 0 || this.cambiar == "" || this.cambiar == undefined) {
            (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = true;
          }
        }
        break;
      }
    }
  }

  RealizarCambioMonedaTransferencia(value, tipo) {
    switch (tipo) {
      case 'cambia': {
        var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
        if (parseInt(value) > 0) {
          this.entregar = (parseInt(value) / parseInt(divisor));
          this.entregar = this.entregar.toFixed(2);
          if (this.Envios.length > 0) {
            //reviso si hay valores para realizar la suma
            var suma = 0;
            this.Envios.forEach((element, index) => {
              suma += element.Valor_Transferencia_Peso;
            });
            if (suma == 0) {
              ////////console.log((document.getElementById("Cantidad_Recibida") as HTMLInputElement).value)
              this.Envios[0].Valor_Transferencia_Peso = (document.getElementById("Cantidad_Recibida") as HTMLInputElement).value;
              this.NuevoDestinatario(0, 'Peso')
            }

            if (suma == parseInt(value)) {

              if (this.Recibe != 'Cliente') {
                (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = false;
              }

            } else {

              if (this.Recibe != 'Cliente') {
                this.confirmacionSwal.title = "Valores no coinciden";
                this.confirmacionSwal.text = "Los valores a entregar no coinciden con la sumatoria de los valores de los destiantarios";
                this.confirmacionSwal.type = "error";
                //this.confirmacionSwal.show();
                (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
              }
            }
          }
          var formaPago = (document.getElementById("Forma_Pago") as HTMLInputElement).value;
          if (formaPago == "Credito") {
            var idTercero = (document.getElementById("Id_Tercero") as HTMLInputElement).value;
            if (idTercero != "") {
              var indice = this.Tercero.findIndex(x => x.Id_Tercero === idTercero);
              if (indice > -1) {
                var cupo = this.Tercero[indice].Cupo;
                if (parseInt(value) > parseInt(cupo)) {
                  this.confirmacionSwal.title = "Valor excedido";
                  this.confirmacionSwal.text = "El valor digitado en pesos supera el cupo que tiene el cliente en este momento (" + cupo + ")";
                  this.confirmacionSwal.type = "error";
                  this.confirmacionSwal.show();
                  this.entregar = 0;
                  this.cambiar = 0;
                }
              }
            }
          }
        }
        break;
      }
      case 'entrega': {
        var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
        if (parseInt(value) > 0) {
          this.cambiar = (parseInt(value) * parseInt(divisor));
          if (this.Envios.length > 0) {
            //reviso si hay valores para realizar la suma
            var suma = 0;
            this.Envios.forEach((element, index) => {
              suma += element.Valor_Transferencia_Bolivar;
            });
            if (suma == 0) {
              this.Envios[0].Valor_Transferencia_Bolivar = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;
              this.NuevoDestinatario(0, 'Bolivar')
            }
          }
        }
        break;
      }
    }
  }

  ObtenerVueltos(valor) {
    if (parseInt(valor) > 0) {
      (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
      var plata = ((document.getElementById("Cambia") as HTMLInputElement).value);
      this.vueltos = valor - parseInt(plata);
      if (this.vueltos < 0) {
        (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = true;
        (document.getElementById("pagocon") as HTMLInputElement).value = "0";
        this.vueltos = 0;
        this.confirmacionSwal.title = "Problemas cambio";
        this.confirmacionSwal.text = "La plata entregada es inferior a lo que va a cambiar";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();

      }
    }
  }

  CambiarVista(tipo) {

    switch (tipo) {
      case "Compra": {
        this.Venta = false;
        this.TextoBoton = "Comprar"
        this.Tipo = "Compra";
        this.tituloCambio = "Compras"
        /*this.defectoDestino = "2";
        this.defectoOrigen = ""*/
        break;
      }
      case "Venta": {
        this.Venta = true;
        this.TextoBoton = "Vender"
        this.Tipo = "Venta";
        this.tituloCambio = "Ventas"
        /*this.defectoDestino = "";
        this.defectoOrigen = "2"*/
        break;
      }
      case "Transferencia": {
        this.Transferencia1 = false;
        this.Transferencia2 = true;
        break;
      }
      case "Cambio": {
        this.Cambios2 = true;
        this.Cambios1 = false;
        break;
      }
      case "Giro": {
        this.Giro2 = true;
        this.Giro1 = false;
        break;
      }
      case "Traslado": {
        this.Traslado2 = true;
        this.Traslado1 = false;
        break;
      }
      case "Servicio": {
        this.Servicio2 = true;
        this.Servicio1 = false;
        break;
      }
    }
  }

  guardarCambio(formulario: NgForm, item) {

    formulario.value.Moneda_Destino = this.MonedaDestino;
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Cambio');
    datos.append("datos", info);

    this.http.post(this.globales.ruta + '/php/pos/guardar_cambio.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente la " + item
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.Cambios1 = true;
      this.Cambios2 = false;
      this.tasaCambiaria = "";
      this.entregar = "";
      this.MonedaDestino = "Pesos";
      this.actualizarVista();
    });
  }

  GuardarTransferencia(formulario: NgForm) {

    //formulario.value.Costo_Transferencia = 1;
    formulario.value.Id_Oficina = 5;
    formulario.value.Id_Caja = 4;
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Tipo_Oficina = localStorage['Tipo_Oficina'];
    formulario.value.Cantidad_Transferida = this.entregar;

    var suma = 0;
    if(this.Envios.length != 1){
      this.Envios.forEach((element, index) => {
        if (element.Nombre == "" || element.Valor_Transferencia_Bolivar == 0) {
          this.Envios.splice(index, 1);
          suma += element.Valor_Transferencia_Bolivar;
        }
      });
    }    

    this.Envios.forEach((element, index) => {
      suma += Number(element.Valor_Transferencia_Bolivar);
    });

    var totalPermitido = Number(this.entregar) + Number(this.SaldoBolivar)

    if (this.credito == true) {
      var index = this.Monedas.findIndex(x=>x.Id_Moneda === formulario.value.Moneda_Destino);
        formulario.value.Moneda_Destino = this.Monedas[index].Nombre;
        this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
      this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
      let info = JSON.stringify(formulario.value);
      let destinatarios = JSON.stringify(this.Envios);
      let datos = new FormData();
      datos.append("datos", info);
      datos.append("envios", destinatarios);
      this.http.post(this.globales.ruta + 'php/pos/guardar_transferencia.php', datos)
      //this.http.post(this.globales.ruta + 'php/transferencias/pruebas_envio_transferencia.php', datos)
        .catch(error => {
          console.error('An error occurred:', error.error);
          this.errorSwal.show();
          return this.handleError(error);
        })
        .subscribe((data: any) => {
          formulario.reset();
          this.opcionDefaultFormaPago = "Efectivo";
          this.opcionTipoTransferencia  = "Transferencia";
          this.seleccioneClienteDefault = "";
          this.transferenciaExitosaSwal.show();
          this.TipoPagoTransferencia("Efectivo");
          this.Transferencia1 = true;
          this.Transferencia2 = false;
          this.recargarDestinatario();


          this.Envios = [{
            Destino: '',
            Numero_Documento_Destino: '',
            Nombre: '',
            Id_Destinatario_Cuenta: '',
            Valor_Transferencia_Bolivar: '',
            Valor_Transferencia_Peso: '',
            Cuentas: [],
            esconder: false
          }];

          this.actualizarVista();
          this.ReiniciarTransferencias();

        });

    } else {
      if (suma == totalPermitido && totalPermitido > 0) {
        var index = this.Monedas.findIndex(x=>x.Id_Moneda === formulario.value.Moneda_Destino);
        formulario.value.Moneda_Destino = this.Monedas[index].Nombre;
        this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
        let info = JSON.stringify(formulario.value);
        let destinatarios = JSON.stringify(this.Envios);
        let datos = new FormData();
        datos.append("datos", info);
        datos.append("envios", destinatarios);
        this.http.post(this.globales.ruta + 'php/pos/guardar_transferencia.php', datos)
        //this.http.post(this.globales.ruta + 'php/transferencias/pruebas_envio_transferencia.php', datos)
          .catch(error => {
            console.error('An error occurred:', error.error);
            this.errorSwal.show();
            return this.handleError(error);
          })
          .subscribe((data: any) => {
            formulario.reset();
        this.opcionDefaultFormaPago = "Efectivo";
        this.opcionTipoTransferencia  = "Transferencia";
            this.seleccioneClienteDefault = "";
            this.transferenciaExitosaSwal.show();
            this.TipoPagoTransferencia("Efectivo");
            this.Transferencia1 = true;
            this.Transferencia2 = false;
            this.recargarDestinatario();

            this.Envios = [{
              Destino: '',
              Numero_Documento_Destino: '',
              Nombre: '',
              Id_Destinatario_Cuenta: '',
              Valor_Transferencia_Bolivar: '',
              Valor_Transferencia_Peso: '',
              Cuentas: [],
              esconder: false
            }];

            this.actualizarVista();
            this.ReiniciarTransferencias();

          });
      } else {
        this.confirmacionSwal.title = "Pendiente";
        this.confirmacionSwal.text = "Aún queda saldo por enviar, por favor verifique los valores";
        this.confirmacionSwal.type = "warning";
        this.confirmacionSwal.show();
      }
    }


  }


  EditarDestinatario(id, pos) {
    this.http.get(this.globales.ruta + 'php/destinatarios/editar_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      ////////console.log(data.destinatario);
      this.Detalle_Destinatario = data.destinatario;
      this.Lista_Destinatarios = data.DestinatarioCuenta;

      for (var i = 0; i < this.Lista_Destinatarios.length; i++) {
        this.Bancos_Pais(this.Lista_Destinatarios[i].Id_Pais, i);
      }

      this.Identificacion = id;
      //this.AgregarFila();
      this.Bancos_Pais(2, 1);
      this.ModalEditarDestinatario.show();
      this.posiciontemporal = pos;
    });
  }


  validarBanco(i, valor) {
    var idpais = ((document.getElementById("Id_Pais_Destinatario" + i) as HTMLInputElement).value)

    if (parseInt(idpais) == 2) {
      var longitud = this.LongitudCarateres(valor);
      if (longitud != 20) {
        this.botonDestinatario = false;
        this.confirmacionSwal.title = "Banco no valido";
        this.confirmacionSwal.text = "Digite correctamente el número del banco";
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
      }

      var indice = this.DestinatarioCuenta.findIndex(x => x.Numero_Cuenta === valor);
      if (indice > -1) {
        this.confirmacionSwal.title = "Cuenta Repetida";
        this.confirmacionSwal.text = "Esta cuenta fue creada anteriormente y le pertenece a " + this.DestinatarioCuenta[indice].Nombre;
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
        ((document.getElementById("BotonGuardarDestinatarioTransferencia") as HTMLInputElement).disabled) = true;
      } else {
        ((document.getElementById("BotonGuardarDestinatarioTransferencia") as HTMLInputElement).disabled) = false;
      }
    }
  }

  AgregarFila(i, valor) {

    var idpais = ((document.getElementById("Id_Banco" + i) as HTMLInputElement).value)

    if (valor != "" && idpais != "") {
      var pos = parseInt(i) + 1;
      if (this.Lista_Destinatarios[pos] == undefined) {
        this.Lista_Destinatarios.push({
          Id_Pais: '2',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        });

        this.Bancos_Pais(2, pos);
      }
    }

  }

  Bancos_Pais(Pais, i) {
    this.http.get(this.globales.ruta + 'php/genericos/bancos_pais.php', { params: { id: Pais } }).subscribe((data: any) => {
      this.Lista_Destinatarios[i].Bancos = data;
    });
  }

  verificarChequeo(pos, check) {
    var checkeo = (document.getElementById("checkeo_" + pos) as HTMLInputElement).checked;

    switch (check) {
      case true: {
        ((document.getElementById("Observacion_Destinatario" + pos) as HTMLInputElement).disabled) = false;
        ((document.getElementById("Otra_Cuenta_Destinatario" + pos) as HTMLInputElement).disabled) = false;
        break;
      }
      case false: {
        ((document.getElementById("Observacion_Destinatario" + pos) as HTMLInputElement).disabled) = true;
        ((document.getElementById("Otra_Cuenta_Destinatario" + pos) as HTMLInputElement).disabled) = true;
        break;
      }
    }

  }

  GuardarDestinatarioEditar(formulario: NgForm, modal: any) {
    var identificacion = ((document.getElementById("Id_Destinatario") as HTMLInputElement).value);
    let info = JSON.stringify(formulario.value);
    let bancos = JSON.stringify(this.Lista_Destinatarios);
    let datos = new FormData();
    datos.append("modulo", 'Destinatario');
    datos.append("datos", info);
    datos.append("destinatario", bancos);
    this.http.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.Lista_Destinatarios = [{
          Id_Pais: '',
          Id_Banco: '',
          Bancos: [],
          Id_Tipo_Cuenta: '',
          Numero_Cuenta: '',
          Otra_Cuenta: '',
          Observacion: ''
        }];

        this.actualizarVista();
        this.AutoCompletarDestinatario(identificacion, this.posiciontemporal)
        //this.recargarBancos(this.posiciontemporal,identificacion)
        this.confirmacionSwal.title = "Actualización exitosa"
        this.confirmacionSwal.text = "Se ha actualizado correctamente el destinatario"
        this.confirmacionSwal.type = "success"
        this.confirmacionSwal.show();
        // this.posicionTemporal= pos

      });

  }

  codigoBanco(seleccion, posicion, texto) {

    //////console.log(seleccion + " , " + posicion + " , " + texto);
    var pais = ((document.getElementById("Id_Pais" + posicion) as HTMLInputElement).value);
    //////console.log("pais = " + 2);

    if (pais == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.Bancos.findIndex(x => x.Id_Banco === seleccion)
          this.Lista_Destinatarios[posicion].Numero_Cuenta = this.Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {
          //////console.log("soy input");

          var cadena = seleccion.substring(0, 4);
          var buscarBanco = this.Bancos.findIndex(x => x.Identificador === cadena)
          if (buscarBanco > -1) {
            this.Lista_Destinatarios[posicion].Id_Banco = this.Bancos[buscarBanco].Id_Banco;
          } else {
            this.Lista_Destinatarios[posicion].Id_Banco = '';
          }
          break;
        }
      }
    }

  }


  volverCambioEfectivo() {
    this.Cambios1 = true;
    this.Cambios2 = false;
    this.vueltos = 0;
    this.entregar = 0;
    this.tasaCambiaria = "";
  }

  volverReciboTransferencia() {
    this.Transferencia1 = true;
    this.Transferencia2 = false;
    this.Envios = [{
      Destino: '',
      Numero_Documento_Destino: '',
      Nombre: '',
      Id_Destinatario_Cuenta: '',
      Valor_Transferencia_Bolivar: '',
      Valor_Transferencia_Peso: '',
      Cuentas: [],
      esconder: false
    }];
    this.CambiarTasa(1);
  }

  volverReciboGiro() {
    this.Giro1 = true;
    this.Giro2 = false;
  }

  volverTraslado() {
    this.Traslado1 = true;
    this.Traslado2 = false;
  }

  volverServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
  }

  volverReciboServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
  }

  NuevaHileraDestinatario(pos) {
    var limite = parseInt(this.LimiteOficina);
    if (this.Envios.length != limite) {
      var index = pos + 1;

      ////console.log(this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Id_Destinatario_Cuenta != "") && (this.Envios[pos].Valor_Transferencia_Bolivar > 1));

      if (this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Id_Destinatario_Cuenta != "") && (this.Envios[pos].Valor_Transferencia_Bolivar > 1)) {
        this.Envios.push({
          Destino: '',
          Numero_Documento_Destino: '',
          Nombre: '',
          Id_Destinatario_Cuenta: '',
          Valor_Transferencia_Bolivar: 0,
          Valor_Transferencia_Peso: 0,
          Cuentas: [],
          esconder: false,
          disabled: true
        });

        //(document.getElementById("Valor_Transferencia_Bolivar"+(index)) as HTMLInputElement).disabled = false;

        if (this.Recibe == 'Cliente' && this.Envios.length == 1) {
          (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = true;
        } else {
          if (this.Envios.length == 1) {
            (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
          }
        }
      } else {
        if (this.Envios[pos].Id_Destinatario_Cuenta == "") {
          this.confirmacionSwal.title = "Información Vacia";
          this.confirmacionSwal.text = "Hay campos vacios que deben ser digitados para poder continuar";
          this.confirmacionSwal.type = "error";
          this.confirmacionSwal.show();

          if (this.Recibe == 'Cliente' && this.Envios.length == 1) {
            (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = true;
          } else {
            if (this.Envios.length == 1) {
              (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
            }
          }
        }

      }
    }
  }


  NuevoDestinatario(pos, moneda) {

    var index = pos + 1;
    var limite = parseInt(this.LimiteOficina);

    switch (moneda) {

      case 'Bolivar': {
        var suma = 0;
        var totalBolivar = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;
        if (this.Envios.length != limite) {

          if (this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Valor_Transferencia_Peso > 0 && this.Envios[pos].Valor_Transferencia_Bolivar > 0)) {
            this.Envios.push({
              Destino: '',
              Numero_Documento_Destino: '',
              Nombre: '',
              Id_Destinatario_Cuenta: '',
              Valor_Transferencia_Bolivar: 0,
              Valor_Transferencia_Peso: 0,
              Cuentas: [],
              esconder: false
            });

            if (this.Recibe == 'Cliente') {
              (document.getElementById("BotonMovimientoGuardar") as HTMLInputElement).disabled = false;
            } else {
              (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = false;
            }
          }
        }
        break;
      }

      case 'Peso': {
        var suma = 0;
        var totalBolivar = (document.getElementById("Cantidad_Recibida") as HTMLInputElement).value;
        var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;

        if (this.Envios.length != limite) {
          if (this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Valor_Transferencia_Peso > 0 && this.Envios[pos].Valor_Transferencia_Bolivar > 0)) {
            this.Envios.push({
              Destino: '',
              Numero_Documento_Destino: '',
              Nombre: '',
              Id_Destinatario_Cuenta: '',
              Valor_Transferencia_Bolivar: 0,
              Valor_Transferencia_Peso: 0,
              Cuentas: [],
              esconder: false
            });
          }
        }
        break;
      }
    }
  }

  ValidarTransferencia(value) {
    if (parseInt(value) > this.maximoTransferencia) {
      this.PrecioSugeridoEfectivo = this.PrecioSugeridoEfectivo1;
      this.confirmacionSwal.title = "Error";
      this.confirmacionSwal.text = "La tasa de cambio supera el permitido"
      this.confirmacionSwal.type = "error"
      this.confirmacionSwal.show();
      if (this.Recibe != 'Cliente') {
        (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
      }

    } /*else {
      var monedaOrigen = (document.getElementById("Cantidad_Recibida") as HTMLInputElement).value;
      var monedaDestino = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;
      this.RealizarCambioMonedaTransferencia(monedaOrigen, 'cambia');
      this.RealizarCambioMonedaTransferencia(monedaDestino, 'entrega');
      this.entregar = (parseInt(monedaOrigen) / parseInt(value));
      this.entregar = (parseInt(monedaOrigen) / parseInt(value));
      this.entregar = this.entregar.toFixed(2);
      this.cambiar = (parseInt(monedaDestino) * parseInt(value));

      var sumaPeso = 0;
      var sumaBolivar = 0;
      this.Envios.forEach(element => {
        sumaPeso += element.Valor_Transferencia_Peso;
        sumaBolivar += element.Valor_Transferencia_Bolivar;
      });

      if (((this.entregar != sumaBolivar) || (this.cambiar != sumaPeso)) && this.Recibe != 'Cliente') {
        this.confirmacionSwal.title = "Valores no coinciden";
        this.confirmacionSwal.text = "Los valores a entregar no coinciden con la sumatoria de los valores de los destiantarios";
        this.confirmacionSwal.type = "error";
        //this.confirmacionSwal.show();
        if (this.Recibe != 'Cliente') {
          (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
        }
      } else {
        if (this.Recibe != 'Cliente') {
          (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = true;
        }
      }
    }*/

  }

  SeleccionarTipo(tipo) {
    this.Recibe = tipo;
    switch (tipo) {
      case "Transferencia": {
        this.MonedaTransferencia = 1;
        this.CambiarTasa(1);
        break;
      }
      case "Cliente": {
        this.MonedaTransferencia = 1;
        this.CambiarTasa(1);
        break;
      }
    }
  }

  AutoCompletarRemitente(modelo) {
    if (modelo) {
      if (modelo.length > 0) {
        this.RemitentesFiltrados = this.Remitentes.filter(number => number.Id_Transferencia_Remitente.slice(0, modelo.length) == modelo);
      }
      else {
        this.RemitentesFiltrados = null;
      }
    }
  }

  HistorialTransferenciaRemitente(remitente) {
    this.http.get(this.globales.ruta + '/php/transferencias/historico_transferencia_remitente.php', { params: { modulo: 'Transferencia', id: remitente.Id_Transferencia_Remitente } }).subscribe((data: any) => {
      this.HistorialCliente = data;
      if (this.HistorialCliente.length > 0) {
        //abre modal
        this.ModalHistorial.show();
      } else {
        // informo que no hay registro
        this.confirmacionSwal.title = "Número no encontrado"
        this.confirmacionSwal.text = "El número de documento digitado no ha realizado alguna transferencia"
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
      }
    });
  }

  Municipios_Departamento(Departamento, tipo) {
    this.http.get(this.globales.ruta + 'php/genericos/municipios_departamento.php', { params: { id: Departamento } }).subscribe((data: any) => {
      switch (tipo) {
        case "Remitente": {
          this.Municipios_Remitente = data;
          //this.Departamento_Remitente = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }
        case "Destinatario": {
          this.Municipios_Destinatario = data;
          //this.Departamento_Destinatario = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }

      }
    });
  }


  resultado = [{
    Id_Transferencia_Remitente: "",
    Nombre: "",
    Telefono: ""
  }];
  AutoCompletarRemitenteGiro(modelo) {
    if (modelo) {
      if (modelo.length > 0) {
        this.RemitentesFiltrados = this.Remitentes.filter(number => number.Id_Transferencia_Remitente.slice(0, modelo.length) == modelo);
      }
      else {
        this.RemitentesFiltrados = null;
      }
    }

  }

  IdRemitenteTransferencia: any = "";
  NombreRemitenteTransferencia: any = "";
  TelefonoRemitenteTransferencia: any = "";
  CompletarDatosRemitenteTransferencia(i) {
    var valor = ((document.getElementById("remitenteTransferencia") as HTMLInputElement).value);
    var index = this.Remitentes.findIndex(x => x.Id_Transferencia_Remitente === valor)
    if (index > -1) {
      this.IdRemitenteTransferencia = this.Remitentes[index].Id_Transferencia_Remitente;
      this.NombreRemitenteTransferencia = this.Remitentes[index].Nombre;
      this.TelefonoRemitenteTransferencia = this.Remitentes[index].Telefono;
    } else {
      this.IdRemitenteTransferencia = valor;
      this.NombreRemitenteTransferencia = "";
      this.TelefonoRemitenteTransferencia = "";
    }

  }


  IdRemitenteGiro: any = "";
  NombreRemitenteGiro: any = "";
  TelefonoRemitenteGiro: any = "";
  CompletarDatosRemitenteGiro() {
    var valor = ((document.getElementById("DocumentoGiroRemitente") as HTMLInputElement).value);
    var index = this.Remitentes.findIndex(x => x.Id_Transferencia_Remitente === valor)
    if (index > -1) {
      this.IdRemitenteGiro = this.Remitentes[index].Id_Transferencia_Remitente;
      this.NombreRemitenteGiro = this.Remitentes[index].Nombre;
      this.TelefonoRemitenteGiro = this.Remitentes[index].Telefono;
    } else {
      this.IdRemitenteGiro = valor;
      this.NombreRemitenteGiro = "";
      this.TelefonoRemitenteGiro = "";
    }
  }

  IdDestinatarioGiro: any = "";
  NombreDestinatarioGiro: any = "";
  TelefonoDestinatarioGiro: any = "";
  CompletarDatosDestinatarioGiro() {
    var valor = ((document.getElementById("DocumentoGiroDestinatario") as HTMLInputElement).value);
    var index = this.Remitentes.findIndex(x => x.Id_Transferencia_Remitente === valor)
    if (index > -1) {
      this.IdDestinatarioGiro = this.Remitentes[index].Id_Transferencia_Remitente;
      this.NombreDestinatarioGiro = this.Remitentes[index].Nombre;
      this.TelefonoDestinatarioGiro = this.Remitentes[index].Telefono;
    } else {
      this.IdDestinatarioGiro = valor;
      this.NombreDestinatarioGiro = "";
      this.TelefonoDestinatarioGiro = "";
    }
  }

  valorComision(value) {
    this.ValorEnviar = value;
    this.GiroComision.forEach(element => {
      if ((parseFloat(element.Valor_Minimo) < parseFloat(value)) && (parseFloat(value) < parseFloat(element.Valor_Maximo))) {
        this.Costo = element.Comision;
      }

      var checkeado = ((document.getElementById("libre") as HTMLInputElement).checked);
      switch (checkeado) {
        case true: {
          this.ValorTotal = parseFloat(value);
          this.ValorEntrega = parseFloat(value) + parseFloat(element.Comision);
          break;
        }
        case false: {
          this.ValorTotal = parseFloat(value) - parseFloat(element.Comision);
          this.ValorEntrega = parseFloat(value);
          break;
        }
      }
    });
  }

  RealizarGiro(formulario: NgForm) {

    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Documento_Remitente = this.IdRemitenteGiro;
    formulario.value.Documento_Destinatario = this.IdDestinatarioGiro
    formulario.value.Id_Oficina = 5;
    formulario.value.Id_Caja = 4;
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.Giro1 = true;
      this.Giro2 = false;
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();
    });
  }

  RealizarEdicionGiro(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_giro.php', datos).subscribe((data: any) => {
      modal.hide();
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();
    });
  }


  RealizarTraslado(formulario: NgForm, modal) {
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_pos.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.volverTraslado();
      modal.hide();
      this.actualizarVista();
    });
  }

  AnularTraslado(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.actualizarVista();
    });
  }

  esconder(estado, valor) {
    switch (estado) {
      case "Inactivo": {
        return false;
      }
      default: {
        return this.revisionDecision(valor);
      }
    }
  }

  editarTraslado(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Traslado_Caja', id: id } }).subscribe((data: any) => {
      this.idTraslado = id;
      this.Traslado = data;
      this.ModalTrasladoEditar.show();
    });
  }

  decisionTraslado(id, valor) {
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("id", id);
    datos.append("estado", valor);

    this.http.post(this.globales.ruta + 'php/pos/decision_traslado.php', datos).subscribe((data: any) => {
      this.actualizarVista();
    });
  }

  revisionDecision(valor) {
    switch (valor) {
      case "Si": {
        return false;
      }
      case "No": {
        return false;
      }
      default: {
        return true;
      }
    }
  }

  revisionDecisionLabel(valor) {
    switch (valor) {
      case "Si": {
        return true;
      }
      case "No": {
        return false;
      }
    }
  }

  calcularComisionServicioExterno(value) {
    this.ServicioComision.forEach(element => {
      if ((parseFloat(element.Valor_Minimo) <= parseFloat(value)) && (parseFloat(value) < parseFloat(element.Valor_Maximo))) {
        this.ValorComisionServicio = element.Comision;
      }
    });
  }

  GuardarServicio(formulario: NgForm, modal) {
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_pos.php', datos).subscribe((data: any) => {
      formulario.reset();
      modal.hide();
      this.volverServicio();
      this.actualizarVista();
    });
  }

  AnulaServicio(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.actualizarVista();
    });
  }

  esconderAnular(valor) {
    switch (valor) {
      case "Activo": {
        return true;
      }
      case "Inactivo": {
        return false;
      }
    }
  }

  editarServicio(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { id: id, modulo: "Servicio" } }).subscribe((data: any) => {
      this.Servicio = data;
      this.ValorComisionServicio = data.Comision;
      this.ModalServicioEditar.show();
    });
  }

  AnularGiro(id) {
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/giros/anular_giro.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Amulado con Exito";
      this.confirmacionSwal.text = "Se ha anulado correctamente el giro"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();
    });
  }

  anulado(estado) {
    switch (estado) {
      case "Anulada": { return false }
      default: { return true }
    }
  }

  DatosRemitenteEditarGiro = [];
  DatosDestinatario = [];
  DatosDestinatarioEditarGiro = [];

  EditarGiro(id) {

    this.http.get(this.globales.ruta + '/php/pos/detalle_giro.php', { params: { modulo: 'Giro', id: id } }).subscribe((data: any) => {
      this.idGiro = id;
      this.Giro = data.giro;
      this.Remitente = data.remitente;
      this.Destinatario = data.destinatario;
      this.ModalGiroEditar.show();
      this.ValorEnviar = data.giro.ValorEnviar;
      this.valorComision(data.giro.Valor_Total);
      this.Municipios_Departamento(data.remitente.Id_Departamento, 'Remitente');
      this.Municipios_Departamento(data.destinatario.Id_Departamento, 'Destinatario');
      this.Departamento_Remitente = this.Departamentos[data.remitente.Id_Departamento].Nombre;
      this.Departamento_Destinatario = this.Departamentos[data.destinatario.Id_Departamento].Nombre;
      this.DatosRemitenteEditarGiro = data.remitente.DatosRemitenteEditarGiro;
      this.DatosDestinatarioEditarGiro = data.destinatario.DatosDestinatarioEditarGiro;
    });
  }

  cliente = true;
  TipoPagoTransferencia(value) {
    switch (value) {
      case "Credito": {
        this.credito = true;
        this.consignacion = false;
        this.efectivo = false;
        this.cliente = false;
        break;
      }
      case "Consignacion": {
        this.credito = false;
        this.consignacion = true;
        this.efectivo = false;
        this.cliente = true;
        break;
      }
      case "Efectivo": {
        this.efectivo = true;
        this.consignacion = false;
        this.credito = false;
        this.cliente = true;
        break;
      }
    }
  }

  listaClientes() {
    if (this.efectivo == true && this.cliente == true) {
      return true
    }

    if (this.consignacion == true && this.cliente == true) {
      return true
    }

  }

  AnularTransferencia(id, formulario: NgForm) {
    let datos = new FormData();
    let info = JSON.stringify(formulario.value);
    datos.append("id", id);
    datos.append("datos", info);
    datos.append("idTercero", this.idTerceroDestino);
    datos.append("idDestino", this.destinoTercero);
    this.http.post(this.globales.ruta + '/php/transferencias/anular_transferencia.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.ModalAnularTransferencia.hide();
        this.confirmacionSwal.title = "Anulado"
        this.confirmacionSwal.text = "Esta transferencia se anuló"
        this.confirmacionSwal.type = "success"
        this.confirmacionSwal.show();
        this.actualizarVista();
      });

  }

  idTerceroDestino: any;
  destinoTercero:any;
  AnularTransferenciaModal(id, modal, tercero, destino) {
    this.http.get(this.globales.ruta + '/php/transferencias/verificar_realizada.php', { params: { id: id } }).subscribe((data: any) => {
      var conteo = data[0].conteo;
      if (parseInt(conteo) > 0) {
        this.confirmacionSwal.title = "Anulacion"
        this.confirmacionSwal.text = "Esta transferencia no se puede anular"
        this.confirmacionSwal.type = "warning"
        this.confirmacionSwal.show();
      } else {
        this.idTransferencia = id;
        this.idTerceroDestino = tercero;
        this.destinoTercero = destino;
        modal.show();
      }
    });
  }

  itemDestinatario = true;
  NombreTercero:any;
  TituloModalTransferencia ="Envia";
  verRecibo(valor) {
    this.http.get(this.globales.ruta + 'php/transferencias/ver_recibo.php', {
      params: { id: valor }
    }).subscribe((data: any) => {
      this.EncabezadoRecibo = data.encabezado;
      this.DestinatarioRecibo = data.destinatario;
      if (this.DestinatarioRecibo.length > 0) {
        this.itemDestinatario = true;
      } else {
        this.itemDestinatario = false;
      }

      var index = this.TerceroCliente.findIndex(x=>x.Id_Tercero === data.encabezado[0].Id_Tercero);
      if(index >-1){
        this.NombreTercero = this.TerceroCliente[index].Nombre;
        this.TituloModalTransferencia = "Tercero "
      }
      
      var index1 = this.TerceroCliente.findIndex(x=>x.Id_Tercero === data.encabezado[0].Id_Tercero_Destino);
      if(index1 >-1){
        this.NombreTercero = this.TerceroCliente[index1].Nombre;
        this.TituloModalTransferencia = "Tercero "
      }

      var index2 = this.RemitentesTransferencias.findIndex(x=>x.Id_Transferencia_Remitente === data.encabezado[0].Documento_Origen);
      if(index2 >-1){
        this.NombreTercero = this.RemitentesTransferencias[index2].Nombre;
        this.TituloModalTransferencia = "Remitente "
      }
      //CuentasBancarias
      var index3 = this.CuentasBancarias.findIndex(x=>x.Id_Cuenta_Bancaria === data.encabezado[0].Id_Cuenta_Bancaria);
      if(index3 >-1){
        this.NombreTercero = this.CuentasBancarias[index3].Nombre_Titular;
        this.TituloModalTransferencia = "Cuenta De "
      }

      this.ModalVerRecibo.show();
    });
  }


  validarDestino(value) {
    /*if (value != "") {
      this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
        this.MonedaOrigenDestino = data;
        var index = this.MonedaOrigenDestino.findIndex(x => x.Id_Moneda === value);
        if (index > -1) {
          this.MonedaOrigenDestino.splice(index, 1);
        }
      });
    } else {
      this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Moneda' } }).subscribe((data: any) => {
        this.MonedaOrigenDestino = data;
      });
    }*/



    this.validarTasaCambio(value);

  }

  validarTasaCambio(value) {

    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: value }
    }).subscribe((data: any) => {
      this.MaxEfectivo = data.Dependencia[0].Valor;
      this.MinEfectivo = data.Dependencia[1].Valor;
      this.PrecioSugeridoEfectivo = data.Dependencia[2].Valor;

      this.MaxCompra = data.Dependencia[3].Valor;
      this.MinCompra = data.Dependencia[4].Valor;
      this.PrecioSugeridoCompra = data.Dependencia[5].Valor;

      this.maximoTransferencia = data.Dependencia[6].Valor;
      this.minimoTransferencia = data.Dependencia[7].Valor;
      this.PrecioSugeridoTransferencia = data.Dependencia[8].Valor;

      if (this.Venta == true) {
        this.tasaCambiaria = this.PrecioSugeridoEfectivo;
        this.MonedaOrigen = "Pesos";
        this.MonedaDestino = data.Moneda[0].Nombre;
      } else {
        this.tasaCambiaria = this.PrecioSugeridoCompra;
        var index = this.MonedaOrigenCambio.findIndex(x => x.Id_Moneda === value);
        this.MonedaOrigen = this.MonedaOrigenCambio[index].Nombre;
      }
    });



  }


  conversionMoneda(valor, texto) {

    if (valor == false) {
      //compra
      this.tasaCambiaria = this.PrecioSugeridoCompra;
      var valorCambio = (document.getElementById("Cambia") as HTMLInputElement).value;

      var cambio = Number(texto) * Number(this.tasaCambiaria);
      this.entregar = cambio;
      (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
    } else {
      var cambio = Number(texto) / Number(this.tasaCambiaria);
      this.entregar = cambio.toFixed(2);
      this.MonedaOrigen = "Pesos"
    }

    /*
    //peso es 2
    var origen = (document.getElementById("Origen") as HTMLInputElement).value;
    var valorCambio = (document.getElementById("Cambia") as HTMLInputElement).value;

    if (origen == "2") {
      //divido
      (document.getElementById("Precio_Sugerido") as HTMLInputElement).value = this.PrecioSugeridoEfectivo;
      var cambio = Number(valorCambio) / Number(this.PrecioSugeridoEfectivo);
      this.entregar = cambio.toFixed(2);
    } else {
      // multiplico
      (document.getElementById("Precio_Sugerido") as HTMLInputElement).value = this.PrecioSugeridoCompra;
      this.entregar = Number(valorCambio) * Number(this.PrecioSugeridoCompra);
    }
    (document.getElementById("BotonEnviar") as HTMLInputElement).disabled = false;
    this.tasaCambiaria =(document.getElementById("Precio_Sugerido") as HTMLInputElement).value;*/
  }

  AnulaCambio(id) {
    let datos = new FormData();
    datos.append("id", id);
    this.http.post(this.globales.ruta + '/php/cambio/anular_cambio.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Cambio Anulado";
      this.confirmacionSwal.text = "Se ha anulado el cambio seleccionado"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.actualizarVista();

    });

  }


  tituloCambio = "Compras o Ventas";
  VerCambio(id, modal) {

    this.http.get(this.globales.ruta + '/php/genericos/detalle.php', { params: { id: id, modulo: "Cambio" } }).subscribe((data: any) => {
      this.verCambio = data;

      if (data.Moneda_Origen == "Bolivares") {
        this.currencyOrigen = "BsS.";
      }
      if (data.Moneda_Origen == "Pesos") {
        this.currencyOrigen = "$";
      }

      if (data.Moneda_Destino == "Bolivares") {
        this.currencyDestino = "BsS.";
      }

      if (data.Moneda_Destino == "Pesos") {
        this.currencyDestino = "$";
      }
      modal.show();
    });

  }


  VerificarTercero(valor) {

    var index = this.Tercero.findIndex(x => x.Id_Tercero === valor);
    if (index > -1) {
      this.cupoTercero = this.Tercero[index].Cupo;
    }

    this.http.get(this.globales.ruta + 'php/transferencias/saldo_bolivares.php', { params: { id: valor } }).subscribe((data: any) => {
      this.SaldoBolivar = data.Saldo;
    });
  }

  AutoSuma(pos) {
    var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
    var sumabolivar = 0;
    this.Envios.forEach((element, index) => {
      sumabolivar += Number(element.Valor_Transferencia_Bolivar);
    });

    var totalBolivares = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;

    var formaPago = (document.getElementById("Forma_Pago") as HTMLInputElement).value;
    if (formaPago == "Credito") {
      var total = Number(totalBolivares) + Number(this.SaldoBolivar)
      var idTercero = (document.getElementById("Id_Tercero") as HTMLInputElement).value;
      if (idTercero != "") {
        var indice = this.Tercero.findIndex(x => x.Id_Tercero === idTercero);
        if (indice > -1) {
          if (sumabolivar > total) {
            this.confirmacionSwal.title = "Valor excedido";
            this.confirmacionSwal.text = "La suma de los valores digitados no coinciden con el valor en bolivares para enviar (" + totalBolivares + ")";
            this.confirmacionSwal.type = "error";
            this.confirmacionSwal.show();
            this.Envios[pos].Valor_Transferencia_Bolivar = 0;
          } else {
            if (sumabolivar < parseInt(totalBolivares)) {
              this.NuevaHileraDestinatario(pos);
            }
          }
        }
      }
    } else {
      if (sumabolivar > parseInt(totalBolivares)) {
        this.confirmacionSwal.title = "Valor excedido";
        this.confirmacionSwal.text = "La suma de los valores digitados no coinciden con el valor en bolivares para enviar (" + totalBolivares + ")";
        this.confirmacionSwal.type = "error";
        this.confirmacionSwal.show();
        this.Envios[pos].Valor_Transferencia_Bolivar = 0;
      } else {
        this.NuevaHileraDestinatario(pos);
      }

    }    //this.NuevaHileraDestinatario(pos);
  }

  NombreTitular: any;
  tipoCuenta: any;

  InformacionCuentaBancaria(id) {
    var index = this.CuentaBancaria.findIndex(x => x.Id_Cuenta_Bancaria === id);
    if (index > -1) {
      var tipoCuenta = this.CuentaBancaria[index].Tipo;
      (document.getElementById("NombreTitular") as HTMLInputElement).value = this.CuentaBancaria[index].Nombre_Titular;
      (document.getElementById("tipoCuenta") as HTMLInputElement).value = this.TipoCuentas[tipoCuenta].Nombre;
    }
  }

  informacionGiro = [];
  ValorTotalGiro: any;
  ModalVerGiro(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Giro', id: id } }).subscribe((data: any) => {
      this.informacionGiro = data;
      this.ValorTotalGiro = Number(data.Valor_Recibido) + Number(data.Comision);
    });
    this.ModalAprobarGiro.show();
  }

  GirosBuscar = [];
  Aparecer = false;
  FiltrarGiroCedula(value) {

    this.Aparecer = false;
    this.http.get(this.globales.ruta + 'php/giros/giros_cedula.php', { params: { id: value, funcionario: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
      this.GirosBuscar = data;
      if (this.GirosBuscar.length > 0) {
        this.Aparecer = true;
      }
    });

  }

  PagarGiro(id, modal, value) {
    let datos = new FormData();
    datos.append("id", id);
    datos.append("caja", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    this.http.post(this.globales.ruta + 'php/giros/pagar_giro.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        this.confirmacionSwal.title = "Pago Exitoso";
        this.confirmacionSwal.text = "Se ha realizado el pago del giro correctamente";
        this.confirmacionSwal.type = "success";
        this.confirmacionSwal.show();
        modal.hide();

        this.http.get(this.globales.ruta + 'php/giros/giros_cedula.php', { params: { id: value } }).subscribe((data: any) => {
          this.GirosBuscar = data;
          this.actualizarVista();
          if (this.GirosBuscar.length > 0) {
            this.Aparecer = true;
          }
        });

      });

  }

  ConfirmacionGiro(valor) {
    this.confirmacionGiro.title = "¿ esta seguro ?";
    this.confirmacionGiro.text = "Confirme que el valor entregado sea de " + valor;
    this.confirmacionGiro.type = "warning"
    this.confirmacionGiro.show();
  }

  RecibeCliente = false;
  tipoCliente = true
  transferencia = true;
  Credito = false;
  Consignacion = false;
  datosRemitenteTransferencia = true;
  BotonTransferencia = true;
  BotonMovimiento = false;
  opcionDefaultFormaPago = "Efectivo";
  opcionTipoTransferencia  = "Transferencia";
  VerificarTipoTransferencia() {
    var Forma_Pago = (document.getElementById("Forma_Pago") as HTMLInputElement).value;
    var Tipo_Transferencia = (document.getElementById("Tipo_Transferencia") as HTMLInputElement).value;


    if (Tipo_Transferencia == "Transferencia") {
      this.BotonTransferencia = true;
      this.BotonMovimiento = false;
      switch (Forma_Pago) {
        case "Efectivo": {
          this.tipoCliente = true;
          this.transferencia = true;
          this.datosRemitenteTransferencia = true;
          this.Credito = false;
          this.Consignacion = false;
          this.RecibeCliente = false;
          break;
        }
        case "Credito": {
          this.tipoCliente = false;
          this.transferencia = true;
          this.datosRemitenteTransferencia = false;
          this.RecibeCliente = false;
          this.Credito = true;
          this.Consignacion = false;
          
          break;
        }
        case "Consignacion": {
          this.tipoCliente = true;
          this.transferencia = true;
          this.datosRemitenteTransferencia = false;
          this.Credito = false;
          this.Consignacion = true;
          this.RecibeCliente = false;
          break;
        }
      }
    }

    if (Tipo_Transferencia == "Cliente") {
      this.BotonTransferencia = false;
      this.BotonMovimiento = true;
      switch (Forma_Pago) {
        case "Efectivo": {
          this.RecibeCliente = true;
          this.transferencia =false;
          this.Credito = false;
          this.Consignacion = false;
          break;
        }
        case "Credito": {
          this.RecibeCliente = false;
          this.tipoCliente = false;
          this.Consignacion = false;
          this.Credito = true;
          this.transferencia = true;
          this.opcionTipoTransferencia = "Transferencia";
          break;
        }
        case "Consignacion": {
          this.RecibeCliente = true;
          this.transferencia =false;
          this.Credito = false;
          this.Consignacion = true;
          break;
        }
      }
    }

  }

  ReiniciarTransferencias(){
    this.RecibeCliente = false;
    this.tipoCliente = true
    this.transferencia = true;
    this.Credito = false;
    this.Consignacion = false;
    this.datosRemitenteTransferencia = true;
    this.BotonTransferencia = true;
    this.BotonMovimiento = false;
    this.opcionDefaultFormaPago = "Efectivo";
    this.opcionTipoTransferencia  = "Transferencia";
    this.transferencia = true
  }


}
