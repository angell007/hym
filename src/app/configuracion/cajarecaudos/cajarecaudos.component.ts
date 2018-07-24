import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cajarecaudos',
  templateUrl: './cajarecaudos.component.html',
  styleUrls: ['./cajarecaudos.component.scss']
})
export class CajarecaudosComponent implements OnInit {

  public cajarecaudos : any[];
  public Departamentos : any[];
  public Municipios : any[];
  public fecha = new Date(); 


  //variables que hacen referencia a los campos del formulario editar   




  @ViewChild('ModalCaja') ModalCaja:any;
  @ViewChild('ModalEditarCaja') ModalEditarCaja:any;
  @ViewChild('FormCaja') FormCaja:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta+'php/cajarecaudos/lista.php',{ params: { modulo: 'Caja_Recaudos'}}).subscribe((data:any)=>{
      this.cajarecaudos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormCaja.reset();
      this.OcultarFormulario(this.ModalCuenta);
      this.OcultarFormulario(this.ModalEditarCuenta);
    }
  }




  ActualizarVista()
  {
    this.http.get(this.ruta+'php/cajarecaudos/lista.php').subscribe((data:any)=>{
      this.cajarecaudos= data;
    });
  }


  /**
   *se llama a esta función cuando se selecciona un departamento en el combo box de departamentos
   *para hacer una consulta a la base de datos con el departamento seleccionado y llenar el combo box 
   *de municipios con los municipios correspondientes a ese departamento
   *
   * @param {*} Departamento
   * @memberof CajaRecaudosComponent
   */
  Municipios_Departamento(Departamento){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof CajaRecaudosComponent
   */








   

}