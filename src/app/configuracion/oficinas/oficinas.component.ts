import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-oficinas',
  templateUrl: './oficinas.component.html',
  styleUrls: ['./oficinas.component.css']
})

export class OficinasComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  public oficinas : any = [];
  
  constructor(private http: HttpClient,private globales: Globales) { }

  ngOnInit() {

    this.http.get(this.globales.ruta+'php/oficinas/lista_oficinas.php').subscribe((data:any)=>{
      this.oficinas= data;
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
  }

  EstadoOficina(value, estado){
    let datos = new FormData();
    var titulo;
    var texto;
    datos.append("id", value);
    switch(estado){
      case "Activo":{
        datos.append("estado", "Activo");
        titulo = "Oficina Inactivada";
        texto ="Se ha inactivado correctamente la oficina seleccionada";
        break;
      }
      case "Inactivo":{
        datos.append("estado", "Inactivo");
        titulo = "Oficina Activada";
        texto ="Se ha Activado correctamente la oficina seleccionada";
        break;
      }
    }
    
    this.http.post(this.globales.ruta + 'php/oficinas/anular_oficina.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = titulo;
      this.confirmacionSwal.text = texto;
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();    
      this.oficinas= data;  
    });
  }

  activarOficina(value){
    alert(value);
  }


}
