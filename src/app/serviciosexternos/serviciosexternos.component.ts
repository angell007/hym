import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-serviciosexternos',
  templateUrl: './serviciosexternos.component.html',
  styleUrls: ['./serviciosexternos.component.css']
})
export class ServiciosexternosComponent implements OnInit {


  public serviciosexternos : any[];
  public fecha = new Date(); 

  



  //variables que hacen referencia a los campos del formulario editar   
















  @ViewChild('ModalServicio') ModalServicio:any;
  @ViewChild('ModalEditarServicio') ModalEditarServicio:any;
  @ViewChild('FormServicio') FormServicio:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.ruta+'php/serviciosexternos/lista.php').subscribe((data:any)=>{
      this.serviciosexternos= data;
    });
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormServicio.reset();
      this.OcultarFormulario(this.ModalServicio);
      this.OcultarFormulario(this.ModalEditarServicio);
    }
  }


  ActualizarVista()
  {
    this.http.get(this.ruta+'php/serviciosexternos/lista.php',{ params: { modulo: 'Servicios_Externos'}}).subscribe((data:any)=>{
      this.serviciosexternos= data;
    });
  }

}