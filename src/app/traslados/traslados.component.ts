import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../shared/globales/globales';

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.css']
})
export class TrasladosComponent implements OnInit {

  //public asd = "";
  //variables de formulario
  public Identificacion : any;
  public Origen : any;
  public Destino : any;
  public NombreOrigen : string;
  public NombreDestino : string;
  public IdentificacionFuncionario : any;
  public Tipo : any;
  public IdOrigen : any;
  public IdDestino : any;
  public Moneda : any;
  public Valor : any;
  public Detalle : any;
  public Estado : any;
  public Fecha : any;
  public Id_Traslado : any;
  public Nombre_Fun: any;

  public Proveedores : any[];
  public Bancos : any[];
  public Clientes : any[];

  public boolTipo:boolean = false;
  public boolMoneda:boolean = false;
  public boolValor:boolean = false;
  public boolEstado:boolean = false;
  public boolProveedorOrigen:boolean = false;
  public boolBancoOrigen:boolean = false;
  public boolClienteOrigen:boolean = false;
  public boolProveedorDestino:boolean = false;
  public boolBancoDestino:boolean = false;
  public boolClienteDestino:boolean = false;
  
  //Valores por defecto
  tipoDefault: string = "";
  monedaDefault: string = "";
  estadoDefault: string = "";

  @ViewChild('ModalTraslado') ModalTraslado:any;
  @ViewChild('ModalEditarTraslado') ModalEditarTraslado:any;
  @ViewChild('FormEditarTraslado') FormEditarTraslado:any;
  @ViewChild('FormTraslado') FormTraslado:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('confirmacionSwal') confirmacionSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date();

  traslados = [];
  conteoTraslados = [];
  
  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();   
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormTraslado.reset();
      this.OcultarFormularios();
    }
  }

  customModalTrasladoShow()
  {
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.ModalTraslado.show();
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    //this.OcultarFormulario(this.ModalTraslado);
    //this.OcultarFormulario(this.ModalEditarTraslado);
  }

  InicializarBool()
  {
    this.boolTipo = false;
    this.boolMoneda = false;
    this.boolValor = false;
    this.boolEstado = false;
    this.boolProveedorOrigen = false;
    this.boolBancoOrigen = false;
    this.boolClienteOrigen = false;
    this.boolProveedorDestino = false;
    this.boolBancoDestino = false;
    this.boolClienteDestino = false;
  }

  ActualizarVista()
  {
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
    this.http.get(this.globales.ruta+'php/proveedores/lista_proveedores.php').subscribe((data:any)=>{     
      this.Proveedores= data;        
    });
    this.http.get(this.globales.ruta+'php/bancos/lista_bancos.php').subscribe((data:any)=>{     
      this.Bancos= data;        
    });
    this.http.get(this.globales.ruta+'php/terceros/lista_clientes.php').subscribe((data:any)=>{     
      this.Clientes= data;        
    });
    this.http.get(this.ruta+'php/traslados/lista.php').subscribe((data:any)=>{
      this.traslados= data;
    });

    this.http.get(this.ruta+'php/traslados/conteo.php').subscribe((data:any)=>{
      this.conteoTraslados= data[0];     
    });
  }

  SeleccionarTipo(Tipo, origen?, destino?)
  {
    var dummy = Tipo.split("-");
    this.Origen = dummy[0];
    this.Destino = dummy[1];
   
  }

  GuardarTraslado(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    
    if(info.indexOf('"Id_Origen":""') >= 0) {
      this.errorSwal.text = "No ha seleccionado un origen";
      this.errorSwal.show();
    }
    else if(info.indexOf('"Id_Destino":""') >= 0) {
      this.errorSwal.text = "No ha seleccionado un destino";
      this.errorSwal.show();
    }
    else {
      let datos = new FormData();
      datos.append("modulo",'Traslado');
      datos.append("datos",info);
      this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos)
      .catch(error => { 
        //console.error('An error occurred:', error.error);
        this.errorSwal.text = "Se ha generado un error al intentar guardar el documento";
        this.errorSwal.show();
        return this.handleError(error);
      })
      .subscribe((data:any)=>{ 
        this.ModalTraslado.hide();
        this.FormTraslado.reset();    
        this.InicializarBool();
        this.tipoDefault = "";
        this.monedaDefault = "";
        this.estadoDefault = "";
        this.saveSwal.show();
      });
    }
    this.ActualizarVista();
  }

  ActualizarTraslado(formulario: NgForm){   
    let info = JSON.stringify(formulario.value);

    if(info.indexOf('"Id_Origen":""') >= 0) {
      this.errorSwal.text = "No ha seleccionado un origen";
      this.errorSwal.show();
    }
    else if(info.indexOf('"Id_Destino":""') >= 0) {
      this.errorSwal.text = "No ha seleccionado un destino";
      this.errorSwal.show();
    }else{
    let datos = new FormData();
    datos.append("modulo", 'Traslado');
    datos.append("datos", info);;   
    this.http.post(this.ruta + 'php/traslados/traslado_editar.php', datos).subscribe((data: any) => { 
      this.InicializarBool();
      this.tipoDefault = "";
      this.monedaDefault = "";
      this.estadoDefault = "";
     this.confirmacionSwal.title=data.titulo;
     this.confirmacionSwal.text= data.mensaje;
     this.confirmacionSwal.type= data.tipo;
     this.confirmacionSwal.show();
     this.ModalEditarTraslado.hide();
     this.FormEditarTraslado.reset();
    });
  }
  this.ActualizarVista();
 } 

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerTraslado(id, modal){
    this.http.get(this.globales.ruta+'php/traslados/traslado_ver.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Destino = data.Destino;
      this.Detalle = data.Detalle;
      this.Estado = data.Estado;
      this.IdentificacionFuncionario = data.Identificacion_Funcionario;
      this.Moneda = data.Moneda;
      this.Origen = data.Origen;
      this.Tipo = data.Tipo;
      this.Valor = data.Valor;
      this.Fecha=data.Fecha;
      this.Nombre_Fun=data.Nombre_Funcionario;
      modal.show();
    });
  }

  EditarTraslado(id, modal){
    this.InicializarBool();
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Traslado', id:id}
    }).subscribe((data:any)=>{
     
      this.SeleccionarTipo(data.Tipo);
      this.Identificacion = id;
      this.IdentificacionFuncionario = data.Identificacion_Funcionario;
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
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/traslados/traslado_anular.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  /*OcultarFormulario(modal){
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
  }*/

  /*EventChange()
  {
    this.NombreOrigen = this.asd;
  }*/

  ObtenerOrigen(IdOrigen, tabla)
  {
    if (tabla == "proveedor")
    {
      this.Proveedores.forEach(element => {
        if (element.Id_Proveedor == IdOrigen) this.NombreOrigen = element.Nombre;
      }); 
    }
    if (tabla == "banco")
    {
      this.Bancos.forEach(element => {
        if (element.Id_Banco == IdOrigen) this.NombreOrigen = element.Nombre;
      }); 
    }
    if (tabla == "cliente")
    {      
      this.Clientes.forEach(element => {
        if (element.Id_Tercero == IdOrigen) this.NombreOrigen = element.Nombre;
          /*this.asd = element.Nombre;
          this.EventChange();*/
      });
    }
  }

  ObtenerDestino(IdDestino, tabla)
  {
    if (tabla == "proveedor")
    {
      this.Proveedores.forEach(element => {
        if (element.Id_Proveedor == IdDestino) this.NombreDestino = element.Nombre;
      });
    }
    if (tabla == "banco")
    {
      this.Bancos.forEach(element => {
        if (element.Id_Banco == IdDestino) this.NombreDestino = element.Nombre;
      });
    }
    if (tabla == "cliente")
    {
      this.Clientes.forEach(element => {
        if (element.Id_Tercero == IdDestino) this.NombreDestino = element.Nombre;
      });
    }
  }

}
