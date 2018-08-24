import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfilcrear',
  templateUrl: './perfilcrear.component.html',
  styleUrls: ['./perfilcrear.component.scss']
})
export class PerfilcrearComponent implements OnInit {

  @ViewChild('FormPerfil') FormPerfil:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  constructor(private http : HttpClient, private globales : Globales, private router: Router) { }

  ngOnInit() {
  }

  GuardarPerfil(formulario: NgForm){
    console.log(formulario.value);
    
   let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    console.log(info);    
    datos.append("modulo",'Perfil');
    datos.append("datos",info);
    
    //console.log(datos);
    this.http.post(this.globales.ruta+'php/perfiles/guardar_perfil.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{
      //formulario.reset();
     // this.customReset(); //Necesario para corregir ciertos bugs con los checkboxes
      //this.transfVerMod = 0;
      //this.transfEditarMod = 0;
     // this.perfiles= data;
     //this.InicializarBool();     
     this.confirmacionSwal.title = "Perfil creado";
     this.confirmacionSwal.text = data.mensaje;
     this.confirmacionSwal.type = data.tipo;
     this.confirmacionSwal.show();
     this.VerPantallaLista();
     formulario.reset();
    });
  }
  VerPantallaLista() {
    this.router.navigate(['/perfiles']);
  }
  handleError(error: Response) {
    return Observable.throw(error);
  }
  /*customReset()
  {
    this.nombreVal.reset();
    this.detallesVal.reset();
  }
  /*InicializarBool()
  {
    this.boolNombre = false;
    this.transfVerVal = false;
    this.transfEditarVal = false;
    this.transfEliminarVal = false;
    this.traslVerVal = false;
    this.traslEditarVal = false;
    this.traslEliminarVal = false;
    this.cajasVerVal = false;
    this.cajasEditarVal = false;
    this.cajasEliminarVal = false;
    this.girosVerVal = false;
    this.girosEditarVal = false;
    this.girosEliminarVal = false;
    this.corrVerVal = false;
    this.corrEditarVal = false;
    this.corrEliminarVal = false;
    this.servVerVal = false;
    this.servEditarVal = false;
    this.servEliminarVal = false;
    this.confVerVal = false;
    this.confEditarVal = false;
    this.confEliminarVal = false;
    this.indiVerVal = false;
    this.indiEditarVal = false;
    this.indiEliminarVal = false;
    this.reporVerVal = false;
    this.reporEditarVal = false;
    this.reporEliminarVal = false;
  }*/


}
