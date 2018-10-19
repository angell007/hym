import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit {

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
	disabled : false
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
  public PrecioSugeridoEfectivo: number;
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

  vueltos: number;
  Venta = false;
  TextoBoton = "Vender";
  entregar: any;
  cambiar: any;
  MonedaOrigen: any;
  MonedaDestino: any;
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

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  dtOptions1: DataTables.Settings = {};
  dtTrigger1 = new Subject();


  dtOptionsTraslado: DataTables.Settings = {};
  dtTriggerTraslado = new Subject();
  dtOptionsTraslado1: DataTables.Settings = {};
  dtTriggerTraslado1 = new Subject();

  dtOptions2: DataTables.Settings = {};
  dtTrigger2 = new Subject();
  dtOptions3: DataTables.Settings = {};
  dtTrigger3 = new Subject();

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

  constructor(private http: HttpClient, private globales: Globales, public sanitizer: DomSanitizer) { }


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
    this.Origen(2);
    this.bancosDestinatarios();


  }



  HabilitarGuardar(valor) {
    if (valor.length > 0) {
      if (this.Recibe == 'Cliente') {
        (document.getElementById("BotonMovimiento") as HTMLInputElement).disabled = false;
      } else {
        (document.getElementById("BotonTransferencia") as HTMLInputElement).disabled = false;
      }
    } else {
      if (this.Recibe == 'Cliente') {
        (document.getElementById("BotonMovimiento") as HTMLInputElement).disabled = true;
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
    //////console.log("resetear valores");
    this.PrecioSugeridoEfectivo = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Sugerido_Venta;
    this.MonedaTransferencia = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Nombre;
    this.MonedaRecibida = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Pesos")].Nombre;
  }

  GuardarMovimiento(formulario: NgForm) {

    formulario.value.Id_Oficina = 5;
    formulario.value.Id_Caja = 4;
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Tipo_Oficina = localStorage['Tipo_Oficina'];
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/movimiento.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.formaPagoDefault = "Efectivo";
        this.recibeParaDefault = "Transferencia";
        this.seleccioneClienteDefault = "";
        this.movimientoExitosoSwal.show();
        //////console.log(data);
        this.TipoPagoTransferencia("Efectivo");
        this.Transferencia1 = true;
        this.Transferencia2 = false;
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

  AutoSuma(pos) {
    var divisor = (document.getElementById("Tasa_Cambio_Transferencia") as HTMLInputElement).value;
    //var sumapeso = 0;
    var sumabolivar = 0;
    this.Envios.forEach((element, index) => {
      //sumapeso += element.Valor_Transferencia_Peso;
      sumabolivar += element.Valor_Transferencia_Bolivar;
    });

	var totalBolivares = (document.getElementById("Cantidad_Transferida") as HTMLInputElement).value;

    //this.cambiar = sumapeso;
    //this.entregar = sumabolivar.toFixed(2);
    //this.RealizarCambioMonedaTransferencia(sumapeso, 'cambia');
    //this.RealizarCambioMonedaTransferencia(sumabolivar, 'entrega');
	
	var formaPago = (document.getElementById("Forma_Pago") as HTMLInputElement).value; 
	if(formaPago=="Credito"){
		var idTercero = (document.getElementById("Id_Tercero") as HTMLInputElement).value;
		if(idTercero != ""){
			var indice = this.Tercero.findIndex(x => x.Id_Tercero === idTercero);
			if(indice > -1){
				var cupo = this.Tercero[indice].Cupo;
				if(parseInt(totalBolivares) < parseInt(cupo)){
					if(sumabolivar > parseInt(totalBolivares)){
						this.confirmacionSwal.title="Valor excedido";
						this.confirmacionSwal.text="La suma de los valores digitados no coinciden con el valor en bolivares para enviar ("+totalBolivares+")";
						this.confirmacionSwal.type="error";
						this.confirmacionSwal.show();
						this.Envios[pos].Valor_Transferencia_Bolivar = 0;
					}else{
						if(sumabolivar != parseInt(totalBolivares)){
							this.NuevaHileraDestinatario(pos);
						}
					}
					
				}else{
					this.confirmacionSwal.title="Valor excedido";
					this.confirmacionSwal.text="El valor en Bolivares supera el cupo permitido para este cliente ("+cupo+")";
					this.confirmacionSwal.type="error";
					this.confirmacionSwal.show();
				}
			}
		}
	}else{
		if(sumabolivar > parseInt(totalBolivares)){
			this.confirmacionSwal.title="Valor excedido";
			this.confirmacionSwal.text="La suma de los valores digitados no coinciden con el valor en bolivares para enviar ("+totalBolivares+")";
			this.confirmacionSwal.type="error";
			this.confirmacionSwal.show();
			this.Envios[pos].Valor_Transferencia_Bolivar = 0;
		}else{
			this.NuevaHileraDestinatario(pos);
		}
		
	}
	
	
	
    //this.NuevaHileraDestinatario(pos);
  }

  validarCamposBolivares(valor){
    var longitud = 0; 
    longitud = this.LongitudCarateres(valor);
    if(longitud > 0){
	 (document.getElementById("Valor_Transferencia_Bolivar0") as HTMLInputElement).disabled = false;
	}else{
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
        //////console.log(data);
        this.LlenarValoresRemitente(formulario.value.Id_Transferencia_Remitente);
        this.ModalRemitente.hide();
        this.remitenteCreadoSwal.show();
        formulario.reset();
      });
  }

  RealizarCambio(value, accion) {
    //////console.log(value);    
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
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Diario');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/corresponsaldiario/guardar_corresponsal_diario.php', datos).subscribe((data: any) => {
      formulario.reset();
    });
  }

  ConsultarCorresponsal(id) {
    this.CorresponsalBancario = id;
    let datos = new FormData();
    //let funcionario = this.IdentificacionFuncionario;
    datos.append("Identificacion_Funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);
    datos.append("Id_Corresponsal_Diario", id);
    this.http.post(this.globales.ruta + 'php/corresponsaldiario/lista_corresponsales.php', datos).subscribe((data: any) => {
      this.IdCorresponsal = data.Id_Corresponsal_Diario;
      this.ValorCorresponsal = data.Valor;
      this.DetalleCorresponsal = data.Detalle;
    });
  }


  // --------------------------------------------------------------------------- //  

  // aquí ando haciendo mis metodos


  // --------------------------------------------------------------------------- //


  actualizarVista() {
    this.Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Cambio' } }).subscribe((data: any) => {
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
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Banco' } }).subscribe((data: any) => {
      this.Bancos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Oficina', id: '5' } }).subscribe((data: any) => {
      this.LimiteOficina = data.Limite_Transferencia;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_recibos_transferencia.php').subscribe((data: any) => {
      this.Transferencia = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro' } }).subscribe((data: any) => {
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
    });

    this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: this.Funcionario } }).subscribe((data: any) => {
      this.Traslados = data.origen;
      this.TrasladosRecibidos = data.destino;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Comision' } }).subscribe((data: any) => {
      this.ServicioComision = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio' } }).subscribe((data: any) => {
      this.Servicios = data;
    });

    this.http.get(this.globales.ruta + 'php/pos/lista_clientes.php', { params: { modulo: 'Tercero' } }).subscribe((data: any) => {
      this.Tercero = data;
    });

    this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_colombianos.php', { params: { modulo: 'Cuenta_Bancaria' } }).subscribe((data: any) => {
      this.CuentaBancaria = data;
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
      this.MonedaDestino = data.Moneda[0].Nombre;
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
    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: moneda }
    }).subscribe((data: any) => {
      this.MonedaOrigen = data.Moneda[0].Nombre
      if (moneda == 2) {
        this.MonedaTasaCambio = true;
        this.MonedaComision = false;
      } else {
        this.MonedaTasaCambio = false;
        this.MonedaComision = true;
      }
    });
  }

  RealizarCambioMoneda(value, tipo) {

    //////console.log(value + " " +this.MonedaTasaCambio +  " " + this.MonedaComision)
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
              ////console.log((document.getElementById("Cantidad_Recibida") as HTMLInputElement).value)
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
			if(formaPago=="Credito"){
				var idTercero = (document.getElementById("Id_Tercero") as HTMLInputElement).value;
				if(idTercero != ""){
					var indice = this.Tercero.findIndex(x => x.Id_Tercero === idTercero);
					if(indice > -1){
						var cupo = this.Tercero[indice].Cupo;
						if(parseInt(this.entregar) > parseInt(cupo)){
							this.confirmacionSwal.title="Valor excedido";
							this.confirmacionSwal.text="El valor en Bolivares supera el cupo permitido para este cliente ("+cupo+")";
							this.confirmacionSwal.type="error";
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
    }
  }

  CambiarVista(tipo) {

    switch (tipo) {
      case "Compra": {
        this.Venta = false;
        this.TextoBoton = "Comprar"
        this.Tipo = "Compra";
        this.defectoDestino = "2";
        this.defectoOrigen = ""
        break;
      }
      case "Venta": {
        this.Venta = true;
        this.TextoBoton = "Vender"
        this.Tipo = "Venta";
        this.defectoDestino = "";
        this.defectoOrigen = "2"
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

  guardarCambio(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Cambio');
    datos.append("datos", info);

    this.http.post(this.globales.ruta + '/php/pos/guardar_cambio.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.confirmacionSwal.title = "Guardado con exito";
      this.confirmacionSwal.text = "Se ha guardado correctamente la compra/venta"
      this.confirmacionSwal.type = "success"
      this.confirmacionSwal.show();
      this.Cambios1 = true;
      this.Cambios2 = false;

    });

  }

  GuardarTransferencia(formulario: NgForm) {

    //formulario.value.Costo_Transferencia = 1;
    formulario.value.Id_Oficina = 5;
    formulario.value.Id_Caja = 4;
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Tipo_Oficina = localStorage['Tipo_Oficina'];
    
    this.Envios.forEach((element,index) => {
      if(element.Nombre == "" || element.Valor_Transferencia_Bolivar == 0 || element.Valor_Transferencia_Peso == 0){
        this.Envios.splice(index,1);
      }
    });
    
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    let info = JSON.stringify(formulario.value);
    let destinatarios = JSON.stringify(this.Envios);
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("envios", destinatarios);
    this.http.post(this.globales.ruta + 'php/pos/guardar_transferencia.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        formulario.reset();
        this.formaPagoDefault = "Efectivo";
        this.recibeParaDefault = "Transferencia";
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

      });
  }


  EditarDestinatario(id, pos) {
    this.http.get(this.globales.ruta + 'php/destinatarios/editar_destinatario.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      ////console.log(data.destinatario);
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

    //console.log(seleccion + " , " + posicion + " , " + texto);
    var pais = ((document.getElementById("Id_Pais" + posicion) as HTMLInputElement).value);
    //console.log("pais = " + 2);

    if (pais == "2") {
      switch (texto) {
        case "check": {
          var buscarBanco = this.Bancos.findIndex(x => x.Id_Banco === seleccion)
          this.Lista_Destinatarios[posicion].Numero_Cuenta = this.Bancos[buscarBanco].Identificador;
          break;
        }
        case "input": {
          //console.log("soy input");

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
	  
	console.log(this.Envios[index] == undefined && (this.Envios[pos].Destino != "") && (this.Envios[pos].Id_Destinatario_Cuenta != "") && (this.Envios[pos].Valor_Transferencia_Bolivar > 1));
    
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
          (document.getElementById("BotonMovimiento") as HTMLInputElement).disabled = true;
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
            (document.getElementById("BotonMovimiento") as HTMLInputElement).disabled = true;
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
              (document.getElementById("BotonMovimiento") as HTMLInputElement).disabled = false;
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
        this.MonedaTransferencia = 2;
        this.CambiarTasa(2);
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
          this.Departamento_Remitente = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }
        case "Destinatario": {
          this.Municipios_Destinatario = data;
          this.Departamento_Destinatario = this.Departamentos[(Departamento) - 1].Nombre;
          break;
        }

      }
    });
  }


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
          this.ValorTotal = parseFloat(value) - element.Comision;
          this.ValorEntrega = parseFloat(value);
          break;
        }
      }
    });
  }

  RealizarGiro(formulario: NgForm) {
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

  TipoPagoTransferencia(value) {
    switch (value) {
      case "Credito": {
        this.credito = true;
        this.consignacion = false;
        this.efectivo = false;
        break;
      }
      case "Consignacion": {
        this.credito = false;
        this.consignacion = true;
        this.efectivo = false;
        break;
      }
      case "Efectivo": {
        this.efectivo = true;
        this.consignacion = false;
        this.credito = false;
        break;
      }
    }
  }

  AnularTransferencia(id, formulario: NgForm) {
    let datos = new FormData();
    let info = JSON.stringify(formulario.value);
    datos.append("id", id);
    datos.append("datos", info);
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

  AnularTransferenciaModal(id, modal) {
    this.http.get(this.globales.ruta + '/php/transferencias/verificar_realizada.php', { params: { id: id } }).subscribe((data: any) => {
      var conteo = data[0].conteo;
      if (parseInt(conteo) > 0) {
        this.confirmacionSwal.title = "Bloqueada"
        this.confirmacionSwal.text = "Esta transferencia esta bloqueada"
        this.confirmacionSwal.type = "error"
        this.confirmacionSwal.show();
      } else {
        this.idTransferencia = id;
        modal.show();
      }
    });
  }

  verRecibo(valor) {
    this.http.get(this.globales.ruta + 'php/transferencias/ver_recibo.php', {
      params: { id: valor }
    }).subscribe((data: any) => {
      this.EncabezadoRecibo = data.encabezado;
      this.DestinatarioRecibo = data.destinatario;
      this.ModalVerRecibo.show();
    });
  }

}
