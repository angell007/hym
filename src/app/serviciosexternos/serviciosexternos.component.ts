import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-serviciosexternos',
  templateUrl: './serviciosexternos.component.html',
  styleUrls: ['./serviciosexternos.component.css']
})
export class ServiciosexternosComponent implements OnInit {

  



  //variables que hacen referencia a los campos del formulario editar   
















  @ViewChild('ModalServicio') ModalServicio:any;
  @ViewChild('ModalEditarServicio') ModalEditarServicio:any;
  @ViewChild('FormServicio') FormServicio:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 

  public fecha = new Date(); 
  public serviciosexternos = [];
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/serviciosexternos/lista.php').subscribe((data:any)=>{
      this.serviciosexternos= data;
    });
  }

}