import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-traslados',
  templateUrl: './traslados.component.html',
  styleUrls: ['./traslados.component.css']
})
export class TrasladosComponent implements OnInit {

  //variables de formulario
  public Origen : any[];
  public Destino : any[];

  readonly ruta = 'https://hym.corvuslab.co/'; 
  public fecha = new Date(); 
  traslados = [];
  
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  ActualizarVista()
  {
    this.http.get(this.ruta+'php/traslados/lista.php').subscribe((data:any)=>{
      this.traslados= data;
    });
  }

  SeleccionarTipo(Tipo)
  {
    var dummy = Tipo.split("-");
    this.Origen = dummy[0];
    this.Destino = dummy[1];
  }

  GuardarTraslado(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo",'Oficina');
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
