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
  public Datos: any = [] = [];
  public id = this.route.snapshot.params["id"];
  public Switch:boolean;
  public Permisos: any = [] = [{}];
  public Cabecera:any = []=[];

  @ViewChild('FormPerfil') FormPerfil: any;
  @ViewChild('errorSwal') errorSwal: any;
  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  constructor(private http: HttpClient, private globales: Globales, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.http.get(this.globales.ruta + 'php/perfiles/detalle_perfil.php', {
      params: { id: this.id}
    }).subscribe((data: any) => {
      // console.log(data)
      this.Permisos=data;    
    });

    this.http.get(this.globales.ruta + 'php/perfiles/detalle_perfil_cabecera.php', {
      params: { id: this.id}
    }).subscribe((data: any) => {
      this.Cabecera=data;
    });
  }
  
  GuardarPerfil(formulario: NgForm) {
    let info = JSON.stringify(formulario.value);
    let modulos=JSON.stringify(this.Permisos);
    let datos = new FormData();
   
    datos.append("modulo", 'Perfil');
    datos.append("datos", info);
    datos.append("modulos", modulos);
    this.http.post(this.globales.ruta + 'php/perfiles/guardar_perfil.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Perfil Actualizado";
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

  CambiarVer(pos){
       
     if(this.Permisos[pos].Ver==='1'){
       this.Permisos[pos].Ver='0';
     }else if(this.Permisos[pos].Ver==='0'){
       this.Permisos[pos].Ver='1';
     }
   }
   CambiarCrear(pos){
         
      if(this.Permisos[pos].Crear==='1'){
        this.Permisos[pos].Crear='0';
      }else if(this.Permisos[pos].Crear==='0'){
        this.Permisos[pos].Crear='1';
      }
    }
    CambiarEliminar(pos){
         
      if(this.Permisos[pos].Eliminar==='1'){
        this.Permisos[pos].Eliminar='0';
      }else if(this.Permisos[pos].Eliminar==='0'){
        this.Permisos[pos].Eliminar='1';
      }
    }
    CambiarEditar(pos){
         
      if(this.Permisos[pos].Editar==='1'){
        this.Permisos[pos].Editar='0';
      }else if(this.Permisos[pos].Editar==='0'){
        this.Permisos[pos].Editar='1';
      }
    }    

}
