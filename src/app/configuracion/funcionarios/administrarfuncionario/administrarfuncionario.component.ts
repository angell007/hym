import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuncionarioModel } from '../../../Modelos/FuncionarioModel';
import { ContactoEmergenciaModel } from '../../../Modelos/ContactoEmergenciaModel';
import { ExperienciaLaboralModel } from '../../../Modelos/ExperienciaLaboralModel';
import { CuentaBancariaFuncionarioModel } from '../../../Modelos/CuentaBancariaFuncionarioModel';
import { GeneralService } from '../../../shared/services/general/general.service';
import { ValidacionService } from '../../../shared/services/validaciones/validacion.service';
import { NuevofuncionarioService } from '../../../shared/services/funcionarios/nuevofuncionario.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GrupoService } from '../../../shared/services/gruposfuncionarios/grupo.service';
import { DependenciaService } from '../../../shared/services/dependencias/dependencia.service';
import { CargoService } from '../../../shared/services/cargos/cargo.service';
import { PerfilService } from '../../../shared/services/perfiles/perfil.service';

@Component({
  selector: 'app-administrarfuncionario',
  templateUrl: './administrarfuncionario.component.html',
  styleUrls: ['./administrarfuncionario.component.scss', '../../../../style.scss']
})
export class AdministrarfuncionarioComponent implements OnInit, OnDestroy {

  private _subjectValidarIdentificacion = new Subject<any>();
  public ValidarIdentificaiconEvent$ = this._subjectValidarIdentificacion.asObservable();
  private _validarIdentificacionSubscription:any;

  private _accion:string = this._activeRoute.snapshot.params["accion"];
  public FuncionarioModel:FuncionarioModel = new FuncionarioModel();
  public ContactoEmergenciaModel:ContactoEmergenciaModel = new ContactoEmergenciaModel();
  public ExperienciaLaboralModel:Array<ExperienciaLaboralModel> = new Array<ExperienciaLaboralModel>();
  public ReferenciaLaboralModel:Array<ExperienciaLaboralModel> = new Array<ExperienciaLaboralModel>();
  public CuentasAsociadas:Array<CuentaBancariaFuncionarioModel> = new Array<CuentaBancariaFuncionarioModel>();

  public CuentasBancarias:Array<any> = [];
  public Grupos:Array<any> = [];
  public Dependencias:Array<any> = [];
  public Cargos:Array<any> = [];
  public Perfiles:Array<any> = [];
  public PerfilesPermisos:Array<any> = [];

  constructor(private _activeRoute:ActivatedRoute,
              private _generalService:GeneralService,
              private _validacionService:ValidacionService,
              private _funcionarioService:NuevofuncionarioService,
              private _swalService:SwalService,
              private _toastService:ToastService,
              private _grupoService:GrupoService,
              private _dependenciaService:DependenciaService,
              private _cargoService:CargoService,
              private _perfilService:PerfilService) 
  { 
    this.GetGrupos();
    this.GetDependencias();
    this.GetCargos();
    this.SetPerfiles();
    this.GetPerfiles();
  }

  ngOnInit() {
    this._validarIdentificacionSubscription = this.ValidarIdentificaiconEvent$.pipe(
      debounceTime(500),
      switchMap( value => value != '' ?
        this._funcionarioService.validarIdentificacion(value) : '' 
      )
    ).subscribe(response => {
      if (response.codigo == 'warning') {
        this._swalService.ShowMessage(response);
        this.FuncionarioModel.Identificacion_Funcionario = '';
      }
    });
  }

  ngOnDestroy(){
    if (this._validarIdentificacionSubscription != undefined) {
      this._validarIdentificacionSubscription.unsubscribe();
    }
  }

  GetGrupos(){
    this._grupoService.getGrupos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;
      }else{

        this.Grupos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetDependencias(){
    this._dependenciaService.getDependencias().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Dependencias = data.query_data;
      }else{

        this.Dependencias = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetCargos(){
    this._cargoService.getCargos().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Cargos = data.query_data;
      }else{

        this.Cargos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetPerfiles(){
    this._perfilService.getPerfiles().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Perfiles = data.query_data;
      }else{

        this.Perfiles = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  SetPerfiles(){
    this.PerfilesPermisos = this._generalService.PerfilesPermisos;
  }

  ValidarIdentificacion(){
    if (this.FuncionarioModel.Identificacion_Funcionario.length > 10) {
      this._swalService.ShowMessage(['warning', 'Alerta', 'El numero de identificacion supera los 10 digitos, por favor acorte la misma a 10 digitos o menos']);
      return;
    }

    this._subjectValidarIdentificacion.next(this.FuncionarioModel.Identificacion_Funcionario);
  }

  AcortarIdentificacion(){
    if (this.FuncionarioModel.Identificacion_Funcionario.length > 10) {
      this.FuncionarioModel.Identificacion_Funcionario = this.FuncionarioModel.Identificacion_Funcionario.slice(0, 10);
    }
  }

  BuscarPermisosPerfil(){
    if (this.FuncionarioModel.Id_Perfil == '') {
      this.PerfilesPermisos = [];
      return;
    }

    this._perfilService.getPermisosPerfil(this.FuncionarioModel.Id_Perfil).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.PerfilesPermisos = data.query_data;        
      }else{

        this.PerfilesPermisos = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  CargaFoto(event) {
    let fot = document.getElementById("foto_visual") as HTMLImageElement;

    if (event.target.files.length === 1) {

      this.FuncionarioModel.Foto = event.target.files[0];

      let url = URL.createObjectURL(event.target.files[0]);
      fot.src = url;
    }
  }

}
