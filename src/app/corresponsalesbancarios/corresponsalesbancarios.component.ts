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



















//MODIFICANDO


  
  GuardarCorresponsal(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo",'Corresponsal_Bancario');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
      this.ActualizarVista();
      formulario.reset();
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
  EditarCorresponsal(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Corresponsal_Bancario', id:id}
    }).subscribe((data:any)=>{

      this.

      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.Departamento = data.Id_Departamento;
      this.AutoSleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.Comision = data.Comision;
      this.MinCompra = data.Min_Compra;
      this.MaxCompra = data.Max_Compra;
      this.MinVenta = data.Min_Venta;
      this.MaxVenta = data.Max_Venta;
      this.Valores = data.Valores;
      modal.show();


    });
  }

  /**
   *elimina la oficina correspondiente al id que se le envia
   *
   * @param {*} id
   * @memberof OficinasComponent
   */
  EliminarOficina(id){
    let datos=new FormData();
    datos.append("modulo", 'Oficina');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    })
  }

  /**
   *carga los municipios correspondietes al departamento que se asigno al formulario en la consulta de la función
   *Editar() y luego asigna el municipio correspondiente obtenido en la consulta de la función Editar.
   *
   * @param {*} Departamento departamento del que se obtendran los municipios
   * @param {*} Municipio municipio que se asignara una vez se cargue la lista de municipios
   * @memberof OficinasComponent
   */
  AutoSleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
      this.Municipio = Municipio;
    });
  }

  OcultarFormulario(modal){
    this.Identificacion = null;
    this.Nombre = null;
    this.Direccion = null;
    this.Departamento = null;
    this.Municipio = null;
    this.Telefono = null;
    this.Celular = null;
    this.Correo = null;
    this.Comision = null;
    this.MinCompra = null;
    this.MaxCompra = null;
    this.MinVenta = null;
    this.MaxVenta = null;
    this.Valores = null;
    modal.hide();
  }

}