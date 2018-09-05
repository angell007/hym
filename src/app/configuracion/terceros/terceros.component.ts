import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.css']
})
export class TercerosComponent implements OnInit {
  public terceros : any[];
  public Departamentos : any[];
  public Municipios : any[];
  public Grupos : any[];
  public Documentos : any[];

  //variables de formulario
  public Identificacion : any[];
  public Nombre : any[];
  public Direccion : any[];
  public IdDepartamento : any[];
  public Departamento : any[];
  public IdMunicipio : any[];
  public Municipio : any[];
  public Telefono : any[];
  public Celular : any[];
  public Correo : any[];
  public TerceroDesde : any[];
  public Destacado : any[];
  public Credito : any[];
  public Cupo : any[];
  public IdGrupo : any[];
  public Grupo : any[];
  public Detalle : any[];
  public IdTipoDocumento : any[];
  public Documento : any[];
  public Barrio : any[];

  public boolNombre:boolean = false;
  public boolIdTercero:boolean = false;
  public boolDireccion:boolean = false;
  public boolBarrio:boolean = false;
  public boolTelefono:boolean = false;
  public boolCelular:boolean = false;
  public boolCorreo:boolean = false;
  public boolTerceroDesde:boolean = false;
  public boolDepartamento:boolean = false;
  public boolMunicipio:boolean = false;
  public boolCupo:boolean = false;
  public boolTipoDocumento:boolean = false;
  public boolDestacado:boolean = false;
  public boolCredito:boolean = false;

  public actualClienteDesde:string;
  public year:string;
  public month:string;

  //Valores por defecto
  tipoDocumentoDefault: string = "";
  departamentoDefault: string = "";
  municipioDefault: string = "";
  tipoGrupoDefault: string = "";
  destacadoDefault: string = "";
  creditoDefault: string = "";

  @ViewChild('ModalTercero') ModalTercero:any;
  @ViewChild('ModalVerTercero') ModalVerTercero:any;
  @ViewChild('ModalEditarTercero') ModalEditarTercero:any;
  @ViewChild('FormTercero') FormTercero:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('duplicateSwal') duplicateSwal:any;

  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  tercero = [];
  
  constructor(private http : HttpClient, private globales: Globales) { }

  ngOnInit() {
    this.ActualizarVista();
   
    this.year = new Date().getFullYear().toString().split('.').join("");
    this.month = (new Date().getMonth() + 1).toString();
    if (this.month.length == 1) this.actualClienteDesde = this.year.concat("-0".concat(this.month));
    else this.actualClienteDesde = this.year.concat("-".concat(this.month));

  }

  
  ActualizarVista(){
    this.http.get(this.globales.ruta+'php/terceros/lista_terceros.php').subscribe((data:any)=>{
      this.terceros= data;
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
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
    this.http.get(this.globales.ruta+'php/terceros/padre_hijo.php').subscribe((data:any)=>{
      this.Grupos = data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Tipo_Documento'}}).subscribe((data:any)=>{
      this.Documentos = data;
    });
    
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarTercero(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    console.log(info);
    datos.append("modulo",'Tercero');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .subscribe((data:any)=>{
      formulario.reset();
      this.ActualizarVista();  
      this.saveSwal.show();
    });
    
  }


  VerTercero(id, modal){
    this.http.get(this.globales.ruta+'php/terceros/detalle_tercero.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Nombre = data.Nombre;
      this.Direccion = data.Direccion;
      this.Departamento = data.Departamento;
      this.Municipio = data.Municipio;
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.TerceroDesde = data.Tercero_Desde;
      this.Destacado = data.Destacado;
      this.Credito = data.Credito;
      this.Cupo = data.Cupo;
      this.Grupo = data.Grupo;
      this.Detalle = data.Detalle;
      this.Barrio = data.Barrio;
      modal.show();
    });
  }

  EditarTercero(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Tercero', id:id}
    }).subscribe((data:any)=>{   
      console.log(data);         
      this.Identificacion = id;
      this.tercero = data;
      this.SeleccionarMunicipio(data.Id_Departamento, data.Id_Municipio);
      modal.show();
    });
  }

  EliminarTercero(id){
    let datos = new FormData();
    datos.append("modulo", 'Tercero');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }


  SeleccionarMunicipio(Departamento, Municipio){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
      this.IdMunicipio = Municipio;
    });
  }


  ////

  EstadoTercero(value, estado){
    let datos = new FormData();
    var titulo;
    var texto;
    datos.append("modulo", "Tercero");
    datos.append("id", value);
    switch(estado){
      case "Activo":{
        datos.append("estado", "Activo");
        titulo = "Tercero Inactivado";
        texto ="Se ha inactivado correctamente el tercero seleccionado";
        break;
      }
      case "Inactivo":{
        datos.append("estado", "Inactivo");
        titulo = "Perfil Activado";
        texto ="Se ha Activado correctamente el tercero seleccionado";
        break;
      }
    }
    
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = titulo;
      this.confirmacionSwal.text = texto;
      this.confirmacionSwal.type = "success";
      this.confirmacionSwal.show();    
      this.terceros= data;  
    });
  }

}
