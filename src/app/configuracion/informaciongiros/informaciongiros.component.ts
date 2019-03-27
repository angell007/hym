import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-informaciongiros',
  templateUrl: './informaciongiros.component.html',
  styleUrls: ['./informaciongiros.component.scss']
})
export class InformaciongirosComponent implements OnInit {


  // public GirosRemitentes: any = [];
  // public GirosDestinatarios: any = [];

  // dtOptions: DataTables.Settings = {};
  // dtTrigger = new Subject();

  // dtOptions1: DataTables.Settings = {};
  // dtTrigger1 = new Subject();
    
  // @ViewChild('ModalRemitente') ModalRemitente: any;
  // @ViewChild('ModalEditarRemitente') ModalEditarRemitente: any;
  // @ViewChild('ModalDestinatario') ModalDestinatario: any;
  // @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario: any;
  // Identificacion: any;
  // GiroEditar:any ={};

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    // this.ActualizarVista();
  }

  // EliminarGiro(identificacion, tipo,estado) {

  //   switch (tipo) {
  //     case 'remitente': {
  //       this.eventoEliminar(identificacion,'Giro_Remitente',estado,'Remitente');
  //       break;
  //     }
  //     case 'destinatario': {
  //       this.eventoEliminar(identificacion,'Giro_Destinatario',estado,'Destinatario');
  //       break;
  //     }
  //   }
  // }

  // EditarGiro(identificacion, tipo) {
  //   this.http.get(this.globales.ruta + 'php/giros/detalle_giro.php', {
  //     params: { modulo: tipo, id: identificacion }
  //   }).subscribe((data: any) => {
  //     this.Identificacion = identificacion;
  //     this.GiroEditar = data;
  //     switch (tipo) {
  //       case 'Remitente': {
  //         this.ModalEditarRemitente.show();
  //         break;
  //       }
  //       case 'Destinatario': {
  //         this.ModalEditarDestinatario.show();
  //         break;
  //       }
  //     }
  //     //this.ModalEditarBanco.show();
  //   });
  // }

  // eventoEliminar(id,modulo,estado,tipo) {

  //   let datos = new FormData();
  //   datos.append("modulo",modulo);
  //   datos.append("estado",estado);
  //   datos.append("id",id);
  //   datos.append("tipo",tipo);
    
  //   this.http.post(this.globales.ruta + 'php/giros/eliminar_giro.php', datos).subscribe((data: any) => {
  //     this.ActualizarVista();
  //   });

  // }

  // ActualizarVista() {
  //   this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Remitente' } }).subscribe((data: any) => {
  //     this.GirosRemitentes = data;
  //   });

  //   this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Destinatario' } }).subscribe((data: any) => {
  //     this.GirosDestinatarios = data;
  //   });
    
  // }

  // GuardarGiro(formulario: NgForm, modal,tabla,tipo){
  //   let info = JSON.stringify(formulario.value);
  //   let datos = new FormData();
  //   datos.append("modulo",tabla);
  //   datos.append("datos",info);
  //   datos.append("tipo",tipo);
  //   this.http.post(this.globales.ruta+'php/giros/guardar_giro.php',datos)
  //   .subscribe((data:any)=>{
  //     formulario.reset();
  //     modal.hide();
  //     this.ActualizarVista();
  //   });
  // }

}
