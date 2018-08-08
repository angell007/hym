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

  @ViewChild('ModalEditarCuenta') ModalEditarCuenta:any;
  @ViewChild('ModalVerCuenta') ModalVerCuenta:any;
  @ViewChild('ModalCuenta') ModalCuenta:any;
  @ViewChild('FormCuenta') FormCuenta:any;
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
      this.FormCuenta.reset();
      this.OcultarFormulario(this.ModalCuenta);
      this.OcultarFormulario(this.ModalVerCuenta);
      this.OcultarFormulario(this.ModalEditarCuenta);
    }
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
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
    });
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
