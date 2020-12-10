import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../shared/globales/globales';

@Component({
  selector: 'app-administrarfuncionario',
  templateUrl: './administrarfuncionario.component.html',
  styleUrls: ['./administrarfuncionario.component.scss', '../../../../style.scss']
})
export class AdministrarfuncionarioComponent implements OnInit, OnDestroy {

  private _subjectValidarIdentificacion = new Subject<any>();
  public ValidarIdentificaiconEvent$ = this._subjectValidarIdentificacion.asObservable();
  private _validarIdentificacionSubscription: any;

  private _idFuncionario: string = this._activeRoute.snapshot.params["id_funcionario"];
  public Edicion: boolean = false;
  public FuncionarioModel: FuncionarioModel = new FuncionarioModel();
  public ContactoEmergenciaModel: ContactoEmergenciaModel = new ContactoEmergenciaModel();
  public ExperienciaLaboralModel: Array<ExperienciaLaboralModel> = new Array<ExperienciaLaboralModel>();
  public ReferenciaLaboralModel: Array<ExperienciaLaboralModel> = new Array<ExperienciaLaboralModel>();
  public CuentasConsultor: Array<any> = [];
  public CuentasAsignadas: Array<any> = [];
  public CuentasAsociadas: Array<CuentaBancariaFuncionarioModel> = new Array<CuentaBancariaFuncionarioModel>();

  public CuentasBancarias: Array<any> = [];
  public Grupos: Array<any> = [];
  public oficinas: Array<any> = [];
  public Dependencias: Array<any> = [];
  public Cargos: Array<any> = [];
  public oficinas_dependientes: Array<any> = [];
  public Perfiles: Array<any> = [];
  public PerfilesPermisos: Array<any> = [];
  public MostrarSelect: boolean = false;
  public CuentasVaciasInicial: boolean = true;

  constructor(private _activeRoute: ActivatedRoute,
    private http: HttpClient,
    private global: Globales,
    private _generalService: GeneralService,
    private _validacionService: ValidacionService,
    private _funcionarioService: NuevofuncionarioService,
    private _swalService: SwalService,
    private _toastService: ToastService,
    private _grupoService: GrupoService,
    private _dependenciaService: DependenciaService,
    private _cargoService: CargoService,
    private _perfilService: PerfilService,
    private _cuentaService: CuentabancariaService,
    private router: Router) {
    this.GetGrupos();
    this.GetDependencias();
    this.GetCargos();
    //this.SetPerfiles();
    this.GetPerfiles();
    this.GetCuentasBancarias();
    this.getOficinas();

    if (this._idFuncionario != 'nuevo') {
      this.Edicion = true;
      this.GetDatosFuncionario();
    } else {
      this.CuentasVaciasInicial = true;
    }
  }

  ngOnInit() {
    this._validarIdentificacionSubscription = this.ValidarIdentificaiconEvent$.pipe(
      debounceTime(500),
      switchMap(value => value != '' ?
        this._funcionarioService.validarIdentificacion(value) : ''
      )
    ).subscribe(response => {
      if (response.codigo == 'warning') {
        this._swalService.ShowMessage(response);
        this.FuncionarioModel.Identificacion_Funcionario = '';
      }
    });
  }

  getOficinas() {
    this.http.get(this.global.ruta + 'php/oficinas/get_oficinas.php').subscribe((data: any) => {
      // console.log(data);
      this.oficinas = data.query_data.map((oficina) => {
        return {
          value: oficina.Id_Oficina,
          label: oficina.Nombre,
        }
      });

      this.oficinas.push({ value: '', label: 'Todos' });
      // console.log( this.oficinas);

    });

  }

  ngOnDestroy() {
    if (this._validarIdentificacionSubscription != undefined) {
      this._validarIdentificacionSubscription.unsubscribe();
    }

    this.FuncionarioModel = null;
  }

  GetGrupos() {
    this._grupoService.getGrupos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Grupos = data.query_data;
      } else {

        this.Grupos = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetDependencias() {
    this._dependenciaService.getDependencias().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Dependencias = data.query_data;
      } else {

        this.Dependencias = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetCargos() {
    this._cargoService.getCargos().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Cargos = data.query_data;
      } else {

        this.Cargos = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetPerfiles() {
    this._perfilService.getPerfiles().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.Perfiles = data.query_data;
      } else {

        this.Perfiles = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  SetPerfiles() {
    this.PerfilesPermisos = this._generalService.PerfilesPermisos;
  }

  GetDatosFuncionario() {
    this._funcionarioService.getDatosFuncionario(this._idFuncionario).subscribe((data: any) => {

      console.log(data);

      if (data.codigo == 'success') {
        this.FuncionarioModel = data.query_data;
        this.ContactoEmergenciaModel = data.Contacto_Emergencia;
        this.CuentasConsultor = data.Cuentas_Consultor;
        this.CuentasAsignadas = data.Cuentas_Asignadas;

        if (this.CuentasAsignadas.length > 0)
          this.CuentasVaciasInicial = false;
        else
          this.CuentasVaciasInicial = true;

        this.RemoverCuentasAsignadasLista();
        this.MostrarSelectCuentas();
        //this.BuscarPermisosPerfil();
        this.BuscarPermisosFuncionario();
      } else {

        this.FuncionarioModel = new FuncionarioModel();
        this.ContactoEmergenciaModel = new ContactoEmergenciaModel();
        this._swalService.ShowMessage(data);
      }
    });
  }

  GetCuentasBancarias() {
    this._cuentaService.getCuentasBancariasSelect().subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
        // console.log(this.CuentasBancarias);
      } else {

        this.CuentasBancarias = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GuardarFuncionario() {

    if (!this.Edicion) {
      this.FuncionarioModel.Fecha_Registrado = this._generalService.FullFechaActual;
      this.FuncionarioModel.Username = this.FuncionarioModel.Identificacion_Funcionario;
      this.FuncionarioModel.Password = this.FuncionarioModel.Identificacion_Funcionario;
      this.ContactoEmergenciaModel.Identificacion_Funcionario = this.FuncionarioModel.Identificacion_Funcionario;
    }

    let funcionario = this._generalService.normalize(JSON.stringify(this.FuncionarioModel));
    let contacto_emergencia = this._generalService.normalize(JSON.stringify(this.ContactoEmergenciaModel));
    let permisos = this._generalService.normalize(JSON.stringify(this.PerfilesPermisos));
    let cuentas = this._generalService.normalize(JSON.stringify(this.CuentasConsultor));

    if (this.oficinas_dependientes.length > 0) {
      this.oficinas_dependientes.forEach((element) => {
        if (element == "") {
          this.oficinas_dependientes = this.oficinas;
        }
      })
    }


    let oficinas = this._generalService.normalize(JSON.stringify(this.oficinas_dependientes));

    let datos = new FormData();
    datos.append("modelo", funcionario);
    datos.append("contacto_emergencia", contacto_emergencia);
    datos.append("permisos", permisos);
    datos.append('cuentas_asociadas', cuentas);

    if (this.FuncionarioModel.Id_Perfil == '2') {
      datos.append('Oficinas_Asociadas', oficinas);
    }

    if (this.Edicion) {
      this._funcionarioService.editFuncionario(datos).subscribe((response: any) => {

        console.log(['editar', response]);

        if (response.codigo == 'success') {
          this._swalService.ShowMessage(response);
          this.LimpiarModelo();
          setTimeout(() => {
            this.router.navigate(['/funcionarios']);
          }, 500);
        } else {

          this._swalService.ShowMessage(response);
        }

      });
    } else {
      this._funcionarioService.saveFuncionario(datos).subscribe((response: any) => {

        // console.log(['Crear', response]);

        if (response.codigo == 'success') {
          // this._swalService.ShowMessage(response);
          // this.LimpiarModelo();
          // setTimeout(() => {
          //   this.router.navigate(['/funcionarios']);
          // }, 500);
        } else {

          this._swalService.ShowMessage(response);
        }
      });
    }
  }

  LimpiarModelo() {
    this.FuncionarioModel = new FuncionarioModel();
    this.ContactoEmergenciaModel = new ContactoEmergenciaModel();
    this.CuentasAsociadas = [];
    this.PerfilesPermisos = [];
  }

  ValidarIdentificacion() {
    if (this.FuncionarioModel.Identificacion_Funcionario != '') {
      if (this.FuncionarioModel.Identificacion_Funcionario.length > 10) {
        this._swalService.ShowMessage(['warning', 'Alerta', 'El numero de identificacion supera los 10 digitos, por favor acorte la misma a 10 digitos o menos']);
        return;
      }
    } else {

      return;
    }

    this._subjectValidarIdentificacion.next(this.FuncionarioModel.Identificacion_Funcionario);
  }

  AcortarIdentificacion() {
    if (this.FuncionarioModel.Identificacion_Funcionario.length > 10) {
      this.FuncionarioModel.Identificacion_Funcionario = this.FuncionarioModel.Identificacion_Funcionario.slice(0, 10);
    }
  }

  BuscarPermisos() {
    this.MostrarSelectCuentas();

    if (this.Edicion) {
      this.BuscarPermisosFuncionario();
    } else {
      this.BuscarPermisosPerfil();
    }
  }

  BuscarPermisosPerfil() {
    if (this.FuncionarioModel.Id_Perfil == '') {
      this.PerfilesPermisos = [];
      return;
    }

    this._perfilService.getPermisosPerfil(this.FuncionarioModel.Id_Perfil).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.PerfilesPermisos = data.query_data;
      } else {

        this.PerfilesPermisos = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  BuscarPermisosFuncionario() {
    if (this.FuncionarioModel.Id_Perfil == '') {
      this.PerfilesPermisos = [];
      return;
    }

    if (this.FuncionarioModel.Identificacion_Funcionario == '') {
      this.PerfilesPermisos = [];
      return;
    }

    this._funcionarioService.getPerfilesFuncionario(this.FuncionarioModel.Id_Perfil, this.FuncionarioModel.Identificacion_Funcionario).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.PerfilesPermisos = data.query_data;
      } else {

        this.PerfilesPermisos = [];
        let toastObj = { textos: [data.titulo, data.mensaje], tipo: data.codigo, duracion: 4000 };
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  CargaFoto(event) {
    let fot = document.getElementById("foto_visual") as HTMLImageElement;

    if (event.target.files.length === 1) {

      this.FuncionarioModel.Imagen = event.target.files[0];

      let url = URL.createObjectURL(event.target.files[0]);
      fot.src = url;
    }
  }

  CambiarValorVer(posicion: string) {
    if (this.PerfilesPermisos[posicion].Ver == '0') {
      this.PerfilesPermisos[posicion].Ver = '1'
    } else {

      this.PerfilesPermisos[posicion].Ver = '0'
    }
  }

  CambiarValorCrear(posicion: string) {
    if (this.PerfilesPermisos[posicion].Crear == '0') {
      this.PerfilesPermisos[posicion].Crear = '1'
    } else {

      this.PerfilesPermisos[posicion].Crear = '0'
    }
  }

  CambiarValorEditar(posicion: string) {
    if (this.PerfilesPermisos[posicion].Editar == '0') {
      this.PerfilesPermisos[posicion].Editar = '1'
    } else {

      this.PerfilesPermisos[posicion].Editar = '0'
    }
  }

  CambiarValorEliminar(posicion: string) {
    if (this.PerfilesPermisos[posicion].Eliminar == '0') {
      this.PerfilesPermisos[posicion].Eliminar = '1'
    } else {

      this.PerfilesPermisos[posicion].Eliminar = '0'
    }
  }

  RemoverCuentasAsignadasLista() {
    if (this.CuentasAsignadas.length > 0) {
      this.CuentasAsignadas.forEach(cta => {
        let ctaIndex = this.CuentasBancarias.findIndex(x => x.value == cta);

        if (ctaIndex > -1) {
          this.CuentasBancarias.splice(ctaIndex, 1);
        }
      });
    }
  }

  MostrarSelectCuentas() {
    if (this.FuncionarioModel.Id_Perfil == '') {
      this.MostrarSelect = false;
      this.CuentasAsociadas = this.CuentasVaciasInicial ? [] : this.CuentasAsociadas;
      return;
    }

    let perfil: string = this.Perfiles.find(x => x.Id_Perfil == this.FuncionarioModel.Id_Perfil).Nombre;

    if (perfil.trim().toLowerCase() == 'consultor') {
      this.MostrarSelect = true;
    } else {
      this.MostrarSelect = false;
    }
  }

  TestSelect() {
    // console.log(this.CuentasConsultor);

  }

  Dependencia_Grupo() {

  }

  Cargo_Dependencia() { }


  public onSelectAll() {
    if (this.oficinas_dependientes.length > 0) {
      this.oficinas_dependientes.forEach((element) => {
        if (element == "") {
          this.oficinas_dependientes = [''];
        }
      })
    }
  }
}
