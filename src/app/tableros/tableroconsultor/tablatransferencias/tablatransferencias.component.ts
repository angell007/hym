import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { TransfereciaViewModel } from '../../../Modelos/TransferenciaViewModel';
import { PuntosPipe } from '../../../common/Pipes/puntos.pipe';
import { TransferenciaService } from '../../../shared/services/transferencia/transferencia.service';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ISubscription } from 'rxjs/Subscription';
import { ToastService } from '../../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-tablatransferencias',
  templateUrl: './tablatransferencias.component.html',
  styleUrls: ['./tablatransferencias.component.scss', '../../../../style.scss']
})

export class TablatransferenciasComponent implements OnInit, OnChanges {

 // @Input() MonedaConsulta:string = '';
  //@Input() CuentaConsultor:string = '';
  @Input() Id_Funcionario:string = '';
  @Input() Id_Apertura:string = '';
  @Input() CuentasBancariasSeleccionadas:any = [];

  @Output() ActualizarIndicadores = new EventEmitter();
  private  TransferenciasActualizadas:ISubscription;

  @ViewChild('ModalPrueba') ModalPrueba:any;
  @ViewChild('ModalTransferencia') ModalTransferencia:any;
  @ViewChild('alertSwal') alertSwal:any;

  public Funcionario:any = JSON.parse(localStorage['User']);

  public TransferenciasListar:any = [];
  private TransferenciaActual:any = '';
  public ListaBancos:any = [];
  public CuentaData:any = [];
  public NombreCuenta:string = '';
  public CuentasBancarias:any = [];
  public ValorConFormato:string = '';
  public Cargando:boolean = false;

  public MovimientoBancoModel:any = {
    Valor: '0',
    Id_Cuenta_Bancaria: '',
    Detalle: '',
    Tipo: 'Egreso',
    Id_Transferencia_Destino: '',
    Numero_Transferencia: '',
    Ajuste: 'No'
  };

  public Filtros:any = {
    fecha: '',
    codigo:'',
    cajero: '',
    valor:'',
    pendiente:'',
    cedula:'',
    cta_destino:'',
    nombre_destinatario:'',
    estado:''
  };

  //Paginación
  public maxSize = 5;
  public pageSize = 10;
  public TotalItems:number;
  public page = 1;
  public InformacionPaginacion:any = {
    desde: 0,
    hasta: 0,
    total: 0
  }

  public TransferenciaModel:TransfereciaViewModel = new TransfereciaViewModel();

  //public CuentaConsultor:any = '';
  public MonedaCuentaConsultor:any = '';

  constructor(private http:HttpClient, public globales:Globales,
              private cuentaService:CuentabancariaService,
              private puntosPipe:PuntosPipe,
              private _transferenciaService:TransferenciaService,
              private _toastService:ToastService) 
  {
    //this.GetCuentasBancarias(this.Funcionario.Identificacion_Funcionario.toString());
  }

  ngOnChanges(changes:SimpleChanges){

    // if (changes.CuentasBancariasSeleccionadas.previousValue != undefined) {
    //   console.log("entro en cambios");
    //   if (this.CuentasBancariasSeleccionadas.length == 0) {   
    //     console.log("no hay cuentas seleccionadas");     
    //     this.TransferenciasListar = [];
    //     this.TotalItems = 0;
    //   }else{
    //     console.log("hay cuentas seleccionadas");
    //     this.ConsultaFiltrada();
    //   }
    // }

    // if (changes.MonedaConsulta.previousValue != undefined || changes.CuentaConsultor.previousValue != undefined) {
    //   //this.ConsultarTransferencias();
    //   //this.ConsultarCuentaConsultor();
    //   this.ConsultaFiltrada();
    // }
  }

  ngOnInit() {
    //Inicializa observables para actualizar cuentas cada segundo
    // this.TransferenciasActualizadas=TimerObservable.create(0, 1000)
    // .subscribe(() => {
    //   this.ConsultaFiltradaObservable(true);
    // });
    this.ConsultaFiltrada();
  }

  GetCuentasBancarias(idFuncionario:string){
    this.cuentaService.getCuentasBancariasFuncionario(idFuncionario).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
      }else{

        this.ShowSwal("warning", "Alerta", "No se econtraron datos de cuentas bancarias!");
      }
    });
  }
  
  // public GetTransferenciasObservable(){
  //   this._transferenciaService.get(this.generalService.Funcionario.Identificacion_Funcionario).subscribe((data:any) => {      
  //     if (data.codigo == 'success') {
  //       this.CuentasBancarias = data.query_data;
  //     }else{
  //       this.CuentasBancarias = [];
  //     }
  //   });
  // }

  BloquearTransferencia(modelo:any){

    this._transferenciaService.CheckEstadoAperturaTransferencia(modelo.Id_Transferencia_Destinatario).subscribe((data:any) => {
      if (data == '1') {
        this.TransferenciaActual = modelo.Id_Transferencia_Destinatario;
        this.AsginarValoresModalCrear(modelo);
        let data = new FormData();

        data.append("id_funcionario", this.Funcionario.Identificacion_Funcionario);
        data.append("id_transferencia", modelo.Id_Transferencia_Destinatario);
        this._transferenciaService.BloquearTransferencia(data).subscribe();        
        this.ModalTransferencia.show();
      }
    });
    

    // this.http.post(this.globales.ruta+'php/transferencias/bloquear_transferencia_consultor.php', data).subscribe((response:any) => {
    //   if (response.codigo == 'warning') {
    //     this.ShowSwal(response.codigo, 'Alerta', response.mensaje);
    //     this.DesbloquearTransferencia();
    //     //this.FormatValue(modelo.Valor_Transferencia);
    //   }else{
    //     this.ModalTransferencia.show();
    //   }      
    // });
  }

  DesbloquearTransferencia(){
    let data = new FormData();
    data.append("id_transferencia", this.TransferenciaActual);
    this._transferenciaService.DesbloquearTransferencia(data).subscribe((data:any) => {
      this.TransferenciaActual = '';
      this.ConsultaFiltrada();
    });
    this.TransferenciaModel = new TransfereciaViewModel();
    this.ModalTransferencia.hide();
    // this.http.post(this.globales.ruta+'php/transferencias/desbloquear_transferencia_consultor.php', data).subscribe((data:any) => {
    //   if (data.codigo == 'success') {
    //     this.TransferenciaModel = new TransfereciaViewModel();
    //     this.ConsultaFiltrada();
    //   }else{

    //     this.ShowSwal(data.codigo, "Alerta", data.mensaje);
    //   }
    // });
    
  }

  GuardarTransferencia(modal) {
    console.log(this.MovimientoBancoModel);    

    let info = JSON.stringify(this.MovimientoBancoModel);
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("cajero", this.Id_Funcionario);
    datos.append("id_apertura", this.Id_Apertura);
    datos.append("id_cuenta_origen", this.TransferenciaModel.Cuenta_Origen);

    this.http.post(this.globales.ruta + 'php/transferencias/guardar_transferencia_consultor.php', datos).subscribe((data: any) => {
      
      this.ShowSwal('success', 'Registro Exitoso', 'Se ha realizado la transferencia exitosamente!');
      modal.hide();
      this.ActualizarIndicadores.emit(null);
      this.ConsultaFiltrada();
    });
  }

  FormatValue(value:string){
    console.log(value);
    
    this.ValorConFormato = this.puntosPipe.transform(value);
    console.log(this.ValorConFormato);
    console.log(this.MovimientoBancoModel);
    // Remove or comment this line if you dont want 
    // to show the formatted amount in the textbox.
    //element.target.value = this.formattedAmount;
}

  AsginarValoresModalCrear(modelo:any){
    //let t = this.TransferenciasListar.filter(x => x.Id_Transferencia_Destinatario == id_transferencia);
    this.TransferenciaModel = modelo;   

    this.MovimientoBancoModel.Valor = modelo.Valor_Real;
    this.MovimientoBancoModel.Id_Transferencia_Destino = modelo.Id_Transferencia_Destinatario;
    //this.MovimientoBancoModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
  };

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  SetFiltros(paginacion:boolean) {
    let params:any = {};
    
    params.tam = this.pageSize;
    //params.id_moneda = this.MonedaConsulta;
    params.id_funcionario = this.Id_Funcionario;

    if(paginacion === true){
      params.pag = this.page;
    }else{        
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
    }

    if (this.Filtros.fecha.trim() != "") {
      params.fecha = this.Filtros.fecha;
    }

    if (this.Filtros.codigo.trim() != "") {
      params.codigo = this.Filtros.codigo;
    }

    if (this.Filtros.cajero.trim() != "") {
      params.cajero = this.Filtros.cajero;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
    }

    if (this.Filtros.pendiente.trim() != "") {
      params.pendiente = this.Filtros.pendiente;
    }

    if (this.Filtros.cedula.trim() != "") {
      params.cedula = this.Filtros.cedula;
    }

    if (this.Filtros.cta_destino.trim() != "") {
      params.cta_destino = this.Filtros.cta_destino;
    }

    if (this.Filtros.nombre_destinatario.trim() != "") {
      params.nombre_destinatario = this.Filtros.nombre_destinatario;
    }
    
    if (this.Filtros.estado.trim() != "") {
      params.estado = this.Filtros.estado;
    }

    return params;
  }

  ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_consultores.php', {params: p}).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TransferenciasListar = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.TransferenciasListar = [];
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ConsultaFiltradaObservable(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    // this.Cargando = true;
    this._transferenciaService.GetTransferenciasConsultorObservable(p).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TransferenciasListar = data.query_data;
        this.TotalItems = data.numReg;
      }else{
        this.TransferenciasListar = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:5000};
        this._toastService.ShowToast(toastObj);
      }
      
      this.Cargando = false;
      this.SetInformacionPaginacion();
    });
  }

  ResetValues(){
    this.Filtros = {
      fecha: '',
      codigo:'',
      cajero: '',
      valor:'',
      pendiente:'',
      cedula:'',
      cta_destino:'',
      nombre_destinatario:'',
      estado:''
    };
  }

  SetInformacionPaginacion(){
    var calculoHasta = (this.page*this.pageSize);
    var desde = calculoHasta-this.pageSize+1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }
}
