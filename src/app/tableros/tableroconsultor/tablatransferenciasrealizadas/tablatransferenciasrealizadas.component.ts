import { Component, OnInit, Input, Output, ViewChild, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';
import { GeneralService } from '../../../shared/services/general/general.service';

@Component({
  selector: 'app-tablatransferenciasrealizadas',
  templateUrl: './tablatransferenciasrealizadas.component.html',
  styleUrls: ['./tablatransferenciasrealizadas.component.scss', '../../../../style.scss']
})
export class TablatransferenciasrealizadasComponent implements OnInit, OnChanges {

  // @Input() MonedaConsulta:string = '';
  // @Input() CuentaConsultor:string = '';
  @Input() Id_Funcionario:string = '';

  @Output() ActualizaIndicadores = new EventEmitter();

  @ViewChild('alertSwal') alertSwal:any;
  @ViewChild('ModalDevolucionTransferencia') ModalDevolucionTransferencia:any;

  public TransferenciasListar:any = [];
  public CuentaData:any = [];
  public NombreCuenta:string = '';
  public valor_transferencia_devolver = 0;
  public Cargando:boolean = false;

  public DevolucionModel:any = {
    Motivo_Devolucion: '',
    Id_Transferencia: '',
    Id_Pago:''
  };

  public Filtros:any = {
    fecha: '',
    codigo:'',
    consultor: '',
    valor:'',
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

  public MonedaCuentaConsultor:any = '';

  constructor(private http:HttpClient, 
              public globales:Globales,
              private generalService:GeneralService) { }

  ngOnChanges(changes:SimpleChanges){
      this.ConsultaFiltrada();
  }

  ngOnInit() {
    this.ConsultaFiltrada();
  }

  // ConsultarTransferencias(){

  //   let p = {id_moneda:this.MonedaConsulta, id_funcionario:this.Id_Funcionario};
  //   this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_realizadas_consultores.php', {params: p}).subscribe((data: any) => {

  //     this.TransferenciasListar = data.realizadas;
  //   });
  // }

  // ConsultarCuentaConsultor(){

  //   this.http.get(this.globales.ruta + 'php/cuentasbancarias/cuenta_consultor.php', {params: {id_cuenta:this.CuentaConsultor}}).subscribe((data: any) => {

  //     if (data.codigo == 'success') {
        
  //       this.CuentaData = data.cuenta;
  //       this.NombreCuenta = this.CuentaData.Numero_Cuenta + ' - ' + this.CuentaData.Nombre_Titular + ' - ' + this.CuentaData.Nombre_Tipo_Cuenta
  //     }else{

  //       this.CuentaData = '';
  //       this.ShowSwal(data.codigo, 'Error en la cuenta', data.mensaje);
  //     }      
  //   });
  // }

  AbrirModalDevolucion(obj:any){
    this.DevolucionModel.Id_Transferencia = obj.Id_Transferencia_Destinatario;
    this.valor_transferencia_devolver = obj.Valor;
    this.DevolucionModel.Id_Pago = obj.Id_Pago_Transfenecia;
    this.ModalDevolucionTransferencia.show();    
  }

  CerrarModalDevolucion(){
    this.LimpiarModeloDevolucion();
    this.ModalDevolucionTransferencia.hide();
  }

  LimpiarModeloDevolucion(){
    this.DevolucionModel = {
      Motivo_Devolucion: '',
      Id_Transferencia: ''
    };
  }

  RealizarDevolucion() {    
    console.log(this.DevolucionModel);

    let info = this.generalService.normalize(JSON.stringify(this.DevolucionModel));
    let datos = new FormData();
    datos.append("modelo", info); 
    datos.append("valor", this.valor_transferencia_devolver.toString());
    this.http.post(this.globales.ruta + 'php/transferencias/devolver_transferencia.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
      this.ModalDevolucionTransferencia.hide();
      this.LimpiarModeloDevolucion();
      //this.ConsultarTransferencias();
      this.ActualizaIndicadores.emit(null);
    });
  }

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

    if (this.Filtros.consultor.trim() != "") {
      params.consultor = this.Filtros.consultor;
    }

    if (this.Filtros.valor.trim() != "") {
      params.valor = this.Filtros.valor;
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

  ConsultaFiltrada(paginacion:boolean = false) {

    var p = this.SetFiltros(paginacion);    

    if(p === ''){
      this.ResetValues();
      return;
    }
    
    this.Cargando = true;
    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_realizadas_consultores.php', {params: p}).subscribe((data:any) => {
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

  ResetValues(){
    this.Filtros = {
      fecha: '',
      codigo:'',
      cajero: '',
      valor:'',
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
  }

}
