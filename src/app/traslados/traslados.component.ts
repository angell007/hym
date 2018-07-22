import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.css']
})
export class TrasladosComponent implements OnInit {

  //variables de formulario
  public Identificacion : any[];
  public Origen : any[];
  public Destino : any[];
  public NombreOrigen : string;
  public NombreDestino : string;
  public IdentificacionFuncionario : any[];
  public Tipo : any[];
  public IdOrigen : any[];
  public IdDestino : any[];
  public Moneda : any[];
  public Valor : any[];
  public Detalle : any[];
  public Estado : any[];

  @ViewChild('ModalTraslado') ModalTraslado:any;
  @ViewChild('ModalEditarTraslado') ModalEditarTraslado:any;
  @ViewChild('FormTraslado') FormTraslado:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 
  traslados = [];
  
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormTraslado.reset();
      this.OcultarFormulario(this.ModalTraslado);
      this.OcultarFormulario(this.ModalEditarTraslado);
    }
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/traslados/lista.php').subscribe((data:any)=>{
      this.traslados= data;
    });
  }

  SeleccionarTipo(Tipo, origen?, destino?)
  {
    var dummy = Tipo.split("-");
    this.Origen = dummy[0];
    this.Destino = dummy[1];
    console.log(origen);    
  }

  GuardarTraslado(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    console.log(info);    
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo",'Traslado');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
      this.ActualizarVista();
      formulario.reset();
    });
  }

  EditarTraslado(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Traslado', id:id}
    }).subscribe((data:any)=>{
      this.SeleccionarTipo(data.Tipo);
      this.Identificacion = id;
      this.Tipo = data.Tipo;      
      this.IdOrigen = data.Id_Origen;
      this.IdDestino = data.Id_Destino;
      this.NombreOrigen = data.Origen;
      this.NombreDestino = data.Destino;
      this.Moneda = data.Moneda;
      this.Valor = data.Valor;
      this.Estado = data.Estado;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  EliminarTraslado(id){
    let datos=new FormData();
    datos.append("modulo", 'Traslado');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  OcultarFormulario(modal){
    this.NombreOrigen = null;
    this.NombreDestino = null;
    this.Origen = null;
    this.Destino = null;
    this.Identificacion = null;
    this.Tipo = null;
    this.IdOrigen = null;
    this.IdDestino = null;
    this.Moneda = null;
    this.Valor = null;
    this.Estado = null;
    this.Detalle = null;
    modal.hide();
  }

  ObtenerOrigen(IdOrigen, tabla)
  {
    this.NombreOrigen = "dummyOrigen";
  }

  ObtenerDestino(IdDestino)
  {
    this.NombreDestino = "dummyDestino";
  }

}
