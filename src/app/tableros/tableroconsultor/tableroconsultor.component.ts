import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/pie.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/ammap.js';
import '../../../assets/charts/amchart/worldLow.js';
import '../../../assets/charts/amchart/continentsLow.js';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TouchSequence } from '../../../../node_modules/@types/selenium-webdriver';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { EventEmitter } from 'events';
import { GeneralService } from '../../shared/services/general/general.service';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';
import { SwalService } from '../../shared/services/swal/swal.service';

@Component({
  selector: 'app-tableroconsultor',
  templateUrl: './tableroconsultor.component.html',
  styleUrls: ['./tableroconsultor.component.scss']
})

export class TableroconsultorComponent implements OnInit {

  //NUEVO CODIGO  
  @ViewChild('ModalCambiarBanco') ModalCambiarBanco: any;
  @ViewChild('ModalCierreCuenta') ModalCierreCuenta:any;
  @ViewChild('ModalCrearAjuste') ModalCrearAjuste:any;
  @ViewChild('ModalCompraCuenta') ModalCompraCuenta:any;
  @ViewChild('modalT') modalT:any;
  @ViewChild('alertSwal') alertSwal:any;

  public cargar = false;
  public cargarTabla:boolean = false;
  public funcionario:any = JSON.parse(localStorage['User']);
  public Paises:any = [];
  public ListaBancos:any = [];
  public MovimientosCuentaBancaria:any = [];
  public CuentasSeleccionadas:any = [];
  public Indicadores:any = {
    Pendientes: 0,
    Realizadas: 0,
    Devueltas: 0,
    Productividad: 0,
  };

  public AperturaCuentaModel:any = {
    Id_Cuenta_Bancaria: '',
    Id_Moneda: '',
    Valor: '',
    Id_Bloqueo_Cuenta: ''
  };

  public CierreCuentaModel:any = {
    Id_Moneda: '',
    Id_Cuenta_Bancaria: '',
    Valor: '',
    Id_Bloqueo_Cuenta: ''
  };

  public CierreValoresModel:any = {
    SaldoInicial: 0,
    Egresos: 0,
    Ingresos: 0,
    SaldoFinal: 0
  };

  public DatosCuentaModel:any = {
    Nro_Cuenta: '',
    SaldoInicial: 0,
    SaldoRestante: 0
  };

  public AjusteCuentaModel:any = {
    Id_Cuenta_Bancaria: '',
    Valor: 0,
    Tipo: 'Ingreso',
    Detalle: '',
    Id_Transferencia_Destino: '0'
  };

  public CompraCuentaModel:any = {
    Id_Cuenta_Bancaria: '',
    Valor: '',
    Detalle: '',
    Id_Funcionario: ''
  };

  private Id_Movimientos_Cuenta:any = [];

  public CuentaConsultor:any = localStorage.getItem("CuentaConsultor");
  public MonedaCuentaConsultor:any = localStorage.getItem("MonedaCuentaConsultor");
  public IdBloqueoCuenta:any = '';
  public CodigoMoneda:string = '';
  public MontoInicial:any = 0;
  public TiposTransferencias:any = ['Pendientes', 'Realizadas', 'Devueltas'];

  public TablaPendientes:boolean = false;
  public TablaRealizadas:boolean = false;
  public TablaDevueltas:boolean = false;
  public Seleccionado:string = 'Pendientes';

  public ChartData:any = [];
  public ChartLabels = ['Realizadas', 'Devueltas'];

  public OpcionCuenta:string = 'Abrir';
  public IconoOpcionCuenta:string = 'ti-key';

  public AbrirModalAperturaCuenta:Subject<any> = new Subject();
  public Id_Funcionario:string = '';
  public Id_Apertura:string = '';

  constructor(private http: HttpClient, private globales: Globales, private _generalService:GeneralService, private _cuentaBancariaService:CuentabancariaService, private _swalService:SwalService) { }

  ngOnInit() {
    this.Id_Funcionario = this._generalService.Funcionario.Identificacion_Funcionario;
    this.AsignarPaises();
    //this.VerificarAperturaCuenta();
    setTimeout(() => {
      this.ConsultarAperturaFuncionario();      
    }, 500);
  }

  CargarVista(){
    if (this.cargar) {
      this.CargarIndicadores();
      this.cargarTabla = true; 
      this.TablaPendientes = true;
    };
  }

  public ConsultarAperturaFuncionario(){
    this._cuentaBancariaService.GetAperturaFuncionario(this._generalService.Funcionario.Identificacion_Funcionario).subscribe((data:any) =>{
      console.log(data);
      
      if (!data.apertura_activa) {
        this.AbrirModalAPerturaCuentas();
      }else{
        //OBTENER LAS CUENTAS DE LA APERTURA ACTUAL
        this.Id_Apertura = data.query_data.Id_Consultor_Apertura_Cuenta;
        this._getCuentasFuncionarioApertura();
      }
    });
  }

  private _getCuentasFuncionarioApertura(){
    this._cuentaBancariaService.GetCuentasFuncionarioApertura(this.Id_Apertura).subscribe((data:any) => {
      console.log(data);
      
      if (data.codigo == 'success') {
        this.CuentasSeleccionadas = data.query_data;        
      }else{
        this.CuentasSeleccionadas = [];
        this._swalService.ShowMessage(['warinig','Alerta','No se encontraron cuentas para el registro de apertura, contacte con el administrador!']);
      }
    });
  }

  public AbrirModalAPerturaCuentas(){
    console.log("abriendo modal apertura cuenta desde tablero");
    this.AbrirModalAperturaCuenta.next();
  }

  //#region CODIGO NUEVO
  CambiarCuentaBancaria(){
    if (this.CuentaConsultor != '') {
      
      if (this.CuentaConsultor == '' || this.MonedaCuentaConsultor == '') {
        this.ShowSwal('warning', 'Alerta', 'Debe abrir una cuenta antes de realizar un movimiento de cierre!');
        return;
      }else{
        this.GetMovimientosCuentaBancaria();
      }      
    }else{

      if (this.CuentaConsultor != '') {
        this.ShowSwal('warning', 'Alerta', 'Debe cerrar la cuenta actual antes de abrir otra!');
        return;
      }else{
        this.ModalCambiarBanco.show();
      }  
    }
  }

  GuardarMontoInicial2(modal) {
    let id_funcionario = this.funcionario.Identificacion_Funcionario;
    let info = JSON.stringify(this.AperturaCuentaModel);
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("id_funcionario", id_funcionario);
    datos.append("id_bloqueo_cuenta", this.IdBloqueoCuenta);
    this.http.post(this.globales.ruta + '/php/cuentasbancarias/apertura_cuenta_bancaria.php', datos).subscribe((data: any) => {

      if (data.codigo == 'warning') {
        this.ShowSwal(data.codigo, 'Alerta', data.mensaje);
        this.cargarTabla = false;
        this.TablaPendientes = false; 
        this.CierreValoresModel.SaldoInicial = 0;
        this.CierreValoresModel.SaldoFinal = 0;
        this.Id_Movimientos_Cuenta = [];
        
        this.LimpiarModeloDatosResumen();

      }else{

        this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
        this.VerificarAperturaCuenta();

        this.CierreValoresModel.SaldoInicial = parseFloat(this.MontoInicial);
        this.CierreValoresModel.SaldoFinal = parseFloat(this.MontoInicial);
        this.OpcionCuenta = 'Cambiar';
        this.IconoOpcionCuenta = 'ti-reload';
        modal.hide();
      }
    });
  }

  CerrarCuentaConsultor(){
    if (this.CuentaConsultor == '') {
      this.ShowSwal('warning', 'Alerta', 'Debe abrir una cuenta antes de realizar un movimiento de cierre!');
      return;
    }
    
    let id_funcionario = this.funcionario.Identificacion_Funcionario;
    let info = JSON.stringify(this.CierreCuentaModel);
    let ids = JSON.stringify(this.Id_Movimientos_Cuenta);
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("id_funcionario", id_funcionario);
    datos.append("id_movimientos", ids);

    this.http.post(this.globales.ruta + '/php/cuentasbancarias/cierre_cuenta_bancaria.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);

      this.CuentaConsultor = '';
      this.MonedaCuentaConsultor = '';
      this.IdBloqueoCuenta = '';
      this.CodigoMoneda = '';
      this.MontoInicial = 0;
      this.Id_Movimientos_Cuenta = [];
      this.LimpiarModeloCierreCuenta();
      this.LimpiarModeloDatosResumen();
      this.LimpiarModeloValoresCierre();
      this.LimpiarIndicadores();
      this.ChartData = [];
      this.ModalCierreCuenta.hide();
      this.ModalCambiarBanco.show();
      localStorage.setItem('CuentaConsultor', '');
      localStorage.setItem('MonedaCuentaConsultor', '');
      this.OpcionCuenta = 'Abrir';
      this.IconoOpcionCuenta = 'ti-key';
    });
  }

  VerificarAperturaCuenta(){

    this.http.get(this.globales.ruta+'php/cuentasbancarias/verificar_apertura_cuenta.php', {params:{id_funcionario:this.funcionario.Identificacion_Funcionario}}).subscribe((data:any) => {

      if (data.existe == 0) {
        this.ModalCambiarBanco.show();
        this.MonedaCuentaConsultor = '';
        this.CuentaConsultor = '';
        this.IdBloqueoCuenta = '';
        this.CodigoMoneda = '';
        this.MontoInicial = 0;
        this.LimpiarModeloDatosResumen();
        this.LimpiarIndicadores();
        this.ChartData = [];
        this.Id_Movimientos_Cuenta = [];
        this.OpcionCuenta = 'Abrir';
        this.IconoOpcionCuenta = 'ti-key';
        this.cargar = false;
      }else{
        
        
        this.MonedaCuentaConsultor = data.datos_apertura.Id_Moneda;
        this.CuentaConsultor = data.datos_apertura.Id_Cuenta_Bancaria;
        this.IdBloqueoCuenta = data.datos_apertura.Id_Bloqueo_Cuenta;
        this.CodigoMoneda = data.datos_apertura.Codigo;
        this.MontoInicial = data.datos_apertura.Valor;
        this.CierreValoresModel.SaldoInicial = parseFloat(this.MontoInicial);
        this.CierreValoresModel.SaldoFinal = parseFloat(this.MontoInicial);
        localStorage.setItem("CuentaConsultor", this.CuentaConsultor);        
        localStorage.setItem("MonedaCuentaConsultor", this.MonedaCuentaConsultor);
        this.OpcionCuenta = 'Cambiar';
        this.IconoOpcionCuenta = 'ti-reload';

        this.CargarIndicadores();
        this.GetResumenCuenta();

        this.cargar =  true;
      }

      this.CargarVista();
    });
  }

  GuardarMovimientoAjuste(){
    let info = JSON.stringify(this.AjusteCuentaModel);
    let datos = new FormData();
    datos.append("modelo", info);

    this.http.post(this.globales.ruta + 'php/cuentasbancarias/crear_movimiento_ajuste_cuenta.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
      this.GetMovimientosCuentaBancaria();
      this.ModalCrearAjuste.hide();
      this.LimpiarModeloAjuste();
    });
  }

  GuardarCompra(){
    let info = JSON.stringify(this.CompraCuentaModel);
    let datos = new FormData();
    datos.append("modelo", info);

    this.http.post(this.globales.ruta + 'php/cuentasbancarias/crear_compra_cuenta_bancaria.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
      this.GetMovimientosCuentaBancaria();
      this.ModalCompraCuenta.hide();
      this.LimpiarModeloCompra();
    });
  }

  CargarIndicadores(){
    this.http.get(this.globales.ruta+'php/transferencias/indicadores_transferencias.php', {params:{id_funcionario:this.funcionario.Identificacion_Funcionario}}).subscribe((data:any) => {

      if (data.existe == 1) {
        this.Indicadores = data.indicadores;
        this.ChartData = [];
        this.ChartData.push(this.Indicadores.Realizadas);
        this.ChartData.push(this.Indicadores.Devueltas);
      }else{
        this.LimpiarIndicadores();
        this.ChartData = [];
      }      
    });
  }

  CargarBancosPais(id_pais){
    if (id_pais == '') {
        this.LimpiarModeloCuentaBancaria();
        this.ListaBancos = [];
        return;
    }

    this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_por_pais.php', {params:{id_pais:id_pais}}).subscribe((data: any) => {
        this.ListaBancos = data;
    });
  }

  AbrirModalAjuste(){
    this.AjusteCuentaModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
    this.ModalCrearAjuste.show();
  }

  AbrirModalCompra(){
    this.CompraCuentaModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
    this.CompraCuentaModel.Id_Funcionario = this.funcionario.Identificacion_Funcionario;
    this.ModalCompraCuenta.show();
  }

  LimpiarModeloCuentaBancaria(){
    this.AperturaCuentaModel = {
        Id_Cuenta_Bancaria: '',
        Id_Moneda: '',
        Valor: '',
        Id_Bloqueo_Cuenta: ''
    };
  }
  
  LimpiarModeloValoresCierre(){
    this.CierreValoresModel = {
      SaldoInicial: this.MontoInicial,
      Egresos: 0,
      Ingresos: 0,
      SaldoFinal: this.MontoInicial
    };
  }

  LimpiarModeloCierreCuenta(){
    this.CierreCuentaModel = {
      Id_Moneda: '',
      Id_Cuenta_Bancaria: '',
      Valor: '',
      Id_Bloqueo_Cuenta: ''
    };
  }

  LimpiarModeloDatosResumen(){
    this.DatosCuentaModel = {
      Nro_Cuenta: 0,
      SaldoInicial: 0,
      SaldoRestante: 0
    };
  }

  LimpiarIndicadores(){
    this.Indicadores = {
      Pendiente: 0,
      Realizadas: 0,
      Devueltas: 0,
      Productividad: 0,
    };
  }

  LimpiarModeloAjuste(){
    this.AjusteCuentaModel = {
      Id_Cuenta_Bancaria: '',
      Valor: 0,
      Tipo: 'Ingreso',
      Detalle: '',
      Id_Transferencia_Destino: '0'
    };
  }

  LimpiarModeloCompra(){
    this.CompraCuentaModel = {
      Id_Cuenta_Bancaria: '',
      Valor: '',
      Detalle: '',
      Id_Funcionario: ''
    };
  }

  AsignarPaises(){
    this.Paises = this.globales.Paises;
    this.cargar =  true;
    this.CargarVista();
  }

  VerificarSaldo(value) {
    if (value == '') {
        this.AperturaCuentaModel.Valor = '';
        this.AperturaCuentaModel.Id_Cuenta_Bancaria = value;
        this.AperturaCuentaModel.Id_Moneda = '';
        return;
    }

    this.ConsultarValorCuenta(value);
  }

  ConsultarValorCuenta(id_cuenta){
    this.http.get(this.globales.ruta+'php/cuentasbancarias/cargar_saldo_cuenta.php', {params:{id_cuenta:id_cuenta}}).subscribe((data:any) => {

      if (data.codigo == "error") {
        this.ShowSwal(data.codigo, 'Error en la cuenta', data.mensaje);
        this.AperturaCuentaModel.Id_Moneda = '';
        this.AperturaCuentaModel.Id_Cuenta_Bancaria = '';
        this.AperturaCuentaModel.Valor = '';

      }else{

        var index = this.ListaBancos.findIndex(x => x.Id_Cuenta_Bancaria === id_cuenta);
        if (index > -1) {
            this.AperturaCuentaModel.Id_Moneda = this.ListaBancos[index].Id_Moneda;
            this.AperturaCuentaModel.Id_Cuenta_Bancaria = id_cuenta;
            this.AperturaCuentaModel.Valor = data.Valor_Cuenta;
            //GuardarInicio
        }
      }
    });
  }

  GetNumeroCuenta(){
    var index = this.ListaBancos.findIndex(x => x.Id_Cuenta_Bancaria === this.CuentaConsultor);
    if (index > -1) {
        return this.ListaBancos[index].Numero_Cuenta;
        //GuardarInicio
    }
  }

  GetMovimientosCuentaBancaria(){
    let p = { id_cuenta: this.CuentaConsultor, id_bloqueo_cuenta:this.IdBloqueoCuenta };
    this.http.get(this.globales.ruta+'php/cuentasbancarias/movimientos_cuenta_bancaria.php', {params:p}).subscribe((data:any) => {
      
      
      this.CierreValoresModel.SaldoFinal = this.CierreValoresModel.SaldoInicial;

      if (data.data[0]) {
        
        this.MovimientosCuentaBancaria = data.data;
        this.Id_Movimientos_Cuenta = data.ids;
        this.LlenarValoresCierre(this.MovimientosCuentaBancaria);
        this.AsignarValoresModeloCierreCuenta();
      }else{
        this.MovimientosCuentaBancaria = [];
        this.Id_Movimientos_Cuenta = [];
        this.LimpiarModeloValoresCierre();
        this.AsignarValoresModeloCierreCuenta();
      }
    });

    this.ModalCierreCuenta.show();
  }

  LlenarValoresCierre(valores){    
    let egresos = 0;
    let ingresos = 0;

    valores.forEach((m, i) => {
      let e = parseFloat(m.Egreso);
      let ing = parseFloat(m.Ingreso);

      egresos += e;
      ingresos += ing; 

      if (e != 0 && ing == 0) {
        this.CierreValoresModel.SaldoFinal = parseFloat(this.CierreValoresModel.SaldoFinal) - e;  
      }else if (e == 0 && ing != 0){
        this.CierreValoresModel.SaldoFinal = parseFloat(this.CierreValoresModel.SaldoFinal) + ing;
      }
    });

    this.CierreValoresModel.Egresos = egresos;
    this.CierreValoresModel.Ingresos = ingresos;
  }

  GetResumenCuenta(){
    this.http.get(this.globales.ruta+'php/cuentasbancarias/resumen_cuenta_bancaria.php', {params:{id_cuenta:this.CuentaConsultor}}).subscribe((data:any) => {
      
      this.DatosCuentaModel.Nro_Cuenta = data.Resumen.Numero_Cuenta;
      this.DatosCuentaModel.SaldoInicial = data.Resumen.Saldo_Inicial;
      this.DatosCuentaModel.SaldoRestante = data.Resumen.Saldo_Final;
    });
  }

  AsignarValoresModeloCierreCuenta(){    

    this.CierreCuentaModel.Id_Moneda = this.MonedaCuentaConsultor;
    this.CierreCuentaModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
    this.CierreCuentaModel.Valor = this.CierreValoresModel.SaldoFinal.toString();
    this.CierreCuentaModel.Id_Bloqueo_Cuenta = this.IdBloqueoCuenta;
  }

  CerrarModalCierreCuenta(){
    this.LimpiarModeloValoresCierre();
    this.MovimientosCuentaBancaria = [];
    this.ModalCierreCuenta.hide();
  }

  MostrarTabla(tabla){
    
    this.Seleccionado = tabla;
    
    switch (tabla) {
      case 'Pendientes':
        this.TablaPendientes = true;
        this.TablaRealizadas = false;
        this.TablaDevueltas = false;
        break;

      case 'Realizadas':
        this.TablaPendientes = false;
        this.TablaRealizadas = true;
        this.TablaDevueltas = false;
        break;

      case 'Devueltas':
        this.TablaPendientes = false;
        this.TablaRealizadas = false;
        this.TablaDevueltas = true;
        break;
    
      default:
        break;
    }
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  public RecibirCuentasSeleccionadas(datos:any){
    console.log(datos);
    
    this.CuentasSeleccionadas = datos.cuentas;
    this.Id_Apertura = datos.id_apertura;
  }

  //#endregion
}
