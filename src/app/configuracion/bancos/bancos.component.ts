import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';
import { log } from 'util';
import { SwalService } from '../../shared/services/swal/swal.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: ['./bancos.component.css']
})
export class BancosComponent implements OnInit {
  // public bancos : any = [];
  // public Paises:any = [];
  // public PaisesMoneda:any = [];
  // public Monedas:any = [];

  // //variables de formulario
  // public Identificacion : any = [];
 

  // public boolNombre:boolean = false;
  // public boolId:boolean = false;
  // public boolPais:boolean = false;

  // //Valores por defecto
  // paisDefault: string = "";

  // rowsFilter = [];
  // tempFilter = [];

  // //Banco Model
  // public BancoModel:any = {
  //   Nombre: '',
  //   Id_Moneda: '',
  //   Id_Pais: '',
  //   Identificador: '',
  //   Apodo: '',
  //   Detalle: '',
  //   Estado: 'Activo',

  //   //opciones bancos de colombia
  //   Comision_Consignacion_Nacional: '',
  //   Comision_Cuatro_Mil: '',
  //   Comision_Consignacion_Local: '',
  //   Maximo_Consignacion_Local: '',

  //   //opciones bancos de venezuela
  //   Comision_Otros_Bancos: '',
  //   Comision_Mayor_Valor: '',
  //   Mayor_Valor: '',
  //   Maximo_Transferencia_Otros_Bancos: ''
  // };

  // @ViewChild('ModalBanco') ModalBanco:any;
  // @ViewChild('ModalVerBanco') ModalVerBanco:any;
  // @ViewChild('ModalEditarBanco') ModalEditarBanco:any;
  // @ViewChild('FormBanco') FormBanco:any;
  // @ViewChild('errorSwal') errorSwal:any;
  // @ViewChild('saveSwal') saveSwal:any;
  // @ViewChild('deleteSwal') deleteSwal:any;
  // @ViewChild('confirmacionSwal') confirmacionSwal: any;

  // dtOptions: DataTables.Settings = {};
  // dtTrigger = new Subject();

  // Colombia = false;
  // Venezuela = false;
  // infoBanco:any = {};

  constructor() {   }

  ngOnInit() {
    //this.ActualizarVista();
    /*this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Pais'}}).subscribe((data:any)=>{
      this.Paises= data;
    });*/
  }

  ngAfterViewInit(){     
    // setTimeout(() => {
    //   //this.AsignarMonedas();
    //   this.AsignarPaises();
    // }, 2000);  
    
  }
 
  // ActualizarVista()
  // {
  //   this.http.get(this.globales.ruta+'php/bancos/lista_bancos.php').subscribe((data:any)=>{
  //     this.bancos= data;    
  //     this.dtTrigger.next();
  //   });

  //   this.dtOptions = {
  //     pagingType: 'full_numbers',
  //     pageLength: 10,
  //     dom: 'Bfrtip',
  //     responsive: true,
  //     /* below is the relevant part, e.g. translated to spanish */ 
  //     language: {
  //       processing: "Procesando...",
  //       search: "Buscar:",
  //       lengthMenu: "Mostrar _MENU_ &eacute;l&eacute;ments",
  //       info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
  //       infoEmpty: "Mostrando ningún elemento.",
  //       infoFiltered: "(filtrado _MAX_ elementos total)",
  //       infoPostFix: "",
  //       loadingRecords: "Cargando registros...",
  //       zeroRecords: "No se encontraron registros",
  //       emptyTable: "No hay datos disponibles en la tabla",
  //       paginate: {
  //         first: "<<",
  //         previous: "<",
  //         next: ">",
  //         last: ">>"
  //       },
  //       aria: {
  //         sortAscending: ": Activar para ordenar la tabla en orden ascendente",
  //         sortDescending: ": Activar para ordenar la tabla en orden descendente"
  //       }
  //     }
  //   }; 
  // }

  // AsignarMonedas(){      
  //   this.Monedas = this.globales.Monedas;
  // }

  // AsignarPaises(){      
  //   this.Paises = this.globales.Paises;
  // }

  // GuardarBanco(formulario: NgForm, modal){
  //   console.log(this.BancoModel);
    
  //   let info = JSON.stringify(formulario.value);
  //   let datos = new FormData();
  //   datos.append("modulo",'Banco');
  //   datos.append("datos",info);
  //   this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
  //   .catch(error => { 
  //     console.error('An error occurred:', error.error);
  //     this.errorSwal.show();
  //     return this.handleError(error);
  //   })
  //   .subscribe((data:any)=>{
  //     formulario.reset();
  //     this.ActualizarVista();      
  //     this.paisDefault = "";
  //     this.saveSwal.show();
  //     this.Colombia = false;
  //     this.Venezuela = false;
  //     modal.hide();
  //   });
  // }

  // handleError(error: Response) {
  //   return Observable.throw(error);
  // }

  // VerBanco(id, modal){
  //   this.http.get(this.globales.ruta+'php/bancos/detalle_banco.php',{
  //     params:{id:id}
  //   }).subscribe((data:any)=>{
  //     this.Identificacion = id;
  //     modal.show();
  //   });
  // }

  // EliminarBanco(id){
  //   let datos = new FormData();
  //   datos.append("modulo", 'Banco');
  //   datos.append("id", id); 
  //   this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
  //     this.deleteSwal.show();
  //     this.ActualizarVista();
  //   });
  // }

  // EditarBanco(id){
    
  //   this.http.get(this.globales.ruta +'php/genericos/detalle.php',{
  //     params:{modulo:'Banco', id:id}
  //   }).subscribe((data:any)=>{
  //     this.Identificacion = id;
  //     this.infoBanco = data;
  //     this.ModalEditarBanco.show();
  //     this.SeleccionarPais(data.Id_Pais)
  //   });
  // }
 
  // EstadoBanco(value, estado){
  //   let datos = new FormData();
  //   var titulo;
  //   var texto;
  //   datos.append("modulo", "Banco");
  //   datos.append("id", value);
  //   switch(estado){
  //     case "Activo":{
  //       datos.append("estado", "Activo");
  //       titulo = "Banco Inactivada";
  //       texto ="Se ha inactivado correctamente el Banco seleccionado";
  //       break;
  //     }
  //     case "Inactivo":{
  //       datos.append("estado", "Inactivo");
  //       titulo = "Banco Activada";
  //       texto ="Se ha Activado correctamente el Banco seleccionado";
  //       break;
  //     }
  //   }
    
  //   this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos).subscribe((data: any) => {
  //     this.confirmacionSwal.title = titulo;
  //     this.confirmacionSwal.text = texto;
  //     this.confirmacionSwal.type = "success";
  //     this.confirmacionSwal.show();    
  //     this.bancos= data;  
  //   });
  // }

  // SeleccionarPais(Pais){
  //   //1 para colombia
  //   //2 para venezuela

  //   switch(Pais){
  //     case "1":{
  //       this.Colombia = true;
  //       this.Venezuela = false;
  //       break;
  //     }
  //     case "2":{
  //       this.Colombia = false;
  //       this.Venezuela = true;
  //       break;
  //     }
  //     default:{
  //       this.Colombia = false;
  //       this.Venezuela = false;
  //     }
  //   }
    
  // }

  // SeleccionarPaisesPorMoneda(idMoneda){
    
  //   if(idMoneda != ''){
  //     this.PaisesMoneda = [];

  //     this.Paises.forEach(obj => {
  //       if(obj.Id_Moneda == idMoneda){
  //         this.PaisesMoneda.push(obj);
  //       }        
  //     });     
      
  //   }else{
  //     this.PaisesMoneda = [];
  //   }    
  // }

  // CargarMonedasPais(){
  //   if (this.BancoModel.Id_Pais == '') {
  //     this.Monedas = [];
  //     //this.swalService.ShowMessage(['warning', 'Alerta', 'No se encontraron moneddas asociadas al pais seleccionado!']);
  //     this.swalService.ShowMessage(['warning', 'Alerta', 'Debe escoger un país para cargar las monedas disponibles!']);
  //     return;
  //   }

  //   this.SeleccionarPais(this.BancoModel.Id_Pais);

  //   let p = {id_pais:this.BancoModel.Id_Pais};
  //   this.monedaService.getMonedasPais(p).subscribe((data:any) => {
  //     if (data.codigo == 'success') {

  //       this.Monedas = data.query_data;        
  //     }else{

  //       this.swalService.ShowMessage(data);  
  //       this.Monedas = [];
  //       this.BancoModel.Id_Moneda = '';
  //     }
      
  //   });
  // }

}
