import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {

  public funcionarios = [];
  public grupos = [];
  public dependencias = [];
  public cargos = [];

  //variables que hacen referencia a los campos del formulario editar   

  public Identificacion : any[];
  public Codigo : any[];
  public Suspendido : any[];
  public Liquidado : any[];
  public Nombres : any[];
  public Apellidos : any[];
  public Grupo : any[];
  public Dependencia : any[];
  public Cargo : any[];
  public FechaNacimiento : any[];
  public LugarNacimiento : any[];
  public TipoSangre : any[];
  public Telefono : any[];
  public Celular : any[];
  public Correo : any[];
  public DireccionResidencia : any[];
  public EstadoCivil : any[];
  public GradoInstruccion : any[];
  public TituloEstudio : any[];
  public TallaPantalon : any[];
  public TallaBata : any[];
  public TallaBotas : any[];
  public TallaCamisa : any[];
  public Autorizado : any[];
  public Salario : any[];
  public Bonos : any[];
  public FechaIngreso : any[];
  public Hijos : any[];
  public UltimaSesion : any[];
  public FechaRegistrado : any[];
  public PersonId : any[];
  public PersistedFaceId : any[];
  public TipoTurno : any[];
  public Turno : any[];
  public Proceso : any[];
  public LiderGrupo : any[];
  public FechaRetiro : any[];
  public Sexo : any[];
  public Jefe : any[];
  public Salarios : any[];
  public ReporteHE : any[];
  public ValidacionHE : any[];
  public ReporteHorario : any[];
  public AsignacionHorario : any[];
  public Funcionario : any[];
  public Indicadores : any[];
  public Configuracion : any[];
  public LlegadaTarde : any[];
  public Novedades : any[];
  public PermisoApp : any[];
  public Contrato : any[];
  public Afilicaciones : any[];
  public GcmId : any[];
  public Estado : any[];



  

  @ViewChild('ModalFuncionario') ModalFuncionario:any;
  @ViewChild('ModalVerFuncionario') ModalVerFuncionario:any;
  @ViewChild('ModalEditarFuncionario') ModalEditarFuncionario:any;
  @ViewChild('errorSwal') errorSwal:any;
  @ViewChild('saveSwal') saveSwal:any;
  @ViewChild('deleteSwal') deleteSwal:any;
  @ViewChild('FormFuncionarioAgregar') FormFuncionarioAgregar:any;


  constructor(private http : HttpClient, private globales : Globales) { }

  ngOnInit() {
    this.ActualizarVista();
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Grupo'}}).subscribe((data:any)=>{
      this.grupos= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Dependencia'}}).subscribe((data:any)=>{
      this.dependencias= data;
    });
    this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{ params: { modulo: 'Cargo'}}).subscribe((data:any)=>{
      this.cargos= data;
    });

  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {     
      this.FormFuncionarioAgregar.reset();
      this.OcultarFormulario(this.ModalFuncionario);
      this.OcultarFormulario(this.ModalVerFuncionario);
      this.OcultarFormulario(this.ModalEditarFuncionario);
    }
  }

  ActualizarVista()
  {
    this.http.get(this.globales.ruta+'php/funcionarios/lista_funcionarios.php').subscribe((data:any)=>{
      this.funcionarios= data;
    });
  }


  /**
   *guarda los datos ingresados en el formulario en la tabla que se indica como segundo parametro en 
   *datos.append("modulo", 'nombre de la tabla')
   *
   * @param {NgForm} formulario
   * @memberof OficinasComponent
   */
  
   GuardarFuncionario(formulario: NgForm, modal:any){
    let info = JSON.stringify(formulario.value);
    let datos = new FormData();
    this.OcultarFormulario(modal);
    datos.append("modulo",'Funcionario');
    datos.append("datos",info);
    this.http.post(this.globales.ruta+'php/genericos/guardar_generico.php',datos)
    .catch(error => { 
      console.error('An error occurred:', error.error);
      this.errorSwal.show();
      return this.handleError(error);
    })
    .subscribe((data:any)=>{      
      this.ActualizarVista();
      formulario.reset();
      this.saveSwal().show;
    });    
  }

  handleError(error: Response) {
    return Observable.throw(error);
  }

  VerFuncionario(id, modal){
    this.http.get(this.globales.ruta+'php/funcionarios/detalle_funcionario.php',{
      params:{id:id}
    }).subscribe((data:any)=>{
      this.Identificacion = id;
      this.Codigo = data.Codigo;
      this.Suspendido = data.Suspendido;
      this.Liquidado = data.Liquidado;
      this.Nombres = data.Nombres;
      this.Apellidos = data.Apellidos;
      this.Grupo = data.Id_Grupo;
      this.Dependencia = data.Id_Dependencia;
      this.Cargo = data.Id_Cargo;
      this.FechaNacimiento = data.Fecha_Nacimiento;
      this.LugarNacimiento = data.Lugar_Nacimiento;
      this.TipoSangre = data.Tipo_Sangre;
      this.Telefono = data.Telefono;
      this.Celular = data.Celular;
      this.Correo = data.Correo;
      this.DireccionResidencia = data.Direccion_Residencia;
      this.EstadoCivil = data.Estado_Civil;
      this.GradoInstruccion = data.Grado_Instruccion;
      this.TituloEstudio = data.Titulo_Estudio;
      this.TallaPantalon = data.Talla_Pantalon;
      this.TallaBata = data.Talla_Bata;
      this.TallaBotas = data.Talla_Botas;
      this.TallaCamisa = data.Talla_Camisa;
      this.Autorizado = data.Autorizado;
      this.Salario = data.Salario;
      this.Bonos = data.Bonos;
      this.FechaIngreso = data.Fecha_Ingreso;
      this.Hijos = data.Hijos;
      this.UltimaSesion = data.Ultima_Sesion;
      this.FechaRegistrado = data.Fecha_Registrado;
      this.PersonId = data.personId;
      this.PersistedFaceId = data.persistedFaceId;
      this.TipoTurno = data.Tipo_Turno;
      this.Turno = data.Id_Turno;
      this.Proceso = data.Id_Proceso;
      this.LiderGrupo = data.Lider_Grupo;
      this.FechaRetiro = data.Fecha_Retiro;
      this.Sexo = data.Sexo;
      this.Jefe = data.Jefe;
      this.Salario = data.Salarios;
      this.ReporteHE = data.Reporte_HE;
      this.ValidacionHE = data.Validacion_HE;
      this.ReporteHorario = data.Reporte_Horario;
      this.AsignacionHorario = data.Asignacion_Horario;
      this.Funcionario = data.Funcionarios;
      this.Indicadores = data.Indicadores;
      this.Configuracion = data.Configuracion;
      this.LlegadaTarde = data.Llegada_Tarde;
      this.Novedades = data.Novedades;
      this.PermisoApp = data.Permiso_App;
      this.Contrato = data.Contrato;
      this.Afilicaciones = data.Afiliaciones;
      this.GcmId = data.Gcm_Id;
      modal.show();
    });
  }



  /**
   *
   *actualiza los datos correspondientes al id que se le pasa como primer parametro en la tabla que se especifica en
   *params:{modulo:'nombre de la tabla', id:id}
   * @param {*} id
   * @param {*} modal
   * @memberof OficinasComponent
   */
  EditarFuncionario(id, modal){
    this.http.get(this.globales.ruta+'php/genericos/detalle.php',{
      params:{modulo:'Funcionario', id:id}
    }).subscribe((data:any)=>{

      
      modal.show();
    });
  }


  
  EliminarFuncionario(id){
    let datos = new FormData();
    datos.append("modulo", 'Funcionario');
    datos.append("id", id);
    this.http.post(this.globales.ruta + 'php/genericos/anular_generico.php', datos ).subscribe((data: any) => {
      this.deleteSwal.show();
      this.ActualizarVista();
    });
  }



  OcultarFormulario(modal){

    
    modal.hide();
  }

  Cerrar(modal){
    this.OcultarFormulario(modal)
  }

}
