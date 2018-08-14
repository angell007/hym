import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-oficinas',
  templateUrl: './oficinas.component.html',
  styleUrls: ['./oficinas.component.css']
})

export class OficinasComponent implements OnInit {

  public oficinas : any[];
  public Departamentos : any[];
  public Municipios : any[];

  //variables que hacen referencia a los campos del formulario editar   
  public edi_visible = false;
  public edi_visibleAnimate  = false;
  public Identificacion ;

  public Datos : any[] = [];
  public Departamento : any[];
  public Municipio : any[];

  public boolNombre:boolean = false;
  public boolDireccion:boolean = false;
  public boolDepartamento:boolean = false;
  public boolMunicipio:boolean = false;
  public boolTelefono:boolean = false;
  public boolCelular:boolean = false;
  public boolCorreo:boolean = false;
  public boolComision:boolean = false;
  public boolMinCompra:boolean = false;
  public boolMaxCompra:boolean = false;
  public boolMinVenta:boolean = false;
  public boolMaxVenta:boolean = false;
  public boolValores:boolean = false;

  @ViewChild('ModalOficina') ModalOficina:any;
  @ViewChild('ModalVerOficina') ModalVerOficina:any;
  @ViewChild('ModalEditarOficina') ModalEditarOficina:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('FormOficinaAgregar') FormOficinaAgregar:any;

  constructor(private http: HttpClient,private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
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
    this.OcultarFormulario(this.ModalOficina);
    this.OcultarFormulario(this.ModalVerOficina);
    this.OcultarFormulario(this.ModalEditarOficina);
  }

  InicializarBool()
  {
    this.boolNombre = false;
    this.boolDireccion = false;
    this.boolDepartamento = false;
    this.boolMunicipio = false;
    this.boolTelefono = false;
    this.boolCelular = false;
    this.boolCorreo = false;
    this.boolComision = false;
    this.boolMinCompra = false;
    this.boolMaxCompra = false;
    this.boolMinVenta = false;
    this.boolMaxVenta = false;
    this.boolValores = false;
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/oficinas/lista_oficinas.php').subscribe((data:any)=>{
      this.oficinas= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

   GuardarOficina(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo",'Oficina');
    datos.append("datos",info);
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

  GuardarOficinaEditar(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo",'Oficina');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{  
      
      this.ActualizarVista();
      this.InicializarBool();
      this.saveSwal.show();
    });
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerOficina(id, modal){
    this.http.get(this.globales.ruta+'php/oficinas/detalle_oficina.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Datos=data;      
      this.Identificacion = id;
      modal.show();
    });
  }

  EditarOficina(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Oficina', id:id}
    }).subscribe((data:any)=>{

      this.Datos=data;           
      this.Identificacion = id;
      this.Departamento = data.Id_Departamento;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      
      modal.show();
    });
  }

  EliminarOficina(id){
    let datos = new FormData();
    datos.append("modulo", 'Oficina');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  AutoSleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
      this.Municipio = Municipio;
    });
  }

  OcultarFormulario(modal){

    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
