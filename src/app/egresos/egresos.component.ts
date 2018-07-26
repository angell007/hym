import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.scss']
})
export class EgresosComponent implements OnInit {

  public Egresos : any[];
  public IdentificacionFuncionario : any[];
  public Grupos : any[];
  public Terceros : any[];
  public Monedas : any[];

  readonly ruta = 'https://hym.corvuslab.co/'; 
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

  OcultarFormulario(modal){
    modal.hide();
  }

}
