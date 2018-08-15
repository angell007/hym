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
  public funcionario : any[] = [];
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
  public Experiencia : any[] = [{
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
  public Grupos : any[] = [];
  public Dependencias : any[] = [];
  public Cargos : any[] = [];
  public Grupo : any = [];
  public Dependencia : any = [];
  public Cargo : any = [];  

  constructor(private http : HttpClient,private globales: Globales, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {        
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Grupo'}}).subscribe((data:any)=>{
      this.Grupos= data;
      console.log(this.Grupos);      
      this.http.get(this.globales.ruta + 'php/funcionarios/ver_funcionario.php',{
        params: { modulo: 'Funcionario', id: this.id}     
      }).subscribe((data: any) => {
        console.log(data);        
        this.funcionario = data.Funcionario;
        console.log(this.funcionario);
        
        this.Cargo=data.Cargo;
        this.Grupo=data.Grupo;
        this.Dependencia=data.Dependencia;
        if(data.Contacto_Emergencia)
        {
          this.ContactoEmergencia = data.Contacto_Emergencia;
        }
        
        for(let i = 0; i < data.Experiencia_Laboral.length; ++i)
        {
          this.Experiencia[i] = data.Experiencia_Laboral[i];
        }

        for(let i = 0; i < data.Referencia_Personal.length; ++i)
        {
          this.Referencias[i] = data.Referencia_Personal[i];
        }
        
        this.Grupo = data.Id_Grupo;
        console.log(this.Grupo);        
        if(data.Imagen != '')
        {
          this.ExisteFoto = false;
        }
        else
        {
          this.ExisteFoto = true;
        }
        this.AutoSeleccionarDependencia(data.Id_Grupo, data.Id_Dependencia, data.Id_Cargo);
      });  
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
    console.log("id grupo funcionario");    
    console.log(grupo);    
    this.http.get(this.globales.ruta+'php/funcionarios/dependencias_grupo.php',{ params: { id: grupo}}).subscribe((data:any)=>{
      console.log(data);      
      this.Dependencias= data;
    });
  }
  DependenciaCargo(dependencia){
    this.http.get(this.globales.ruta+'php/funcionarios/cargos_dependencia.php',{ params: { id: dependencia}}).subscribe((data:any)=>{
      this.Cargos= data;
    });
  }

  GuardarFuncionario(funcionario:NgForm, contactoEmergencia:NgForm, experienciaLaboral1:NgForm, experienciaLaboral2:NgForm, referenciasPersonales1:NgForm, referenciasPersonales2:NgForm)
  {
    
    
    let dummyFuncionario = JSON.stringify(funcionario.value);
    let dummyContactoEmergencia = JSON.stringify(contactoEmergencia.value);    
    let dummyExperienciaLaboral = JSON.stringify([experienciaLaboral1.value, experienciaLaboral2.value]);
    let dummyReferenciaPersonal = JSON.stringify([referenciasPersonales1.value, referenciasPersonales2.value]);
    let datos = new FormData();
    datos.append("funcionario",dummyFuncionario);
    datos.append("contacto_emergencia",dummyContactoEmergencia);
    datos.append("experiencia",dummyExperienciaLaboral);
    datos.append("referencias",dummyReferenciaPersonal);
    datos.append('Foto', this.Fotos);   
    this.http.post(this.globales.ruta + 'php/funcionarios/funcionario_editar.php',datos).subscribe((data:any)=>{
      console.log(data);
      this.VerPantallaLista();
    });  
  }
  VerPantallaLista(){
    this.router.navigate(['/funcionarios']);    
  }

}

