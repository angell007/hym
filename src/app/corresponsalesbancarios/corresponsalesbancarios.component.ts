import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-corresponsalesbancarios',
  templateUrl: './corresponsalesbancarios.component.html',
  styleUrls: ['./corresponsalesbancarios.component.css']
})
export class CorresponsalesbancariosComponent implements OnInit {
  public corresponsales : any[];
  public Departamentos : any[];
  public Municipios : any[];

  //variables que hacen referencia a los campos del formulario editar   

  public Nombre : any[];
  public Cupo : any[];
  public Departamento : any[];
  public Municipio : any[];


  @ViewChild('ModalCorresponsal') ModalCorresponsal:any;
  @ViewChild('ModalEditarCorresponsal') ModalEditarCorresponsal:any;
  @ViewChild('FormCorresponsal') FormCorresponsal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 

  public fecha = new Date();
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/corresponsalesbancarios/lista.php').subscribe((data:any)=>{
      this.corresponsales= data;
    });
  }

}