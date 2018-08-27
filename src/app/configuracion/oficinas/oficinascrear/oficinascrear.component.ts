import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oficinascrear',
  templateUrl: './oficinascrear.component.html',
  styleUrls: ['./oficinascrear.component.scss']
})
export class OficinascrearComponent implements OnInit {
  Departamentos: any;
  Municipios: any;

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private globales: Globales, private router: Router) { }


  ngOnInit() {

    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Departamento'}}).subscribe((data:any)=>{
      this.Departamentos= data;
    });
  }

  Municipios_Departamento(Departamento){
    this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
      this.Municipios= data;
    });
  }

  GuardarOficina(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    
    let datos = new FormData();
     //this.OcultarFormulario(modal);
     console.log(info);
     datos.append("modulo",'Oficina');
     datos.append("datos",info);

     this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
     .subscribe((data:any)=>{  
       formulario.reset();
       this.confirmacionSwal.title = "Creación Oficina";
      this.confirmacionSwal.text = "Oficina creada con éxito";
      this.confirmacionSwal.type = "success";
       this.confirmacionSwal.show();
       this.router.navigate(['oficinas']);
     });
   }
 
}
