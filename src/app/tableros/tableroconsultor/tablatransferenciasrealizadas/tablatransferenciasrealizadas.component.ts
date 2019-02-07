import { Component, OnInit, Input, Output, ViewChild, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tablatransferenciasrealizadas',
  templateUrl: './tablatransferenciasrealizadas.component.html',
  styleUrls: ['./tablatransferenciasrealizadas.component.scss']
})
export class TablatransferenciasrealizadasComponent implements OnInit, OnChanges {

  @Input() MonedaConsulta:string = '';
  @Input() CuentaConsultor:string = '';
  @Input() Id_Funcionario:string = '';

  @Output() ActualizaIndicadores = new EventEmitter();

  @ViewChild('alertSwal') alertSwal:any;
  @ViewChild('ModalDevolucionTransferencia') ModalDevolucionTransferencia:any;

  public TransferenciasListar:any = [];
  public CuentaData:any = [];
  public NombreCuenta:string = '';
  public valor_transferencia_devolver = 0;

  public DevolucionModel:any = {
    Motivo_Devolucion: '',
    Id_Transferencia: ''
  };

  public MonedaCuentaConsultor:any = '';

  constructor(private http:HttpClient, public globales:Globales) { }

  ngOnChanges(changes:SimpleChanges){
    if (changes.MonedaConsulta.previousValue != undefined || changes.CuentaConsultor.previousValue != undefined) {
      this.ConsultarTransferencias();
      this.ConsultarCuentaConsultor();
    }  
  }

  ngOnInit() {
    this.ConsultarTransferencias();
    this.ConsultarCuentaConsultor();
  }

  ConsultarTransferencias(){

    let p = {id_moneda:this.MonedaConsulta, id_funcionario:this.Id_Funcionario};
    this.http.get(this.globales.ruta + 'php/transferencias/lista_transferencias_realizadas_consultores.php', {params: p}).subscribe((data: any) => {

      this.TransferenciasListar = data.realizadas;
    });
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

  AbrirModalDevolucion(id_transferencia, valor){
    this.DevolucionModel.Id_Transferencia = id_transferencia;
    this.valor_transferencia_devolver = valor;
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

    let info = this.normalize(JSON.stringify(this.DevolucionModel));
    let datos = new FormData();
    datos.append("modelo", info); 
    datos.append("valor", this.valor_transferencia_devolver.toString());
    this.http.post(this.globales.ruta + 'php/transferencias/devolver_transferencia.php', datos).subscribe((data: any) => {

      this.ShowSwal(data.codigo, 'Registro Exitoso', data.mensaje);
      this.ModalDevolucionTransferencia.hide();
      this.LimpiarModeloDevolucion();
      this.ConsultarTransferencias();
      this.ActualizaIndicadores.emit(null);
    });
  }

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

}
