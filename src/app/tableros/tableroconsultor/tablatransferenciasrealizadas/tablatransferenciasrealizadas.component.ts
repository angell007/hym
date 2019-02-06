import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tablatransferenciasrealizadas',
  templateUrl: './tablatransferenciasrealizadas.component.html',
  styleUrls: ['./tablatransferenciasrealizadas.component.scss']
})
export class TablatransferenciasrealizadasComponent implements OnInit {

  @Input() MonedaConsulta:string = '1';
  @Input() CuentaConsultor:string = '';
  @Input() Id_Funcionario:string = '';

  @ViewChild('alertSwal') alertSwal:any;

  public TransferenciasListar:any = [];
  private TransferenciaActual:any = '';
  public ListaBancos:any = [];
  public CuentaData:any = [];
  public NombreCuenta:string = '';

  public MovimientoBancoModel:any = {
    Valor: '0',
    Id_Cuenta_Bancaria: '0',
    Detalle: '',
    Tipo: 'Egreso',
    Id_Transferencia_Destino: '',
    Numero_Transferencia: '',
    Ajuste: 'No'
  };

  //public CuentaConsultor:any = '';
  public MonedaCuentaConsultor:any = '';

  constructor(private http:HttpClient, public globales:Globales) { }

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

  BloquearTransferencia(id_transferencia){

    this.TransferenciaActual = id_transferencia;
    this.AsginarValoresModalCrear(id_transferencia);
    let data = new FormData();

    data.append("id_funcionario", this.Id_Funcionario);
    data.append("id_transferencia", id_transferencia);
    this.http.post(this.globales.ruta+'php/transferencias/bloquear_transferencia_consultor.php', data).subscribe((response:any) => {
      if (response.codigo == 'warning') {
        this.ShowSwal(response.codigo, 'Alerta', response.mensaje);
      }else{
        //this.ModalPrueba.show();
      }      
    });
  }

  DesbloquearTransferencia(){
    let data = new FormData();
    data.append("id_transferencia", this.TransferenciaActual);
    this.http.post(this.globales.ruta+'php/transferencias/desbloquear_transferencia_consultor.php', data).subscribe(data => {
    });
    
    //this.ModalPrueba.hide();
  }

  GuardarTransferencia(modal) {
    console.log(this.MovimientoBancoModel);
    

    let info = JSON.stringify(this.MovimientoBancoModel);
    let datos = new FormData();
    datos.append("modelo", info);
    datos.append("cajero", this.Id_Funcionario);

    this.http.post(this.globales.ruta + 'php/transferencias/guardar_transferencia_consultor.php', datos).subscribe((data: any) => {
      
      this.ShowSwal('success', 'Registro Exitoso', 'Se ha realizado la transferencia exitosamente!');
      modal.hide();
      this.ConsultarTransferencias();
    });
  }

  AsginarValoresModalCrear(id_transferencia){
    let t = this.TransferenciasListar.filter(x => x.Id_Transferencia == id_transferencia);    

    this.MovimientoBancoModel.Valor = t[0].Cantidad_Transferida;
    this.MovimientoBancoModel.Id_Transferencia_Destino =  id_transferencia;
    this.MovimientoBancoModel.Id_Cuenta_Bancaria = this.CuentaConsultor;
  };

  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
