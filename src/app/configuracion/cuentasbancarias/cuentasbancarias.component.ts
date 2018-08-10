import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-cuentasbancarias',
  templateUrl: './cuentasbancarias.component.html',
  styleUrls: ['./cuentasbancarias.component.css']
})
export class CuentasbancariasComponent implements OnInit {
  public cuentas : any[];
  public Bancos : any[];

  //variables de formulario
  public Identificacion : any[];
  public NumeroCuenta : any[];
  public IdBanco : any[];
  public Banco : any[];
  public NombreTitular : any[];
  public IdentificacionTitular : any[];
  public SaldoInicial : any[];
  public FechaInicial : any[];
  public Detalle : any[];

  public boolCuenta:boolean = false;
  public boolBanco:boolean = false;
  public boolTitular:boolean = false;
  public boolIdTitular:boolean = false;
  public boolSaldoInicial:boolean = false;
  public boolFechaSaldoInicial:boolean = false;

  @ViewChild('ModalEditarCuenta') ModalEditarCuenta:any;
  @ViewChild('ModalVerCuenta') ModalVerCuenta:any;
  @ViewChild('ModalCuenta') ModalCuenta:any;
  @ViewChild('FormCuenta') FormCuenta:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  
  constructor(private http : HttpClient, private globales: Globales) { }

  ngOnInit() { 
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Banco'}}).subscribe((data:any)=>{
      this.Bancos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios();
    }
  }

OcultarFormularios()
{
  this.InicializarBool();
  this.OcultarFormulario(this.ModalCuenta);
  this.OcultarFormulario(this.ModalVerCuenta);
  this.OcultarFormulario(this.ModalEditarCuenta);
}

  InicializarBool()
  {
    this.boolCuenta = false;
    this.boolBanco = false;
    this.boolTitular = false;
    this.boolIdTitular = false;
    this.boolSaldoInicial = false;
    this.boolFechaSaldoInicial = false;
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/cuentasbancarias/lista_cuentas.php').subscribe((data:any)=>{
      this.cuentas= data;
    });
  }

  GuardarCuenta(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();    
    datos.append("modulo",'Cuenta_Bancaria');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
      this.InicializarBool();
      this.saveSwal.show();
    });
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerCuenta(id, modal){
    this.http.get(this.globales.ruta+'php/cuentasbancarias/detalle_cuenta_bancaria.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.NumeroCuenta = data.NumeroCuenta;
      this.Banco = data.Banco;
      this.NombreTitular = data.NombreTitular;
      this.IdentificacionTitular = data.IdentificacionTitular;
      this.SaldoInicial = data.SaldoInicial;
      this.FechaInicial = data.FechaInicial;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  EliminarCuenta(id){
    let datos=new FormData();
    datos.append("modulo", 'Cuenta_Bancaria');
    datos.append ("id",id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  EditarCuenta(id){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Cuenta_Bancaria', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.NumeroCuenta = data.Numero_Cuenta;
      this.IdBanco = data.Id_Banco;
      this.NombreTitular = data.Nombre_Titular;
      this.IdentificacionTitular = data.Identificacion_Titular;
      this.SaldoInicial = data.Saldo_Inicial;
      this.FechaInicial = data.Fecha_Inicial;
      this.Detalle = data.Detalle;
      this.ModalEditarCuenta.show();
    });
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.NumeroCuenta = null;
    this.IdBanco = null;
    this.NombreTitular = null;
    this.IdentificacionTitular = null;
    this.SaldoInicial = null;
    this.FechaInicial = null;
    this.Detalle = null;
    modal.hide();
  }


  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
