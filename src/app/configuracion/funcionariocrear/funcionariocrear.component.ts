import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { CommonModule } from '@angular/common';
import { Globales } from '../../shared/globales/globales';
import { FormWizardModule } from 'angular2-wizard/dist';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-funcionariocrear',
  templateUrl: './funcionariocrear.component.html',
  styleUrls: ['./funcionariocrear.component.css']
})
export class FuncionariocrearComponent implements OnInit {
 // public funcionario: any [];
 /* public Id_Funcionario: any [];
  public Punto_Dispensacion: any [];
  public Suspendido: any [];
  public Id_Perfil: any [];
  public Perfil: any [];
  
  public cargo:any[];
  public Procesos: any[]; 
  public Proceso: any[];*/
  public Grupos : any[];
  public Dependencias : any[];
  public Cargos: any[];
  public Fotos: any;

  public funcionario = 
    {
      Foto : '',
      Identificacion_Funcionario : '',
      Nombres : '',
      Apellidos : '',
      Fecha_Nacimiento: '',
      Lugar_Nacimiento : '',
      PesoTipo_Sangre_Regular : '',
      Telefono : '',
      Celular : '',
      Correo : '',
      Direccion_Residencia : '',
      Estado_Civil : '',
      Hijos : '',
      Grado_Instruccion : '',
      Titulo_Estudio : '',
      Id_Grupo : '',
      Id_Dependencia : '',
      Id_Cargo : '',
      Salario : '',
      Fecha_Ingreso : '',
      //Tipo_Turno : '',
     // Id_Turno : '',
      Talla_Camisa : '',
      Talla_Pantalon : '',
      Talla_Botas : ''
    };

  public contacto_emergencia = 
    {
      Nombre : '',
      Parentesco : '',
      Celular : '',
      Telefono: '',
      Direccion : ''
    };

  public experiencia = [
    {
      Nombre_Empresa : '',
      Cargo : '',
      Jefe : '',
      Ingreso_Empresa: '',
      Retiro_Empresa : '',
      Telefono : '',
      Labores : ''
    },
    {
      Nombre_Empresa : '',
      Cargo : '',
      Jefe : '',
      Ingreso_Empresa: '',
      Retiro_Empresa : '',
      Telefono : '',
      Labores : ''
    }
  ];

  public referencias = [
    {
      Nombres : '',
      Profesion : '',
      Empresa : '',
      Telefono: ''
    } ,
    {
      Nombres : '',
      Profesion : '',
      Empresa : '',
      Telefono: ''
    }
  ];

  constructor(private http : HttpClient,private globales: Globales, private route: ActivatedRoute, private router: Router) { }

  CargaFoto(event){
    let fot = document.getElementById("foto_visual") as HTMLImageElement;
    
    if (event.target.files.length === 1) { 
     
        this.Fotos = event.target.files[0];
    
      let url = URL.createObjectURL(event.target.files[0]);
      fot.src=url;
    } 
  }

  @ViewChild('NuevoFuncionario') NuevoFuncionario:any; 
  @ViewChild('FormFuncionarioEditar') FormFuncionarioEditar:any; 
  @ViewChild('modalFuncionario') modalFuncionario:any;
  @ViewChild('modalFuncionarioEditar') modalFuncionarioEditar:any; 
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('confirmacionSwal') confirmacionSwal:any;

  ngOnInit() {
   /* this.http.get(this.globales.ruta+'php/lista_generales.php',{params: {modulo:'Funcionario'}}).subscribe((data:any)=>{
      this.funcionario=data;
  })
  this.http.get(this.globales.ruta+'php/lista_generales.php',{params: {modulo:'Funcionario'}}).subscribe((data:any)=>{
    this.Id_Funcionario=data;
    
  });
  this.http.get(this.globales.ruta+'php/lista_generales.php',{params: {modulo:'Perfil'}}).subscribe((data:any)=>{
    this.Perfil=data;
  })

  this.http.get(this.globales.ruta+'php/lista_generales.php',{params: {modulo:'Cargo'}}).subscribe((data:any)=>{
  this.Cargos=data;
})*/
this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Grupo'}}).subscribe((data:any)=>{
  this.Grupos= data;
});
}

Dependencia_Grupo(Grupo){
  this.http.get(this.globales.ruta+'php/funcionarios/dependencias_grupo.php',{ params: { id: Grupo}}).subscribe((data:any)=>{
    this.Dependencias= data;
  });
}

/*
AutoSeleccionarDependencia(Grupo, Dependencia){
  this.http.get(this.globales.ruta+'php/genericos/municipios_departamento.php',{ params: { id: Departamento}}).subscribe((data:any)=>{
    this.Municipios= data;
    this.Municipio = Municipio;
  });
}
*/
Cargo_Dependencia(Dependencia){
  this.http.get(this.globales.ruta+'php/funcionarios/cargos_dependencia.php',{ params: { id: Dependencia}}).subscribe((data:any)=>{
    this.Cargos= data;
  });
}

GuardarFuncionario(formulario: NgForm){ 
   let info = JSON.stringify(formulario.value);
   let func = JSON.stringify(this.funcionario);
   let conemer = JSON.stringify(this.contacto_emergencia);
   let exper = JSON.stringify(this.experiencia);
   let refe = JSON.stringify(this.referencias);
   let datos = new FormData();
   datos.append("modulo",'Funcionario');
   datos.append("datos",info);
   datos.append("funcionario",func);
   datos.append("contacto_emergencia",conemer);
   datos.append("experiencia",exper);
   datos.append("referencias",refe);
   datos.append('Foto', this.Fotos );
    this.http.post(this.globales.ruta + 'php/funcionarios/funcionario_guardar2.php',datos).subscribe((data:any)=>{
    this.confirmacionSwal.title="Guardado Correctamente";
    this.confirmacionSwal.text= data.mensaje;
    this.confirmacionSwal.type= data.tipo;
    this.confirmacionSwal.show();
    this.Fotos = [];
    formulario.reset();
    this.VerPantallaLista();
   }); 
 }
 VerPantallaLista(){
  this.router.navigate(['/funcionarios']);    
}
/*
 onStep4Next(a){
   alert(a);
 }
*/
EliminarFuncionario(id){    
    let datos=new FormData();
    datos.append("modulo", 'funcionario');
    datos.append ("id",id);
    this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos ).subscribe((data:any)=>{
      this.funcionario=data; 
      this.deleteSwal.show();
    });
  }

  EditarFuncionario(id){
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php',{
      params: { modulo: 'funcionario', id: id}     
    }).subscribe((data: any) => {
      this.funcionario= data.Id_Funcionario;
      this.modalFuncionarioEditar.show();
    });    
  }

  SuspenderFuncionario(id){
    this.http.get(this.globales.ruta + 'php/genericos/suspender.php',{
      params: { modulo: 'Funcionario', id: id}     
    }).subscribe((data: any) => {
      
    });
  }
}

