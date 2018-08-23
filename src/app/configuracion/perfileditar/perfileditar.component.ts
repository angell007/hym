import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfileditar',
  templateUrl: './perfileditar.component.html',
  styleUrls: ['./perfileditar.component.scss']
})
export class PerfileditarComponent implements OnInit {
  public Datos: any[] = [];
  public id = this.route.snapshot.params["id"];
  public Switch:boolean;


  @ViewChild('FormPerfil') FormPerfil: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  constructor(private http: HttpClient, private globales: Globales, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'Perfil', id: this.id }
    }).subscribe((data: any) => {
      
      this.Datos = data;
      console.log(this.Datos);


    });
  }
  GuardarPerfil(formulario: NgForm) {
    console.log(formulario.value);

    /*let info = JSON.stringify(formulario.value);
     let datos = new FormData();
     console.log(info);    
     datos.append("modulo",'Perfil');
     datos.append("datos",info);
     
     //console.log(datos);
     this.http.post(this.globales.ruta+'php/perfiles/actualizar_perfil.php',datos)
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
     });*/
  }
  VerPantallaLista() {
    this.router.navigate(['/perfiles']);
  }
  handleError(error: Response) {
    return Observable.throw(error);
  }

}
