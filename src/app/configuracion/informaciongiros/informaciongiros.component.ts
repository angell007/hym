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


  public GirosRemitentes: any[];
  public GirosDestinatarios: any[];

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  dtOptions1: DataTables.Settings = {};
  dtTrigger1 = new Subject();
    
  @ViewChild('ModalRemitente') ModalRemitente: any;
  @ViewChild('ModalEditarRemitente') ModalEditarRemitente: any;
  @ViewChild('ModalDestinatario') ModalDestinatario: any;
  @ViewChild('ModalEditarDestinatario') ModalEditarDestinatario: any;
  Identificacion: any;
  GiroEditar =[];

  constructor(private http: HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  EliminarGiro(identificacion, tipo,estado) {

    switch (tipo) {
      case 'remitente': {
        this.eventoEliminar(identificacion,'Giro_Remitente',estado,'Remitente');
        break;
      }
      case 'destinatario': {
        this.eventoEliminar(identificacion,'Giro_Destinatario',estado,'Destinatario');
        break;
      }
    }
  }

  EditarGiro(identificacion, tipo) {
    this.http.get(this.globales.ruta + 'php/giros/detalle_giro.php', {
      params: { modulo: tipo, id: identificacion }
    }).subscribe((data: any) => {
      this.Identificacion = identificacion;
      this.GiroEditar = data;
      console.log(data);

      switch (tipo) {
        case 'Remitente': {
          this.ModalEditarRemitente.show();
          break;
        }
        case 'Destinatario': {
          this.ModalEditarDestinatario.show();
          break;
        }
      }
      //this.ModalEditarBanco.show();
    });
  }

  eventoEliminar(id,modulo,estado,tipo) {

    let datos = new FormData();
    datos.append("modulo",modulo);
    datos.append("estado",estado);
    datos.append("id",id);
    datos.append("tipo",tipo);
    
    this.http.post(this.globales.ruta + 'php/giros/eliminar_giro.php', datos).subscribe((data: any) => {
      /*this.deleteSwal.show();*/
      this.ActualizarVista();
    });

  }

  ActualizarVista() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Remitente' } }).subscribe((data: any) => {
      this.GirosRemitentes = data;
      this.dtTrigger.next();
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Giro_Destinatario' } }).subscribe((data: any) => {
      this.GirosDestinatarios = data;
      this.dtTrigger1.next();
    });

    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      responsive: true,
      /* below is the relevant part, e.g. translated to spanish */
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "<<",
          previous: "<",
          next: ">",
          last: ">>"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };
    
  }

  GuardarGiro(formulario: NgForm, modal,tabla,tipo){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",tabla);
    datos.append("datos",info);
    datos.append("tipo",tipo);
    this.http.post(this.globales.ruta+'php/giros/guardar_giro.php',datos)
    .subscribe((data:any)=>{
      formulario.reset();
      modal.hide();
      this.ActualizarVista();
      /*this.paisDefault = "";
      this.saveSwal.show();*/      
    });
  }

}
