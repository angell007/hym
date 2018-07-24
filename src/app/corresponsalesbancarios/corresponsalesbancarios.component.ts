import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-corresponsalesbancarios',
  templateUrl: './corresponsalesbancarios.component.html',
  styleUrls: ['./corresponsalesbancarios.component.css']
})
export class CorresponsalesbancariosComponent implements OnInit {
  public corresponsales : any[];
  public Departamentos : any[];
  public Municipios : any[];
  public fecha = new Date();

  //variables que hacen referencia a los campos del formulario editar   

  public Nombre : any[];
  public Cupo : any[];
  public Departamento : any[];
  public Municipio : any[];


  @ViewChild('ModalCorresponsal') ModalCorresponsal:any;
  @ViewChild('ModalEditarCorresponsal') ModalEditarCorresponsal:any;
  @ViewChild('FormCorresponsal') FormCorresponsal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta+'php/corresponsalesbancarios/lista.php',{ params: { modulo: 'Corresponsal_Bancario'}}).subscribe((data:any)=>{
      this.corresponsales= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormCorresponsal.reset();
      this.OcultarFormulario(this.ModalCorresponsal);
      this.OcultarFormulario(this.ModalEditarCorresponsal);
    }
  }



  ActualizarVista()
  {
    this.http.get(this.ruta+'php/corresponsalesbancarios/lista.php').subscribe((data:any)=>{
      this.corresponsales= data;
    });
  }



  /**
   *se llama a esta función cuando se selecciona un departamento en el combo box de departamentos
   *para hacer una consulta a la base de datos con el departamento seleccionado y llenar el combo box 
   *de municipios con los municipios correspondientes a ese departamento
   *
   * @param {*} Departamento
   * @memberof CorresponsalesBancariosComponent
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
   * @memberof CorresponsalesBancariosComponent
   */










}