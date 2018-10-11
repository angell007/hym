import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss']
})
export class CargosComponent implements OnInit {

  public Grupo : any[];
  Cargo: any[];
  Dependencia: any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Codigo : any[];

  public boolNombre:boolean = false;
  public boolCodigo:boolean = false;

  @ViewChild('ModalDocumento') ModalDocumento:any;
  @ViewChild('ModalVerDocumento') ModalVerDocumento:any;
  @ViewChild('ModalEditarDocumento') ModalEditarDocumento:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('FormDocumento') FormDocumento:any;
  IdGrupo: any;
  IdDependencia: any;

  constructor(private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{
      params:{modulo:'Grupo_Tercero'}
    }).subscribe((data:any)=>{
      this.Grupo = data;       
    });

    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{
      params:{modulo:'Cargo'}
    }).subscribe((data:any)=>{
      this.Cargo = data;       
    });

    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{
      params:{modulo:'Dependencia'}
    }).subscribe((data:any)=>{
      this.Dependencia = data;       
    });
  }

  GuardarGrupo(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Grupo_Tercero');
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
      this.saveSwal.show();
    });  
    
  }

  GuardarDependencia(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Dependencia');
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
      this.saveSwal.show();
    });  
    
  }

  GuardarCargo(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Cargo');
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
      this.saveSwal.show();
    });  
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }
 
  Edicion =[];
  EditarGrupo(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Grupo_Tercero', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Edicion = data;
      modal.show();
    });
  }

  EditarDependencia(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Dependencia', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = id;
      this.Nombre = data;
      this.IdGrupo = data.Id_Grupo;
      modal.show();
    });
  }

  EditarCargo(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Cargo', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.IdDependencia = data.Id_Dependencia;
      modal.show();
    });
  }


  EliminarGrupo(id){
    let datos = new FormData();
    datos.append("modulo", 'Grupo_Tercero');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php ', datos ).subscribe((data: any) => {
      this.ActualizarVista();
    });
  }

  EliminarDependencia(id){
    let datos = new FormData();
    datos.append("modulo", 'Dependencia');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php ', datos ).subscribe((data: any) => {
      this.ActualizarVista();
    });
  }

  EliminarCargo(id){
    let datos = new FormData();
    datos.append("modulo", 'Cargo');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php ', datos ).subscribe((data: any) => {
       this.ActualizarVista();
    });
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Codigo = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
