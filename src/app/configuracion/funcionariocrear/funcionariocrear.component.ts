import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { CommonModule } from '@angular/common';
import { Globales } from '../../shared/globales/globales';
//import { FormWizardModule } from 'angular2-wizard/dist';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';

@Component({
  selector: 'app-funcionariocrear',
  templateUrl: './funcionariocrear.component.html',
  styleUrls: ['./funcionariocrear.component.scss', '../../../style.scss']
})
export class FuncionariocrearComponent implements OnInit {
  // public funcionario: any [];
  /* public Id_Funcionario: any [];
   public Punto_Dispensacion: any [];
   public Suspendido: any [];
   public Id_Perfil: any [];
   public Perfil: any [];
   
   public cargo:any = [];
   public Procesos: any = []; 
   public Proceso: any = [];*/
  public Grupos: any = [];
  public Dependencias: any = [];
  public Cargos: any = [];
  public Fotos: any;
  public Perfiles:any=[];

  public validForm:boolean = false;

  public funcionario =
    {
      Foto: '',
      Identificacion_Funcionario: '',
      Nombres: '',
      Apellidos: '',
      Fecha_Nacimiento: '',
      Lugar_Nacimiento: '',
      PesoTipo_Sangre_Regular: '',
      Telefono: '',
      Celular: '',
      Correo: '',
      Direccion_Residencia: '',
      Estado_Civil: '',
      Hijos: '',
      Grado_Instruccion: '',
      Titulo_Estudio: '',
      Id_Grupo: '',
      Id_Dependencia: '',
      Id_Cargo: '',
      Salario: '',
      Fecha_Ingreso: '',
      //Tipo_Turno : '',
      // Id_Turno : '',
      Talla_Camisa: '',
      Talla_Pantalon: '',
      Talla_Botas: '',
      Saldo_Inicial_Peso : '',
      Saldo_Inicial_Bolivar: '',
      Tipo_Sangre: ''
    };

  public contacto_emergencia =
    {
      Nombre: '',
      Parentesco: '',
      Celular: '',
      Telefono: '',
      Direccion: ''
    };

  public experiencia = [
    {
      Nombre_Empresa: '',
      Cargo: '',
      Jefe: '',
      Ingreso_Empresa: '',
      Retiro_Empresa: '',
      Telefono: '',
      Labores: ''
    },
    {
      Nombre_Empresa: '',
      Cargo: '',
      Jefe: '',
      Ingreso_Empresa: '',
      Retiro_Empresa: '',
      Telefono: '',
      Labores: ''
    }
  ];

  public referencias = [
    {
      Nombres: '',
      Profesion: '',
      Empresa: '',
      Telefono: ''
    },
    {
      Nombres: '',
      Profesion: '',
      Empresa: '',
      Telefono: ''
    }
  ];

  public CuentasBancarias:Array<any> = [];
  public CuentasAsociadas:any = [];

  Funcionario:any = [];
  public Permisos:any = []=[];
  public Longitud:number=0;

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



  constructor(
              private http: HttpClient, 
              private globales: Globales, 
              private route: ActivatedRoute, 
              private router: Router,
              private cuentaService:CuentabancariaService) 
{
  this.GetCuentasBancarias();
}

onStepping(event){
  // console.log(event);
  
}

  CargaFoto(event) {
    let fot = document.getElementById("foto_visual") as HTMLImageElement;

    if (event.target.files.length === 1) {

      this.Fotos = event.target.files[0];

      let url = URL.createObjectURL(event.target.files[0]);
      fot.src = url;
    }
  }

  @ViewChild('NuevoFuncionario') NuevoFuncionario: any;
  @ViewChild('FormFuncionarioEditar') FormFuncionarioEditar: any;
  @ViewChild('modalFuncionario') modalFuncionario: any;
  @ViewChild('modalFuncionarioEditar') modalFuncionarioEditar: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;

  ngOnInit() {

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Grupo' } }).subscribe((data: any) => {
      this.Grupos = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Funcionario' } }).subscribe((data: any) => {
      this.Funcionario = data;
    });

    this.http.get(this.globales.ruta + 'php/genericos/lista_generales.php', { params: { modulo: 'Perfil' } }).subscribe((data: any) => {
      this.Perfiles = data;
    });

  }

  Dependencia_Grupo(Grupo) {
    this.http.get(this.globales.ruta + 'php/funcionarios/dependencias_grupo.php', { params: { id: Grupo } }).subscribe((data: any) => {
      this.Dependencias = data;
    });
  }

  Cargo_Dependencia(Dependencia) {
    this.http.get(this.globales.ruta + 'php/funcionarios/cargos_dependencia.php', { params: { id: Dependencia } }).subscribe((data: any) => {
      this.Cargos = data;
    });
  }

  AsignarPermisos(event){
    let id=event;
    this.http.get(this.globales.ruta + 'php/perfiles/detalle_perfil.php', {
      params: { id: id}
    }).subscribe((data: any) => {
    this.Permisos=data;
    this.Longitud=this.Permisos.length;
    
    });
    
  }

  GuardarFuncionario(formulario: NgForm) {

    let info = JSON.stringify(formulario.value);
    let func = JSON.stringify(this.funcionario);
    let conemer = JSON.stringify(this.contacto_emergencia);
    let exper = JSON.stringify(this.experiencia);
    let refe = JSON.stringify(this.referencias);
    let modulos=JSON.stringify(this.Permisos);
    let cuentas=JSON.stringify(this.CuentasAsociadas);
    let datos = new FormData();
    datos.append("modulo", 'Funcionario');
    datos.append("datos", info);
    datos.append("funcionario", func);
    datos.append("contacto_emergencia", conemer);
    datos.append("experiencia", exper);
    datos.append("referencias", refe);
    datos.append('modulos', modulos);
    datos.append('Foto', this.Fotos);
    datos.append('cuentas_asociadas', cuentas);
    this.http.post(this.globales.ruta + 'php/funcionarios/funcionario_guardar2.php', datos).subscribe((data: any) => {
      this.confirmacionSwal.title = "Guardado Correctamente";
      this.confirmacionSwal.text = data.mensaje;
      this.confirmacionSwal.type = data.tipo;
      this.confirmacionSwal.show();
      this.Fotos = [];
      formulario.reset();
      this.VerPantallaLista();
    });
  }

  VerPantallaLista() {
    this.router.navigate(['/funcionarios']);
  }
 
  EditarFuncionario(id) {
    this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
      params: { modulo: 'funcionario', id: id }
    }).subscribe((data: any) => {
      this.funcionario = data.Id_Funcionario;
      this.modalFuncionarioEditar.show();
    });
  }

  SuspenderFuncionario(id) {
    this.http.get(this.globales.ruta + 'php/genericos/suspender.php', {
      params: { modulo: 'Funcionario', id: id }
    }).subscribe((data: any) => {

    });
  }


  validarIdentificacion(id){
    var identificacion = this.Funcionario.findIndex( x => x.Identificacion_Funcionario === id);
    if(identificacion > -1){
      this.confirmacionSwal.title = "error con el funcionario";
      this.confirmacionSwal.text = "Este funcionario ya fue creado con este número de identificación";
      this.confirmacionSwal.type = "error";
      this.confirmacionSwal.show();
      this.funcionario.Identificacion_Funcionario = "";
    }    
  }

  validarLongitud(item){
    if (item.length > 10) {
     // identificacion
     (document.getElementById("identificacion") as HTMLInputElement).value = item.slice(0,10); 
    }
  }

  GetCuentasBancarias(){
    this.cuentaService.getCuentasBancariasSelect().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
      }else{

        this.CuentasBancarias = [];
        this.confirmacionSwal.title = "Alerta";
        this.confirmacionSwal.text = "No se econtraron datos de cuentas bancarias!";
        this.confirmacionSwal.type = "warning";
        this.confirmacionSwal.show();
      }
    });
  }

}

