import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tipodocumento',
  templateUrl: './tipodocumento.component.html',
  styleUrls: ['./tipodocumento.component.css']
})
export class TipodocumentoComponent implements OnInit {

  public tiposDocumentos : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Codigo : any[];

  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('ModalDocumento') ModalDocumento:any;
  @ViewChild('ModalEditarDocumento') ModalEditarDocumento:any;
  @ViewChild('FormDocumento') FormDocumento:any;
  readonly ruta = 'http://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormDocumento.reset();
      this.OcultarFormulario(this.ModalDocumento);
      this.OcultarFormulario(this.ModalEditarDocumento);
    }
  }

  ActualizarVista(){
    this.http.get(this.ruta+'php/tiposdocumentos/lista_tipos_documentos.php').subscribe((data:any)=>{
      this.tiposDocumentos= data;          
    });
  }

  GuardarDocumento(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Tipo_Documento');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
    });  
  }

  EditarDocumento(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Tipo_Documento', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Codigo = data.Codigo;
      modal.show();
    });
  }

  EliminarDocumento(id){
    let datos=new FormData();
    datos.append("modulo", 'Tipo_Documento');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Codigo = null;
    modal.hide();
  }

}
