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

  public CuentasBancarias:Array<any> = [];
  public Nombre_Funcionario:string = "Nombre Consultor";
  public Cargando:boolean = false;
  public Id_Funcionario:string =  this._activeRoute.snapshot.params["id_funcionario"];
  public Id_Apertura:any =  localStorage.getItem('Apertura_Consultor');

  constructor(private _cuentaBancariaService:CuentabancariaService,
              public generalService:GeneralService,
              private _activeRoute:ActivatedRoute,
              private _route:Router,
              private _swalService:SwalService,
              private _generalService:GeneralService,
              private _funcionarioService:NuevofuncionarioService) { }

  ngOnInit() {
    this.GetCuentasBancariasApertura();
  }

  public GetCuentasBancariasApertura(){
    this.Cargando = true;
    let p = {id_funcionario:this.Id_Funcionario, id_apertura:this.Id_Apertura};
    this._cuentaBancariaService.GetCuentasBancariasCierre(p).subscribe((data:any) => {
      console.log(data);
      if (data.codigo == 'success') {
        this.Cargando = false;
        this.CuentasBancarias = data.query_data;
        this.Nombre_Funcionario = data.consultor;
      }else{
        this.CuentasBancarias = [];
      }
    });
  }

  public GuardarCierreConsultor(){
    let data = new FormData();
    data.append('cuentas', JSON.stringify(this.CuentasBancarias));
    data.append('id_funcionario', this.Id_Funcionario);
    data.append('id_apertura', this.Id_Apertura);
    data.append('id_oficina', this.generalService.SessionDataModel.idOficina);
    data.append('id_caja', this.generalService.SessionDataModel.idCaja);

    this._cuentaBancariaService.GuardaCierreCuentasBancarias(data).subscribe((response:any) => {
      console.log(response);
      if (response.codigo == 'success') {
        this.CuentasBancarias = [];
        localStorage.setItem('Apertura_Consultor', '');
        this._swalService.ShowMessage(response);
        setTimeout(() => {
          this.CerrarSesion();
        }, 500);
      }else{
        this._swalService.ShowMessage(response);
      }
    });
  }

  public VerMovimientos(idCuentaBancaria:string){
    console.log(idCuentaBancaria);
    
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

  public VolverATablero(){    
    this._route.navigate(["/tablero"]);
  }

  private _registrarCierreSesion(){
    let data = new FormData();
    data.append('id_funcionario', this._generalService.Funcionario.Identificacion_Funcionario);
    this._funcionarioService.LogCierreSesion(data).subscribe();
}

}
