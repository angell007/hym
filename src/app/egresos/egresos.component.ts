import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.scss']
})
export class EgresosComponent implements OnInit {

  public Egresos : any[];  
  public Grupos : any[];
  public Terceros : any[];
  public Monedas : any[];

  //variables de formulario
  public Identificacion : any[];
  public IdentificacionFuncionario : any[];
  public IdGrupo : any[];
  public IdTercero : any[];
  public Moneda : any[];
  public Valor : any[];
  public Detalle : any[];

  readonly ruta = 'https://hym.corvuslab.co/'; 
  @ViewChild('deleteSwal') deleteSwal:any;
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Grupo'}}).subscribe((data:any)=>{
      this.Grupos= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Moneda'}}).subscribe((data:any)=>{
      this.Monedas= data;
    });
    this.IdentificacionFuncionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/egresos/lista_egresos.php').subscribe((data:any)=>{
      this.Egresos= data;
    });
  }

  ListaTerceros(grupo)
  {
    console.log(grupo);    
    this.http.get(this.ruta+'php/egresos/lista_terceros.php',{ params: { id: grupo}}).subscribe((data:any)=>{
      this.Terceros= data;
    });
  }

  GuardarEgreso(formulario:NgForm, modal)
  {
    formulario.value.Identificacion_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario; 
    console.log(formulario.value);    
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo",'Egreso');
    datos.append("datos",info);
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{      
      this.ActualizarVista();
      formulario.reset();
    });
  }

  EliminarEgreso(id){
    let datos=new FormData();
    datos.append("modulo", 'Egreso');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.ActualizarVista();
      this.deleteSwal.show();
    });    
  }

  EditarEgreso(id, modal){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Egreso', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.IdGrupo = data.Id_Grupo;
      this.AutoSleccionarTercero(this.IdGrupo, data.Id_Tercero);
      this.Moneda = data.Moneda;
      this.Valor = data.Valor;
      this.Detalle = data.Detalle;
      modal.show();
    });
  }

  AutoSleccionarTercero(grupo, tercero){
    this.http.get(this.ruta+'php/egresos/lista_terceros.php',{ params: { id: grupo}}).subscribe((data:any)=>{
      this.Terceros= data;
      this.IdTercero = tercero;
    });
  }

  OcultarFormulario(modal){
    this.Identificacion = null;
    this.IdGrupo = null;
    this.IdTercero = null;
    this.Moneda = null;
    this.Valor = null;
    this.Detalle = null;
    modal.hide();
  }

}
