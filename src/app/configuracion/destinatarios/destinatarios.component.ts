import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-destinatarios',
  templateUrl: './destinatarios.component.html',
  styleUrls: ['./destinatarios.component.css']
})
export class DestinatariosComponent implements OnInit {

  public destinatarios : any[];
  public Paises : any[];
  public Bancos : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Cuentas : any[];
  public IdBanco : any[];
  public IdPais : any[];
  public Detalle : any[];

  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario:any;
  @ViewChild('ModalDestinatario') ModalDestinatario:any;
  @ViewChild('FormDestinatario') FormDestinatario:any;
  readonly ruta = 'http://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { } 

  ngOnInit() {
    this.http.get(this.ruta+'php/destinatarios/lista_destinatarios.php').subscribe((data:any)=>{
        this.destinatarios= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Banco'}}).subscribe((data:any)=>{
      this.Bancos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormDestinatario.reset();
      this.OcultarFormulario(this.ModalDestinatario);
      this.OcultarFormulario(this.ModalEditarDestinatario);
    }
  }

  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof DestinatariosComponent
   */
  GuardarDestinatario(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    console.log(info);
    this.OcultarFormulario(modal);
    datos.append("modulo",'Destinatario');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
      this.destinatarios= data;
      formulario.reset();
    });   
  }

  EditarDestinatario(id){
    console.log(id);  
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Destinatario', id:id}
    }).subscribe((data:any)=>{
      console.log(data);      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Cuentas = data.Cuentas;
      this.IdBanco = data.Id_Banco; 
      this.IdPais = data.Id_Pais;
      this.Detalle = data.Detalle;
      this.ModalEditarDestinatario.show();
    });
  }

  EliminarDestinatario(id){
    let datos=new FormData();
    datos.append("modulo", 'Destinatario');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.destinatarios=data; 
      this.deleteSwal.show();
    })
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Cuentas = null;
    this.IdBanco = null; 
    this.IdPais = null;
    this.Detalle = null;
    modal.hide();
  }

}
