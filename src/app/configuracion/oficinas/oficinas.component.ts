import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

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
  public Identificacion : any[];
  public Nombre : any[];
  public Direccion : any[];
  public Departamento : any[];
  public Municipio : any[];
  public Telefono : any[];
  public Celular : any[];
  public Correo : any[];
  public Comision : any[];
  public MinCompra : any[];
  public MaxCompra : any[];
  public MinVenta : any[];
  public MaxVenta : any[];
  public Valores : any[];

  @ViewChild('ModalOficina') ModalOficina:any;
  @ViewChild('ModalEditarOficina') ModalEditarOficina:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/';   
  constructor(private http : HttpClient) { }  
  
  ngOnInit() {
    this.http.get(this.ruta+'php/oficinas/lista_oficinas.php').subscribe((data:any)=>{
        this.oficinas= data;
        console.log(this.oficinas);
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  /**
   *se llama a esta función cuando se selecciona un departamento en el combo box de departamentos
   *para hacer una consulta a la base de datos con el departamento seleccionado y llenar el combo box 
   *de municipios con los municipios correspondientes a ese departamento
   *
   * @param {*} Departamento
   * @memberof OficinasComponent
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
   * @memberof OficinasComponent
   */
  GuardarOficina(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    modal.hide();
    datos.append("modulo",'Oficina');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
      this.oficinas= data;
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
  EditarOficina(id, modal){
    console.log("editar oficina");
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Oficina', id:id}
    }).subscribe((data:any)=>{
      //console.log(data);
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
      this.ModalEditarOficina.visibleAnimate = true;
      this.ModalEditarOficina.visible = true;
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
      this.oficinas=data; 
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

}
