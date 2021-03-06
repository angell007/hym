import { Component, OnInit, ViewChild } from '@angular/core';
import { Globales } from '../../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { FormWizardModule } from 'angular2-wizard/dist';
import { Router } from '@angular/router';


@Component({
  selector: 'app-funcionarioeditar',
  templateUrl: './funcionarioeditar.component.html',
  styleUrls: ['./funcionarioeditar.component.scss']
})
export class FuncionarioeditarComponent implements OnInit {

  public id = this.route.snapshot.params["id"];
  public funcionario: any = [] = [];
  public Fotos: any;
  public ExisteFoto: boolean;
  public ContactoEmergencia =
    {
      Nombre: '',
      Identificacion_Funcionario_Contacto_Emergencia: '',
      Parentesco: '',
      Celular: '',
      Telefono: '',
      Direccion: ''
    };
  public Experiencia: any = [] = [{
    id_Funcionario_Experiencia_Laboral: '',
    Nombre_Empresa: '',
    Cargo: '',
    Jefe: '',
    Ingreso_Empresa: '',
    Retiro_Empresa: '',
    Telefono: '',
    Labores: ''
  },
  {
    id_Funcionario_Experiencia_Laboral: '',
    Nombre_Empresa: '',
    Cargo: '',
    Jefe: '',
    Ingreso_Empresa: '',
    Retiro_Empresa: '',
    Telefono: '',
    Labores: ''
  }];
  public Referencias = [
    {
      id_Funcionario_Referencias: '',
      Nombres: '',
      Profesion: '',
      Empresa: '',
      Telefono: ''
    },
    {
      id_Funcionario_Referencias: '',
      Nombres: '',
      Profesion: '',
      Empresa: '',
      Telefono: ''
    }
  ];
  public Grupos: any = [] = [];
  public Dependencias: any = [] = [];
  public Cargos: any = [] = [];
  public Grupo: any = null;
  public Dependencia: any = null;
  public Cargo: any = null;
  public Permisos: any = [] = [];
  public Longitud = 0;
  public Id_Perfil='';
  public Perfiles:any = []=[];

  public boolNombresIP:boolean = false;
  public boolApellidosIP:boolean = false;
  public boolNacimientoIP:boolean = false;
  public boolLugarNacimientoIP:boolean = false;
  public boolTipoSangreIP:boolean = false;
  public boolTelefonoIP:boolean = false;
  public boolCelularIP:boolean = false;
  public boolCorreoIP:boolean = false;
  public boolDireccionIP:boolean = false;
  public boolEstadoCivilIP:boolean = false;
  public boolHijosIP:boolean = false;
  public boolGradoIP:boolean = false;
  public boolTituloIP:boolean = false;
  public boolGrupoIP:boolean = false;
  public boolDependenciaIP:boolean = false;
  public boolCargoIP:boolean = false;
  public boolSalarioIP:boolean = false;
  public boolIngresoIP:boolean = false;
  public boolCamisaIP:boolean = false;
  public boolPantalonIP:boolean = false;
  public boolBotasIP:boolean = false;
  public boolNombreCE:boolean = false;
  public boolParentescoCE:boolean = false;
  public boolCelularCE:boolean = false;
  public boolTelefonoCE:boolean = false;
  public boolDireccionCE:boolean = false;
  public boolEmpresaEL1:boolean = false;
  public boolCargoEL1:boolean = false;
  public boolJefeEL1:boolean = false;
  public boolFechaIngresoEL1:boolean = false;
  public boolFechaRetiroEL1:boolean = false;
  public boolTelefonoEL1:boolean = false;
  public boolLaboresEL1:boolean = false;
  public boolEmpresaEL2:boolean = false;
  public boolCargoEL2:boolean = false;
  public boolJefeEL2:boolean = false;
  public boolFechaIngresoEL2:boolean = false;
  public boolFechaRetiroEL2:boolean = false;
  public boolTelefonoEL2:boolean = false;
  public boolLaboresEL2:boolean = false;
  public boolNombreRP1:boolean = false;
  public boolProfesionRP1:boolean = false;
  public boolTelefonoRP1:boolean = false;
  public boolNombreRP2:boolean = false;
  public boolProfesionRP2:boolean = false;
  public boolEmpresaRP2:boolean = false;
  public boolTelefonoRP2:boolean = false;
  public boolEmpresaRP1:boolean = false;

  @ViewChild('saveSwal') saveSwal: any;
  @ViewChild('errorSwal') errorSwal: any;

  constructor(private http: HttpClient, private globales: Globales, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Grupo' } }).subscribe((data: any) => {
      this.Grupos = data;
      //console.log(this.Grupos);      
      this.http.get(this.globales.ruta + 'php/funcionarios/detalle_funcionario.php', {
        params: { modulo: 'Funcionario', id: this.id }
      }).subscribe((data: any) => {
        //console.log(data);        
        this.funcionario = data;
        if (data.Contacto_Emergencia) {
          this.ContactoEmergencia = data.Contacto_Emergencia;
        }

        for (let i = 0; i < data.Experiencia_Laboral.length; ++i) {
          this.Experiencia[i] = data.Experiencia_Laboral[i];
        }

        for (let i = 0; i < data.Referencia_Personal.length; ++i) {
          this.Referencias[i] = data.Referencia_Personal[i];
        }

        this.Grupo = data.Id_Grupo;
        //console.log(this.Grupo);        
        if (data.Imagen != '') {
          this.ExisteFoto = false;
        }
        else {
          this.ExisteFoto = true;
        }
        this.AutoSeleccionarDependencia(data.Id_Grupo, data.Id_Dependencia, data.Id_Cargo);
      });
    });

    this.http.get(this.globales.ruta + 'php/funcionarios/detalle_perfil_funcionario.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      this.Permisos = data;
      if (this.Permisos.length > 1) {
        this.Id_Perfil = this.Permisos[0].Id_Perfil;       
      }
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Perfil' } }).subscribe((data: any) => {
      this.Perfiles = data;
    });

  }



  CargaFoto(event) {
    let fot = document.getElementById("foto_visual") as HTMLImageElement;
    if (event.target.files.length === 1) {
      this.Fotos = event.target.files[0];
      let url = URL.createObjectURL(event.target.files[0]);
      fot.src = url;
      this.ExisteFoto = false;
    }
  }

  AutoSeleccionarDependencia(grupo, dependencia, cargo) {
    this.http.get(this.globales.ruta + 'php/funcionarios/dependencias_grupo.php', { params: { id: grupo } }).subscribe((data: any) => {
      this.Dependencias = data;
      this.Dependencia = dependencia;
      this.AutoSeleccionarCargo(dependencia, cargo);
    });
  }

  AutoSeleccionarCargo(dependencia, cargo) {
    this.http.get(this.globales.ruta + 'php/funcionarios/cargos_dependencia.php', { params: { id: dependencia } }).subscribe((data: any) => {
      this.Cargos = data;
      this.Cargo = cargo;
    });
  }

  GrupoDependencia(grupo) {
    //console.log("id grupo funcionario");    
    //console.log(grupo);    
    this.http.get(this.globales.ruta + 'php/funcionarios/dependencias_grupo.php', { params: { id: grupo } }).subscribe((data: any) => {
      //console.log(data);      
      this.Dependencias = data;
    });
  }
  DependenciaCargo(dependencia) {
    this.http.get(this.globales.ruta + 'php/funcionarios/cargos_dependencia.php', { params: { id: dependencia } }).subscribe((data: any) => {
      this.Cargos = data;
    });
  }

  GuardarFuncionario(funcionario: NgForm, contactoEmergencia: NgForm, experienciaLaboral1: NgForm, experienciaLaboral2: NgForm, referenciasPersonales1: NgForm, referenciasPersonales2: NgForm) {
    let modulos = JSON.stringify(this.Permisos);
    let dummyFuncionario = JSON.stringify(funcionario.value);
    let dummyContactoEmergencia = JSON.stringify(contactoEmergencia.value);
    let dummyExperienciaLaboral = JSON.stringify([experienciaLaboral1.value, experienciaLaboral2.value]);
    let dummyReferenciaPersonal = JSON.stringify([referenciasPersonales1.value, referenciasPersonales2.value]);
    let datos = new FormData();
    datos.append("funcionario", dummyFuncionario);
    datos.append("contacto_emergencia", dummyContactoEmergencia);
    datos.append("experiencia", dummyExperienciaLaboral);
    datos.append("referencias", dummyReferenciaPersonal);
    datos.append('Foto', this.Fotos);
    
   
   var perfil = (document.getElementById("IdPerfil") as HTMLInputElement).value;
    datos.append('id_perfil',perfil); 
    datos.append('modulos', modulos);
    this.http.post(this.globales.ruta + 'php/funcionarios/funcionario_editar.php', datos).subscribe((data: any) => {
      this.VerPantallaLista();
      this.saveSwal.show();
    });
  }

  VerPantallaLista() {
    this.router.navigate(['/funcionarios']);
  }

  AsignarPermisos(event) {
    let id = event;
    this.http.get(this.globales.ruta + 'php/perfiles/detalle_perfil.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.Permisos = data;
      this.Longitud = this.Permisos.length;
    });

  }

  CambiarVer(pos) {

    if (this.Permisos[pos].Ver === '1') {
      this.Permisos[pos].Ver = '0';
    } else if (this.Permisos[pos].Ver === '0') {
      this.Permisos[pos].Ver = '1';
    }
  }
  CambiarCrear(pos) {

    if (this.Permisos[pos].Crear === '1') {
      this.Permisos[pos].Crear = '0';
    } else if (this.Permisos[pos].Crear === '0') {
      this.Permisos[pos].Crear = '1';
    }
  }
  CambiarEliminar(pos) {

    if (this.Permisos[pos].Eliminar === '1') {
      this.Permisos[pos].Eliminar = '0';
    } else if (this.Permisos[pos].Eliminar === '0') {
      this.Permisos[pos].Eliminar = '1';
    }
  }
  CambiarEditar(pos) {

    if (this.Permisos[pos].Editar === '1') {
      this.Permisos[pos].Editar = '0';
    } else if (this.Permisos[pos].Editar === '0') {
      this.Permisos[pos].Editar = '1';
    }
  }



}

