import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
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
    Id_Cuenta_Destino: '',
    Valor_Transferencia: '',
    Cuentas: []
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
  public PrecioSugerido: number;
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
  ValorTransferencia: any;
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
  Servicio =[];

  constructor(private http: HttpClient, private globales: Globales) { }


  ngOnInit() {

    this.actualizarVista();
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.IdOficina = 5;
    this.IdCaja = 4;
    //this.Costo = 1;
    this.Estado = "Enviado";
    this.FormaPago = "Efectivo";
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


  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      //this.FormOficinaAgregar.reset();
      this.OcultarFormulario(this.ModalRemitente);
      this.OcultarFormulario(this.ModalDestinatario);
    }
  }

  muestra_tabla(id) {
    var tot = document.getElementsByClassName('modulos').length;
    for (let i = 0; i < tot; i++) {
      var id2 = document.getElementsByClassName('modulos').item(i).getAttribute("id");
      document.getElementById(id2).style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
  }

  AutoCompletarDestinatario(modelo, i) {
    if (modelo.Cuentas != undefined) {
      this.Envios[i].Numero_Documento_Destino = modelo.Id_Destinatario;
      this.Envios[i].Nombre = modelo.Nombre;
      this.Envios[i].Cuentas = modelo.Cuentas;
    }
  }

  OcultarFormulario(modal) {
    modal.hide();
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  ResetValues() {
    //console.log("resetear valores");
    this.PrecioSugerido = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Sugerido_Venta;
    this.MonedaTransferencia = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Nombre;
    this.MonedaRecibida = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Pesos")].Nombre;
  }

  GuardarMovimiento(formulario: NgForm) {
    //formulario.value.Costo_Transferencia = 1;
    //console.log(localStorage);

    formulario.value.Estado = "Pendiente";
    formulario.value.Id_Oficina = JSON.parse(localStorage['Oficina']);
    formulario.value.Id_Caja = JSON.parse(localStorage['Caja']);
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Tipo_Oficina = localStorage['Tipo_Oficina'];
    //console.log(formulario.value); 
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
        //console.log(data);      
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
      //console.log("número de documento inconrrecto.");      
    }
    else {
      this.http.get(this.globales.ruta + 'php/pos/cuentas_destinatarios.php', { params: { id: destinatario, nombre: destinatario } }).subscribe((data: any) => {

        //console.log("DESTINATARIOS");

        //console.log(data);

        if (data.length == 0) {
          //console.log("Num documento");
          //console.log(this.Envios[index].Numero_Documento_Destino);

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
            Id_Cuenta_Destino: '',
            Valor_Transferencia: '',
            Cuentas: []
          });
        }
      });
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
      //console.log("número de documento inconrrecto.");      
    }
    else {
      this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { modulo: 'Transferencia_Remitente', id: remitente } }).subscribe((data: any) => {
        //console.log("REMITENTE");

        //console.log(data);
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

  ValidarTransferencia() {
    //console.log("cerrar modal");    
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

  GuardarDestinatario(formulario: NgForm) {
    for (let i = 0; i < this.Cuentas.length; ++i) {
      this.Cuentas[i].Id_Destinatario = formulario.value.Id_Destinatario;
    }
    let destinatario = formulario.value;
    destinatario['Detalle'] = this.Detalle;
    let info = JSON.stringify(destinatario);
    let cuentas = JSON.stringify(this.Cuentas);
    let datos = new FormData();
    datos.append("datos", info);
    datos.append("destinatario", cuentas);

    console.log(cuentas);

    //console.log(destinatario);

    this.http.post(this.globales.ruta + 'php/destinatarios/guardar_destinatario.php', datos)
      .catch(error => {
        console.error('An error occurred:', error.error);
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data: any) => {
        //console.log(data);           
        this.ModalDestinatario.hide();
        this.destinatarioCreadoSwal.show();
        this.LlenarValoresDestinatario(formulario.value.Id_Destinatario, this.Indice);
        formulario.reset();
        let textArea: any = document.getElementById('detalleText');
        textArea.value = '';
        this.Cedula = null;
      });
    this.actualizarVista();
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
        //console.log(data);
        this.LlenarValoresRemitente(formulario.value.Id_Transferencia_Remitente);
        this.ModalRemitente.hide();
        this.remitenteCreadoSwal.show();
        formulario.reset();
      });
  }

  ValidarTotalTransferencia() {

  }

  RealizarCambio(value, accion) {
    //console.log(value);    
    if (this.MonedaRecibida != this.MonedaTransferencia) {
      switch (accion) {
        case "transferir":
          this.CantidadTransferida = value * this.PrecioSugerido;
          break;

        case "recibir":
          this.CantidadRecibida = value / this.PrecioSugerido;
          break;
      }
    }

  }

  SeleccionarMonedaRecibe(moneda) {
    this.MonedaRecibe = moneda;
    var origen = ((document.getElementById("Moneda_Origen") as HTMLInputElement).value);

    if (parseInt(origen) > 0) {
      this.PrecioSugerido = this.Monedas[(parseInt(origen) - 1)].Sugerido_Venta;
    } else {
      this.PrecioSugerido = 0;
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

  ResetFormulario() {
    this.IdCorresponsal = null;
    this.ValorCorresponsal = null;
    this.DetalleCorresponsal = null;
    this.CorresponsalBancario = null;
  }


  // --------------------------------------------------------------------------- //  

  // aquí ando haciendo mis metodos


  // --------------------------------------------------------------------------- //


  actualizarVista() {
    this.Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Cambio' } }).subscribe((data: any) => {
      this.Cambios = data;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

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

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Transferencia' } }).subscribe((data: any) => {
      this.Transferencia = data;
      this.dtTrigger1.next();
    });

    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

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
      this.dtTriggerTraslado.next();
      this.dtTriggerTraslado1.next();
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio_Comision' } }).subscribe((data: any) => {
      this.ServicioComision = data;
    });

    //Servicios
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio' } }).subscribe((data: any) => {
      this.Servicios = data;
    });

  }

  CambiarTasa(value) {
    this.http.get(this.globales.ruta + 'php/pos/buscar_tasa.php', {
      params: { id: value }
    }).subscribe((data: any) => {
      this.PrecioSugerido = data.Dependencia[0].Valor;
      this.ValorTransferencia = data.Dependencia[13].Valor;
      this.MonedaDestino = data.Moneda[0].Nombre
    });
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

    //console.log(value + " " +this.MonedaTasaCambio +  " " + this.MonedaComision)
    var suma = 0;
    this.Envios.forEach(element => {
      suma += element.Valor_Transferencia;
    });

    if (this.entregar > suma) {
      this.entregar = suma;
    } else {
      switch (tipo) {
        case 'cambia': {

          var divisor = 1;
          if (this.MonedaTasaCambio == true) {
            divisor = this.PrecioSugerido;
          } else {
            divisor = this.ValorTransferencia;
          }

          this.entregar = (parseInt(value) / divisor);
          this.entregar = this.entregar.toFixed(2);
          break;
        }
        case 'entrega': {
          var divisor = 1;
          if (this.MonedaTasaCambio == true) {
            divisor = this.PrecioSugerido;
          } else {
            divisor = this.ValorTransferencia;
          }
          this.cambiar = (parseInt(value) * divisor);
          break;
        }
      }
    }


  }

  ObtenerVueltos(valor) {
    var plata = ((document.getElementById("Cambia") as HTMLInputElement).value);
    this.vueltos = valor - parseInt(plata);
  }

  CambiarVista(tipo) {

    switch (tipo) {
      case "Compra": {
        this.Venta = false;
        this.TextoBoton = "Comprar"
        this.Tipo = "Compra";
        break;
      }
      case "Venta": {
        this.Venta = true;
        this.TextoBoton = "Vender"
        this.Tipo = "Venta";
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
        this.Envios = [{
          Destino: '',
          Numero_Documento_Destino: '',
          Nombre: '',
          Id_Cuenta_Destino: '',
          Valor_Transferencia: '',
          Cuentas: []
        }];
        this.Transferencia1 = true;
        this.Transferencia2 = false;
      });
  }

  volverCambioEfectivo() {
    this.Cambios1 = true;
    this.Cambios2 = false;
  }

  volverReciboTransferencia() {
    this.Transferencia1 = true;
    this.Transferencia2 = false;
  }

  volverReciboGiro() {
    this.Giro1 = true;
    this.Giro2 = false;
  }

  volverTraslado() {
    this.Traslado1 = true;
    this.Traslado2 = false;
  }

  volverServicio(){
    this.Servicio1 = true;
    this.Servicio2 = false;
  }

  volverReciboServicio() {
    this.Servicio1 = true;
    this.Servicio2 = false;
  }

  NuevoDestinatario(pos) {

    var index = pos + 1;
    var limite = parseInt(this.LimiteOficina);

    var suma = 0;
    if (this.Envios.length == limite) {
      this.Envios.forEach(element => {
        suma += element.Valor_Transferencia;
      });
      this.entregar = suma;
      this.RealizarCambioMoneda(suma, 'entrega')
    } else {
      if (this.Envios[index] == undefined) {
        this.Envios.push({
          Destino: '',
          Numero_Documento_Destino: '',
          Nombre: '',
          Id_Cuenta_Destino: '',
          Valor_Transferencia: '',
          Cuentas: []
        });
      }
    }
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
      this.dtTrigger2.next();
    });

    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

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

  DatosRemitenteGiro = [];
  DatosDestinatario = [];

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


  RealizarTraslado(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_pos.php', datos).subscribe((data: any) => {
      formulario.reset();
      this.volverTraslado();
      modal.hide();
      this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: this.Funcionario } }).subscribe((data: any) => {
        this.Traslados = data.origen;
        this.TrasladosRecibidos = data.destino;
      });

    });
  }

  AnularTraslado(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: this.Funcionario } }).subscribe((data: any) => {
        this.Traslados = data.origen;
        this.TrasladosRecibidos = data.destino;
      });
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
      this.http.get(this.globales.ruta + 'php/pos/listar_traslado_funcionario.php', { params: { id: this.Funcionario } }).subscribe((data: any) => {
        this.Traslados = data.origen;
        this.TrasladosRecibidos = data.destino;
      });
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

  GuardarServicio(formulario: NgForm , modal) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/pos/guardar_pos.php', datos).subscribe((data: any) => {
      formulario.reset();
      modal.hide();
      this.volverServicio();
      this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio' } }).subscribe((data: any) => {
        this.Servicios = data;
      });
    });
  }

  AnulaServicio(id, estado) {
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("id", id);
    datos.append("estado", estado);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Servicio' } }).subscribe((data: any) => {
        this.Servicios = data;
      });
    });
  }

  esconderAnular(valor){
    switch(valor){
      case "Activo":{
        return true;
      }
      case "Inactivo":{
        return false;
      }
    }
  }

  editarServicio(id){
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', { params: { id: id, modulo:"Servicio" } }).subscribe((data: any) => {
      this.Servicio = data;
      this.ValorComisionServicio = data.Comision;
      this.ModalServicioEditar.show();     
    });
  }

}
