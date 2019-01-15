import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent implements OnInit {
  public bancos : any = [];
  public Paises : any = [];

  //variables de formulario
  public Identificacion : any = [];
 

  public boolNombre:boolean = false;
  public boolId:boolean = false;
  public boolPais:boolean = false;

  //Valores por defecto
  paisDefault: string = "";

  rowsFilter = [];
  tempFilter = [];

  @ViewChild('ModalBanco') ModalBanco:any;
  @ViewChild('ModalVerBanco') ModalVerBanco:any;
  @ViewChild('ModalEditarBanco') ModalEditarBanco:any;
  @ViewChild('FormBanco') FormBanco:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  Colombia = false;
  Venezuela = false;
  infoBanco:any = {};

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });
  }
 
  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/bancos/lista_bancos.php').subscribe((data:any)=>{
      this.bancos= data;    
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

  GuardarBanco(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Banco');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();      
      this.paisDefault = "";
      this.saveSwal.show();
      this.Colombia = false;
      this.Venezuela = false;
      modal.hide();
    });
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerBanco(id, modal){
    this.http.get(this.globales.ruta+'php/bancos/detalle_banco.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      modal.show();
    });
  }

  EliminarBanco(id){
    let datos = new FormData();
    datos.append("modulo", 'Banco');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  EditarBanco(id){
    
    this.http.get(this.globales.ruta +'php/genericos/detalle.php',{
      params:{modulo:'Banco', id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.infoBanco = data;
      this.ModalEditarBanco.show();
      this.SeleccionarPais(data.Id_Pais)
    });
  }
 
  EstadoBanco(value, estado){
    let datos = new FormData();
    var titulo;
    var texto;
    datos.append("modulo", "Banco");
    datos.append("id", value);
    switch(estado){
      case "Activo":{
        datos.append("estado", "Activo");
        titulo = "Banco Inactivada";
        texto ="Se ha inactivado correctamente el Banco seleccionado";
        break;
      }
      case "Inactivo":{
        datos.append("estado", "Inactivo");
        titulo = "Banco Activada";
        texto ="Se ha Activado correctamente el Banco seleccionado";
        break;
      }
    }
    
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = titulo;
      this.confirmacionSwal.text = texto;
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();    
      this.bancos= data;  
    });
  }

  SeleccionarPais(Pais){
    //1 para colombia
    //2 para venezuela

    switch(Pais){
      case "1":{
        this.Colombia = true;
        this.Venezuela = false;
        break;
      }
      case "2":{
        this.Colombia = false;
        this.Venezuela = true;
        break;
      }
      default:{
        this.Colombia = false;
        this.Venezuela = false;
      }
    }
    
  }

}
