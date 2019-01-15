import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../shared/globales/globales';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-remitente',
  templateUrl: './remitente.component.html',
  styleUrls: ['./remitente.component.scss']
})
export class RemitenteComponent implements OnInit {
  Remitente=[];
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();

  @ViewChild('ModalEditarRemitente') ModalEditarRemitente:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;  
  RemitenteEditar:any={};

  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
     this.actualizarVista();
  }

  actualizarVista(){
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Transferencia_Remitente'}}).subscribe((data:any)=>{
      this.Remitente= data;
    });
   
  }

  EditarRemitente (id){
    
    this.http.get(this.globales.ruta +'php/genericos/detalle.php',{
      params:{modulo:'Transferencia_Remitente', id:id}
    }).subscribe((data:any)=>{
      this.RemitenteEditar = data;
      this.ModalEditarRemitente.show();
    });
  }

  GuardarRemitente(formulario: NgForm, modal){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    datos.append("modulo",'Transferencia_Remitente');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .subscribe((data:any)=>{
      formulario.reset();
      this.saveSwal.show();
      modal.hide();
      this.actualizarVista();
    });
  }

  EliminarRemitente(id){
    let datos = new FormData();
    datos.append("modulo", 'Transferencia_Remitente');
    datos.append("id", id); 
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.actualizarVista();
    });
  }

}
