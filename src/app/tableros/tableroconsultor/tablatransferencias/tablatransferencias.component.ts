import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { TransfereciaViewModel } from '../../../Modelos/TransferenciaViewModel';
import { PuntosPipe } from '../../../common/Pipes/puntos.pipe';

@Component({
  selector: 'app-tablatransferencias',
  templateUrl: './tablatransferencias.component.html',
  styleUrls: ['./tablatransferencias.component.scss', '../../../../style.scss']
})

export class TablatransferenciasComponent implements OnInit, OnChanges {

  @Input() MonedaConsulta:string = '';
  @Input() CuentaConsultor:string = '';
  @Input() Id_Funcionario:string = '';

  @Output() ActualizarIndicadores = new EventEmitter();

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
    nombre_destinatario:''
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
              private puntosPipe:PuntosPipe) 
  {
    this.GetCuentasBancarias(this.Funcionario.Identificacion_Funcionario.toString());
  }

  ngOnChanges(changes:SimpleChanges){

    if (changes.MonedaConsulta.previousValue != undefined || changes.CuentaConsultor.previousValue != undefined) {
      this.ConsultarTransferencias();
      this.ConsultarCuentaConsultor();
    }    
  }

  ngOnInit() {
    if (this.CuentaConsultor != '') {
      this.ConsultarTransferencias();
      this.ConsultarCuentaConsultor();  
    }    
  }

  ConsultarTransferencias(){

    if (this.MonedaConsulta == '' || this.CuentaConsultor == '') {
      this.TransferenciasListar = [];

    }else{
      let p = {id_moneda:this.MonedaConsulta, id_funcionario:this.Id_Funcionario};
      this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_consultores.php', {params: p}).subscribe((data: any) => {

        this.TransferenciasListar = data.todas;
      });
    }
  }

  ConsultarCuentaConsultor(){

    this.http.get(this.globales.ruta + 'php/cuentasbancarias/cuenta_consultor.php', {params: {id_cuenta:this.CuentaConsultor}}).subscribe((data: any) => {

      if (data.codigo == 'success') {
        
        this.CuentaData = data.cuenta;
        this.NombreCuenta = this.CuentaData.Numero_Cuenta + ' - ' + this.CuentaData.Nombre_Titular + ' - ' + this.CuentaData.Nombre_Tipo_Cuenta
      }else{

        this.CuentaData = '';
        this.ShowSwal(data.codigo, 'Error en la cuenta', data.mensaje);
      }      
    });
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

  BloquearTransferencia(modelo:any){

    this.TransferenciaActual = modelo.Id_Transferencia_Destinatario;
    this.AsginarValoresModalCrear(modelo);
    let data = new FormData();

    data.append("id_funcionario", this.Funcionario.Identificacion_Funcionario);
    data.append("id_transferencia", modelo.Id_Transferencia_Destinatario);
    this.http.post(this.globales.ruta+'php/transferencias/bloquear_transferencia_consultor.php', data).subscribe((response:any) => {
      if (response.codigo == 'warning') {
        this.ShowSwal(response.codigo, 'Alerta', response.mensaje);
        this.DesbloquearTransferencia();
        //this.FormatValue(modelo.Valor_Transferencia);
      }else{
        this.ModalTransferencia.show();
      }      
    });
  }

  DesbloquearTransferencia(){
    let data = new FormData();
    data.append("id_transferencia", this.TransferenciaActual);
    this.http.post(this.globales.ruta+'php/transferencias/desbloquear_transferencia_consultor.php', data).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TransferenciaModel = new TransfereciaViewModel();
        this.ConsultarTransferencias();
      }else{

        this.ShowSwal(data.codigo, "Alerta", data.mensaje);
      }
    });
    
    this.ModalTransferencia.hide();
  }

  GuardarTransferencia(modal) {
    console.log(this.MovimientoBancoModel);    

    let info = JSON.stringify(this.MovimientoBancoModel);
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("cajero", this.Id_Funcionario);
    datos.append("id_cuenta_origen", this.TransferenciaModel.Cuenta_Origen);

    this.http.post(this.globales.ruta + 'php/transferencias/guardar_transferencia_consultor.php', datos).subscribe((data: any) => {
      
      this.ShowSwal('success', 'Registro Exitoso', 'Se ha realizado la transferencia exitosamente!');
      modal.hide();
      this.ActualizarIndicadores.emit(null);
      this.ConsultarTransferencias();
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

    return params;
  }

  /*ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_consultores.php', {params: p}).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.ActivosFijos = data.query_result;
        this.TotalItems = data.numReg;
      }else{
        this.ActivosFijos = [];
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
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
      nombre_destinatario:''
    };
  }

  SetInformacionPaginacion(){
    var calculoHasta = (this.page*this.pageSize);
    var desde = calculoHasta-this.pageSize+1;
    var hasta = calculoHasta > this.TotalItems ? this.TotalItems : calculoHasta;

    this.InformacionPaginacion['desde'] = desde;
    this.InformacionPaginacion['hasta'] = hasta;
    this.InformacionPaginacion['total'] = this.TotalItems;
  }*/
}
