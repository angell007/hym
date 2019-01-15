import { Component, OnInit, ViewChild } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormWizardModule } from 'angular2-wizard/dist';
import { Router } from '@angular/router';

@Component({
  selector: 'app-funcionariover',
  templateUrl: './funcionariover.component.html',
  styleUrls: ['./funcionariover.component.scss']
})
export class FuncionarioverComponent implements OnInit {

  public id = this.route.snapshot.params["id"];
  public funcionario : any = [] = [];
  public Fotos: any;
  public ExisteFoto: boolean;
  public ContactoEmergencia = 
  {
    Nombre : '',
    Identificacion_Funcionario_Contacto_Emergencia: '',
    Parentesco : '',
    Celular : '',
    Telefono: '',
    Direccion : ''
  };
  public Experiencia : any = [] = [{
    id_Funcionario_Experiencia_Laboral : '',
    Nombre_Empresa : '',
    Cargo : '',
    Jefe : '',
    Ingreso_Empresa: '',
    Retiro_Empresa : '',
    Telefono : '',
    Labores : ''
  },
  {
    id_Funcionario_Experiencia_Laboral : '',
    Nombre_Empresa : '',
    Cargo : '',
    Jefe : '',
    Ingreso_Empresa: '',
    Retiro_Empresa : '',
    Telefono : '',
    Labores : ''
  }];
  public Referencias = [
    {
      id_Funcionario_Referencias : '',
      Nombres : '',
      Profesion : '',
      Empresa : '',
      Telefono: ''
    } ,
    {
      id_Funcionario_Referencias : '',
      Nombres : '',
      Profesion : '',
      Empresa : '',
      Telefono: ''
    }
  ];
  public Grupos : any = [] = [];
  public Dependencias : any = [] = [];
  public Cargos : any = [] = [];
  public Grupo : any = [];
  public Dependencia : any = [];
  public Cargo : any = [];    

  constructor(private http : HttpClient,private globales: Globales, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() { 
    this.http.get(this.globales.ruta + 'php/funcionarios/ver_funcionario.php',{
      params: { modulo: 'Funcionario', id: this.id}     
    }).subscribe((data: any) => {
      
      this.funcionario = data.Funcionario;
      this.Cargo=data.Cargo;
      this.Grupo=data.Grupo;
      this.Dependencia=data.Dependencia;
      this.ContactoEmergencia = data.Contacto_Emergencia;
      for(let i = 0; i < data.Experiencia_Laboral.length; ++i)
      {               
        this.Experiencia[i] = data.Experiencia_Laboral[i];
        
      }

      for(let i = 0; i < data.Referencia_Personal.length; ++i)
      {
        this.Referencias[i] = data.Referencia_Personal[i];
      }
      
    
    });

  }

  CargaFoto(event){
    let fot = document.getElementById("foto_visual") as HTMLImageElement;   
    if (event.target.files.length === 1) {     
      this.Fotos = event.target.files[0];    
      let url = URL.createObjectURL(event.target.files[0]);
      fot.src=url;
      this.ExisteFoto = false;
    } 
  }

  AutoSeleccionarDependencia(grupo, dependencia, cargo)
  {
    this.http.get(this.globales.ruta+'php/funcionarios/dependencias_grupo.php',{ params: { id: grupo}}).subscribe((data:any)=>{
      this.Dependencias= data;
      this.Dependencia = dependencia;
      this.AutoSeleccionarCargo(dependencia, cargo);
    });
  }

  AutoSeleccionarCargo(dependencia, cargo)
  {
    this.http.get(this.globales.ruta+'php/funcionarios/cargos_dependencia.php',{ params: { id: dependencia}}).subscribe((data:any)=>{
      this.Cargos= data;     
      this.Cargo = cargo;
    });
  }

  GrupoDependencia(grupo){
      
      
    this.http.get(this.globales.ruta+'php/funcionarios/dependencias_grupo.php',{ params: { id: grupo}}).subscribe((data:any)=>{
      
      this.Dependencias= data;
    });
  }
  DependenciaCargo(dependencia){
    this.http.get(this.globales.ruta+'php/funcionarios/cargos_dependencia.php',{ params: { id: dependencia}}).subscribe((data:any)=>{
      this.Cargos= data;
    });
  }

  VerPantallaLista(){
    this.router.navigate(['/funcionarios']);    
  }

}

