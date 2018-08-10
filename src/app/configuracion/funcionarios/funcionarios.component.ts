import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {
  public funcionarios : any[];




  //variables que hacen referencia a los campos del formulario editar   




  @ViewChild('ModalFuncionario') ModalFuncionario:any;
  @ViewChild('ModalVerFuncionario') ModalVerFuncionario:any;
  @ViewChild('ModalEditarFuncionario') ModalEditarFuncionario:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('FormFuncionarioAgregar') FormFuncionarioAgregar:any;


  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();

  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormFuncionarioAgregar.reset();
      this.OcultarFormulario(this.ModalFuncionario);
      this.OcultarFormulario(this.ModalVerFuncionario);
      this.OcultarFormulario(this.ModalEditarFuncionario);
    }
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/funcionarios/lista_funcionarios.php').subscribe((data:any)=>{
      this.funcionarios= data;
    });
  }


  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof OficinasComponent
   */
  
   GuardarFuncionario(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);


    datos.append("modulo",'Funcionario');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
    this.ActualizarVista();
    formulario.reset();
    });    
  }



  VerFuncionario(id, modal){
    this.http.get(this.globales.ruta+'php/funcionarios/detalle_funcionario.php',{
      params:{id:id}
    }).subscribe((data:any)=>{

      
      modal.show();
    });
  }



  /**
   *
   *actualiza los datos correspondientes al id que se le pasa como primer parametro en la tabla que se especifica en
   *params:{modulo:'nombre de la tabla', id:id}
   * @param {*} id
   * @param {*} modal
   * @memberof OficinasComponent
   */
  EditarFuncionario(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Funcionario', id:id}
    }).subscribe((data:any)=>{

      
      modal.show();
    });
  }


  
  EliminarFuncionario(id){
    let datos=new FormData();
    datos.append("modulo", 'Funcionario');
    datos.append ("id",id);
    this.http.post(this.globales.ruta+ 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    })
  }



  OcultarFormulario(modal){

    
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
