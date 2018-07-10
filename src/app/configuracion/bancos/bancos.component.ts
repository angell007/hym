import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent implements OnInit {
  public bancos : any[];
  public Paises : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Pais : any[];
  public Identificador : any[];
  public Detalle : any[];

  @ViewChild('ModalEditarBanco') ModalEditarBanco:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  readonly ruta = 'https://hym.corvuslab.co/'; 
  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.http.get(this.ruta+'php/bancos/lista_bancos.php').subscribe((data:any)=>{
        this.bancos= data;
    });
    this.http.get(this.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
  }

  GuardarBanco(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Banco');
    datos.append("datos",info);
    modal.hide();
    this.http.post(this.ruta+'php/genericos/guardar_generico.php',datos).subscribe((data:any)=>{
      formulario.reset();
      this.bancos= data;
    });
  }

  EliminarBanco(id){
    let datos=new FormData();
    datos.append("modulo", 'Banco');
    datos.append ("id",id);
    this.http.post(this.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.bancos=data; 
      this.deleteSwal.show();
    })    
  }

  EditarBanco(id){
    this.http.get(this.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Banco', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Pais = data.Id_Pais;
      this.Identificador = data.Identificador;
      this.Detalle = data.Detalle;
      this.ModalEditarBanco.show();
    });
  }

}
