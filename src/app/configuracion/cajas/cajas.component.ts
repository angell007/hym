import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.css']
})
export class CajasComponent implements OnInit {
  public cajas : any[];
  public Oficinas : any[];

  //variables del formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Oficina : any[];
  public Detalles : any[];

  public boolNombre:boolean = false;
  public boolOficina:boolean = false;

  @ViewChild('ModalEditarCaja') ModalEditarCaja:any;
  @ViewChild('ModalVerCaja') ModalVerCaja:any;
  @ViewChild('ModalCaja') ModalCaja:any;
  @ViewChild('FormCajaAgregar') FormCajaAgregar:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Oficina'}}).subscribe((data:any)=>{
    this.Oficinas= data;
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
    this.OcultarFormulario(this.ModalCaja);
    this.OcultarFormulario(this.ModalVerCaja);
    this.OcultarFormulario(this.ModalEditarCaja);
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolOficina = false;
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/cajas/lista_cajas.php').subscribe((data:any)=>{
      console.log(data);
      this.cajas= data;
    });
  }



  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof CajasComponent
   */
  GuardarCaja(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Caja');
    datos.append("datos",info);    
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{      
      formulario.reset();
      this.OcultarFormulario(modal);
      this.ActualizarVista();
      this.InicializarBool();
      this.saveSwal.show();
    });

  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerCaja(id, modal){
    this.http.get(this.globales.ruta+'php/cajas/detalle_caja.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Oficina = data.Oficina;
      this.Detalles = data.Detalle;
      modal.show();
    });
  }

  /**
   *elimina la caja correspondiente al id que se le pasa
   *
   * @param {*} id
   * @memberof CajasComponent
   */
  EliminarCaja(id){
    let datos = new FormData();
    datos.append("modulo", 'Caja');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  /**
   *llena las variables asociadas a los componentes del formulario editar para que se muestre la información 
   *actual del elemento que se quiere editar
   *
   * @param {*} id id del elemento que se quiere editar en la tabla Caja
   * @memberof CajasComponent
   */
  EditarCaja(id){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Caja', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Oficina = data.Id_Oficina;
      this.Detalles = data.Detalle;
      this.ModalEditarCaja.show();
    });
  }

  OcultarFormulario(modal){
    this.Identificacion = null;
    this.Nombre = null;
    this.Oficina = null;
    this.Detalles = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
