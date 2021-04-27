import { Component, OnInit } from '@angular/core';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { NuevofuncionarioService } from '../../../shared/services/funcionarios/nuevofuncionario.service';

@Component({
  selector: 'app-cierrecuentasconsultor',
  templateUrl: './cierrecuentasconsultor.component.html',
  styleUrls: ['./cierrecuentasconsultor.component.scss', '../../../../style.scss']
})
export class CierrecuentasconsultorComponent implements OnInit {

  public CuentasBancarias: Array<any> = [];
  public Nombre_Funcionario: string = "Nombre Consultor";
  public Cargando: boolean = false;
  public Id_Funcionario: string = this._activeRoute.snapshot.params["id_funcionario"];
  public Id_Apertura: any = localStorage.getItem('Apertura_Consultor');
  public CheckAll: any = false;
  constructor(private _cuentaBancariaService: CuentabancariaService,
    public generalService: GeneralService,
    private _activeRoute: ActivatedRoute,
    private _route: Router,
    private _swalService: SwalService,
    private _generalService: GeneralService,
    private _funcionarioService: NuevofuncionarioService) { }

  ngOnInit() {
    this.GetCuentasBancariasApertura();
  }


  checkAlls(check_general) {
    //buscamos todos los checks de los productos

    let cheks = document.getElementsByClassName("checks");

    //activo/desactivo todos los checks dependiento de el general
    for (let index = 0; index < cheks.length; index++) {
      cheks[index]['checked'] = check_general;
    }

    this.CuentasBancarias.forEach(element => {
      element.Check_C = check_general;
    });
    //busco cada item y le doy los valores de la nota

  }


  public GetCuentasBancariasApertura() {
    this.Cargando = true;
    let p = { id_funcionario: this.Id_Funcionario, id_apertura: this.Id_Apertura };
    this._cuentaBancariaService.GetCuentasBancariasCierre(p).subscribe((data: any) => {
      // console.log(data);
      if (data.codigo == 'success') {
        this.Cargando = false;
        this.CuentasBancarias = data.query_data;
        this.Nombre_Funcionario = data.consultor;
      } else {
        this.CuentasBancarias = [];
      }
    });
  }

  public GuardarCierreConsultor() {
    let selected = this.CuentasBancarias.filter(cb => cb.Check_C == true)
    if (!selected || selected.length == 0) {
      this._swalService.ShowMessage(['warning', 'Adertencia', 'Debe seleccionar al menos una cuenta ']);
      return;
    }


    let data = new FormData();
    data.append('cuentas', JSON.stringify(selected));
    data.append('id_funcionario', this.Id_Funcionario);
    data.append('id_apertura', this.Id_Apertura);
    data.append('id_oficina', this.generalService.SessionDataModel.idOficina);
    data.append('id_caja', this.generalService.SessionDataModel.idCaja);
    if (selected.length == this.CuentasBancarias.length) {
      data.append('cierre_completo', 'true');
    }

    let flag = [];
    selected.forEach(element => {
      if (element.Monto_Cierre < 0) {
        flag.push(element)
      }
    });

    if (flag.length == 0) {
      this._cuentaBancariaService.GuardaCierreCuentasBancarias(data).subscribe((response: any) => {
        // console.log(response);
        if (response.codigo == 'success') {
          if (selected.length == this.CuentasBancarias.length) {

            this.CuentasBancarias = [];
            localStorage.setItem('Apertura_Consultor', '');
            localStorage.setItem('Volver_Apertura', 'Si');
            this._swalService.ShowMessage(response);
            setTimeout(() => {
              this.CerrarSesion();
            }, 500);

          } else {
            this.VolverATablero()
          }
        } else {
          this._swalService.ShowMessage(response);
        }
      });

    } else {
      this._swalService.ShowMessage(['warning', 'Adertencia', 'No puede cerrar en Negativo ']);
      return false;

    }
  }

  public VerMovimientos(idCuentaBancaria: string) {
    // console.log(idCuentaBancaria);
    this._route.navigate(['/detallemovimientoscuenta', idCuentaBancaria, 'Ver']);
  }

  private CerrarSesion() {
    this._registrarCierreSesion();
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    localStorage.removeItem("Banco");
    localStorage.removeItem('Perfil');
    localStorage.removeItem('Apertura_Consultor');
    localStorage.removeItem('CuentasDescuadradas');
    localStorage.removeItem('Cuentas_Seleccionadas');
    // localStorage.removeItem('Caja');
    // localStorage.removeItem('Oficina');
    this._route.navigate(["/login"]);
  }

  public VolverATablero() {
    this._route.navigate(["/consultor"]);
  }

  private _registrarCierreSesion() {
    let data = new FormData();
    data.append('id_funcionario', this._generalService.Funcionario.Identificacion_Funcionario);
    this._funcionarioService.LogCierreSesion(data).subscribe();
  }

}
