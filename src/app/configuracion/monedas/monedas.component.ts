import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-monedas',
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.css']
})
export class MonedasComponent implements OnInit {

  public Monedas : any[];

  readonly ruta = 'http://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  ActualizarVista(){
    this.http.get(this.ruta+'php/monedas/lista_monedas.php').subscribe((data:any)=>{
      this.Monedas= data; 
    });
  }

  GuardarMoneda(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();   
    console.log(info);         
    datos.append("modulo",'Moneda');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    /*this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
    }); */ 
  }

  OcultarFormulario(modal)
  {
    modal.hide();
  }

}
