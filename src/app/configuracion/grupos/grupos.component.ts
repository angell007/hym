import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {

  public grupos : any = [];

  //variables de formulario
  public Identificacion : any = [];
  public Nombre : any = [];
  public Detalle : any = [];
  public Padre : any = [];

  public boolNombre:boolean = false;

  //Valores por defecto
  padreDefault: string = "Ninguno";


  @ViewChild('ModalGrupo') ModalGrupo:any;
  @ViewChild('ModalVerGrupo') ModalVerGrupo:any;
  @ViewChild('ModalEditarGrupo') ModalEditarGrupo:any;
  @ViewChild('FormGrupo') FormGrupo:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;

  
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  constructor(private http : HttpClient,private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.OcultarFormularios();
    }
  }

  OcultarFormularios()
  {
    this.InicializarBool();
    this.OcultarFormulario(this.ModalGrupo);
    this.OcultarFormulario(this.ModalVerGrupo);
    this.OcultarFormulario(this.ModalEditarGrupo);
  }

  InicializarBool()
  {
    this.boolNombre = false;
  }

  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/grupos/lista_grupos.php').subscribe((data:any)=>{
      this.grupos= data;  
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
        infoEmpty: "Mostrando ning??n elemento.",
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

  GuardarGrupo(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();        
    datos.append("modulo",'Grupo');
    datos.append("datos",info);
    this.OcultarFormulario(modal);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();
      this.InicializarBool();
      this.saveSwal.show();
      this.padreDefault = "Ninguno";
    });
    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerGrupo(id, modal){
    this.http.get(this.globales.ruta+'php/grupos/detalle_grupo.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      this.Padre = data.Padre;
      modal.show();
    });
  }

  EditarGrupo(id, modal){
    this.InicializarBool();
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Grupo', id:id}
    }).subscribe((data:any)=>{      
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Detalle = data.Detalle;
      this.Padre = data.Padre;
      modal.show();
    });
  }

  EliminarGrupo(id){
    let datos = new FormData();
    datos.append("modulo", 'Grupo');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }

  OcultarFormulario(modal)
  {
    this.Identificacion = null;
    this.Nombre = null;
    this.Detalle = null;
    this.Padre = null;
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }
  
}
