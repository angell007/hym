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


  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion : any[];
  public Nombre : any[];
  public Tipo : any[];
  public Departamento : any[];
  public Municipio : any[];


  @ViewChild('ModalCaja') ModalCaja:any;
  @ViewChild('ModalEditarCaja') ModalEditarCaja:any;
  @ViewChild('FormCaja') FormCaja:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormCaja.reset();
      this.OcultarFormulario(this.ModalCaja);
      this.OcultarFormulario(this.ModalEditarCaja);
    }
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/cajarecaudos/lista.php').subscribe((data:any)=>{
      this.cajarecaudos= data;
    });
  }


 
  
  Municipios_Departamento(Departamento){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

// MODIFICANDO
  GuardarCaja(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    


    datos.append("modulo",'Caja_Recaudos');
    datos.append("datos",info);

    this.OcultarFormulario(modal);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
    this.ActualizarVista();
    formulario.reset();
    });    
  }

  
  
  EditarCaja(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Oficina', id:id}
    }).subscribe((data:any)=>{
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

 
  EliminarOficina(id){
    let datos=new FormData();
    datos.append("modulo", 'Oficina');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    })
  }


  
  AutoSleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  OcultarFormulario(modal){
    modal.hide();
  }

}