import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-tipocuenta',
  templateUrl: './tipocuenta.component.html',
  styleUrls: ['./tipocuenta.component.scss']
})
export class TipocuentaComponent implements OnInit {

  public tiposCuenta : any = [];

  //variables de formulario
  public Identificacion : any = [];
  public Nombre : any = [];

  public boolNombre:boolean = false;
  public boolCodigo:boolean = false;

  @ViewChild('ModalCuenta') ModalCuenta:any;
  @ViewChild('ModalVerCuenta') ModalVerCuenta:any;
  @ViewChild('ModalEditarCuenta') ModalEditarCuenta:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('FormCuenta') FormCuenta:any;

  constructor(private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
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
    this.boolNombre = false;
    this.boolCodigo = false;
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{
      params:{modulo:'Tipo_Cuenta'}
    }).subscribe((data:any)=>{
      this.tiposCuenta= data;          
    });
  }

  GuardarCuenta(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Tipo_Cuenta');
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

  
  EditarCuenta(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Tipo_Cuenta', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      modal.show();
    });
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
