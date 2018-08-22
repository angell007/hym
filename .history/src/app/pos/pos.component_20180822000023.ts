import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Globales } from '../shared/globales/globales';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject = new Subject();

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
    Numero_Documento_Destino: '',
    Id_Cuenta_Destino: '',
    Valor_Transferencia: '',
    Cuentas: []
  }];
  public CuentasDestinatario: any[];
  public Cajas: any[];
  public Cambios : any [];
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
  public MonedaTransferencia: any;
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
  vueltos: number;

  constructor(private http: HttpClient, private globales: Globales) { }


  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      buttons: [
        /*'print',
        'csv'*/
      ],
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

    this.actualizarVista();
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.IdOficina = 1;
    this.IdCaja = 1;
    this.Costo = 1;
    this.Estado = "Enviado";
    this.FormaPago = "Efectivo";
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      //this.FormOficinaAgregar.reset();
      this.OcultarFormulario(this.ModalRemitente);
      this.OcultarFormulario(this.ModalDestinatario);
    }
  }

  muestra_tabla(id){
    var tot = document.getElementsByClassName('modulos').length;
    console.log(document.getElementsByClassName('modulos'));
    for(let i=0; i<tot; i++){
      alert(i);
      document.getElementsByClassName('modulos').item[i].style.display='none';
    }
    
    document.getElementById(id).style.display = 'block';
  }
  actualizarVista() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Cambio' } }).subscribe((data: any) => {
      this.Cambios = data;
      this.dtTrigger.next();
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
      this.Monedas = data;/*
      this.CambiarTasa(this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")+1);  
      this.MonedaTransferencia = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Pesos")].Nombre;
      this.MonedaRecibida = this.Monedas[this.Monedas.findIndex(moneda => moneda.Nombre == "Bolivares")].Nombre;*/
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Funcionarios = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Tipo_Cuenta' } }).subscribe((data: any) => {
      this.TipoCuentas = data;
    });
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Destinatario' } }).subscribe((data: any) => {
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
  }

  OcultarFormulario(modal) {
    modal.hide();
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  InicializarBool() {
    this.boolFormaPago = false;
    this.boolRecibePara = false;
    this.boolSeleccioneCliente = false;
    this.boolNumeroDocumento = false;
  }

  GuardarTransferencia(formulario: NgForm) {
    //formulario.value.Costo_Transferencia = 1;
    formulario.value.Estado = "Pendiente";
    formulario.value.Id_Oficina = JSON.parse(localStorage['Oficina']);
    formulario.value.Id_Caja = JSON.parse(localStorage['Caja']);
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    formulario.value.Tipo_Oficina = localStorage['Tipo_Oficina'];
    //console.log(formulario.value);
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    let info = JSON.stringify(formulario.value);
    //console.log("info");
    //console.log(info);

    let destinatarios = JSON.stringify(this.Envios);
    //console.log("Envios");
    //console.log(this.Envios);

    let datos = new FormData();
    datos.append("datos", info);
    datos.append("envios", destinatarios);
    this.http.post(this.globales.ruta + 'php/pos/transferencia.php', datos)
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
        this.InicializarBool();
        this.transferenciaExitosaSwal.show();
        this.Envios = [{
          Numero_Documento_Destino: '',
          Id_Cuenta_Destino: '',
          Valor_Transferencia: '',
          Cuentas: []
        }];
        this.PrecioSugerido = null;
        this.MonedaTransferencia = null;
        this.MonedaRecibida = null;
        //console.log(data);      
      });
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
        this.InicializarBool();
        this.movimientoExitosoSwal.show();
        //console.log(data);      
      });
  }

  AutoCompletarDestinatario(modelo, caso) {

    if (modelo) {
      if (modelo.length > 0) {
        this.DestinatariosFiltrados = this.Destinatarios.filter(number => number.Id_Destinatario.slice(0, modelo.length) == modelo);
      }
      else {
        this.DestinatariosFiltrados = null;
      }
    }
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
            Numero_Documento_Destino: '',
            Id_Cuenta_Destino: '',
            Valor_Transferencia: '',
            Cuentas: []
          });
        }
      });
    }
  }

  NuevoDestinatario() {
    //console.log("INSIDE");
    //console.log(this.Envios);

    let agregar: boolean = true;
    let totalTransferencia = 0;
    for (let i = 0; i < this.Envios.length; ++i) {
      if (this.Envios[i].Numero_Documento_Destino === "" || this.Envios[i].Id_Cuenta_Destino === "") {
        agregar = false;
        return;
      }
      else {
        totalTransferencia += this.Envios[i].Valor_Transferencia;
      }
    }
    if (agregar) {
      if (totalTransferencia == 0) {
        return;
      }
      if (totalTransferencia <= this.CantidadTransferida) {
        this.Envios.push({
          Numero_Documento_Destino: '',
          Id_Cuenta_Destino: '',
          Valor_Transferencia: '',
          Cuentas: []
        });
      }
      else {
        this.warnTotalSwal.show();
      }
    }
  }

  EliminarDestinatario(index) {
    if (index > 0) {
      this.Envios.splice(index, 1);
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
  
      this.http.post(this.globales.ruta+'php/destinatarios/guardar_destinatario.php',datos)
        .catch(error => { 
          console.error('An error occurred:', error.error);
          this.errorSwal.show();
          return this.handleError(error);
        })
        .subscribe((data:any)=>{ 
          //console.log(data);           
          this.ModalDestinatario.hide();
          this.destinatarioCreadoSwal.show();
          this.LlenarValoresDestinatario(formulario.value.Id_Destinatario, this.Indice);
          formulario.reset();
          let textArea : any = document.getElementById('detalleText');
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

  SeleccionarTipo(tipo) {
    this.Recibe = tipo;
    //console.log(this.Recibe);    
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

  RealizarGiro(remitente: NgForm, destinatario: NgForm, giro: NgForm) {
    let formulario = giro.value;
    formulario['Documento_Remitente'] = remitente.value.Documento_Remitente;
    formulario['Nombre_Remitente'] = remitente.value.Nombre + " " + remitente.value.Apellido;
    formulario['Telefono_Remitente'] = remitente.value.Telefono + " - " + remitente.value.Celular;
    formulario['Documento_Destinatario'] = destinatario.value.Documento_Remitente;
    formulario['Nombre_Destinatario'] = destinatario.value.Nombre + " " + destinatario.value.Apellido;
    formulario['Telefono_Destinatario'] = destinatario.value.Telefono + " - " + destinatario.value.Celular;
    let info = JSON.stringify(formulario);
    let datos = new FormData();
    datos.append("modulo", 'Giro');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos).subscribe((data: any) => {
      giro.reset();
    });

    let infoRemitente = JSON.stringify(remitente.value);
    let datosRemitente = new FormData();
    datosRemitente.append("modulo", 'Giro_Remitente');
    datosRemitente.append("datos", infoRemitente);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datosRemitente).subscribe((data: any) => {
      remitente.reset();
    });

    let infoDestinatario = JSON.stringify(destinatario.value);
    let datosDestinatario = new FormData();
    datosDestinatario.append("modulo", 'Giro_Destinatario');
    datosDestinatario.append("datos", infoDestinatario);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datosDestinatario).subscribe((data: any) => {
      destinatario.reset();
    });
    this.ValorTotal = null;
    this.ValorEntrega = null;
    this.Costo = 0;
    this.Costo = 1;
  }

  CalcularTotal(value) {
    this.ValorTotal = Number.parseInt(value) + this.Costo;
    this.ValorEntrega = Number.parseInt(value) - this.Costo;
  }

  RealizarTraslado(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Traslado_Caja');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos).subscribe((data: any) => {
      formulario.reset();
    });
  }

  GuardarServicio(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo", 'Servicio');
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/genericos/guardar_generico.php', datos).subscribe((data: any) => {
      formulario.reset();
    });
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
      //formulario.reset();      
      this.ResetFormulario();
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

  CambiarTasa(value) {
    var origen = ((document.getElementById("Origen") as HTMLInputElement).value);
    //var destino= ((document.getElementById("Destino") as HTMLInputElement).value); 

    switch (origen) {
      case "1": {
        this.PrecioSugerido = this.Monedas[(parseInt(origen) - 1)].Sugerido_Venta;
        break;
      }
      case "2": {
        this.PrecioSugerido = this.Monedas[(parseInt(origen) - 1)].Sugerido_Venta;
        break;
      }
    }

    /*
    if(value>0)
    {
      this.PrecioSugerido = this.Monedas[(value-1)].Sugerido_Venta;
    }*/
  }

  CambiarTasaCambio(value) {
    var precio = ((document.getElementById("Cantidad_Recibida") as HTMLInputElement).value);
    switch (value) {
      case "1": {
        //bolivar
        //console.log(origen + "/" + precio);
        //Cantidad_Transferida
        var operacion = parseInt(value) / parseInt(precio);
        //(document.getElementById("Cantidad_Transferida") as HTMLInputElement).value = operacion;
        break;
      }

      case "2": {
        //peso
        //console.log(origen + "*" + precio);
        this.vueltos = parseInt(value) * parseInt(precio);
        break;
      }

    }

  }

  realizarCalculo() {

    var origen = ((document.getElementById("Valor") as HTMLInputElement).value);
    var destino = ((document.getElementById("Destino") as HTMLInputElement).value);
    //Precio_Sugerido
    var precio = ((document.getElementById("Precio_Sugerido") as HTMLInputElement).value);

    switch (destino) {

      case "1": {
        //bolivar
        //console.log(origen + "/" + precio);
        this.vueltos = parseInt(origen) / parseInt(precio);
        break;
      }

      case "2": {
        //peso
        //console.log(origen + "*" + precio);
        this.vueltos = parseInt(origen) * parseInt(precio);
        break;
      }

    }

  }

}
