import { Component, OnInit } from '@angular/core';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';

@Component({
  selector: 'app-vistaprincipalconsultor',
  templateUrl: './vistaprincipalconsultor.component.html',
  styleUrls: ['./vistaprincipalconsultor.component.scss']
})
export class VistaprincipalconsultorComponent implements OnInit {

  public MostrarApertura:boolean = true;

  constructor(private _cuentaBancariaService:CuentabancariaService,
              private _generalService:GeneralService) { }

  ngOnInit() {
    this.ConsultarAperturaFuncionario();
  }

  public CambiarVista(){
    this.MostrarApertura = !this.MostrarApertura;
  }

  /**
   * COMPRUEBA SI ELFUNCIONARIO YA TIENE UNA APERTURA DE CUENTA ACTIVA
   * SI EXISTE UNA APERTURA SE CARGA EL TABLERO NORMALMENTE, DONDE EL CONSULTOR PUEDE GESTIONAR TRANSFERENCIAS NUEVAS
   * SI NO EXISTE UNA APERTURA SE CARGA LA VISTA DE APERTURA DE CUENTAS, DONDE EL CONSULTOR PUEDE GESTIONAR ESCOGER LAS CUENTAS CON LAS QUE VA A TRABAJAR EN EL TABLERO
   */
  public ConsultarAperturaFuncionario(){
    this._cuentaBancariaService.GetAperturaFuncionario(this._generalService.Funcionario.Identificacion_Funcionario).subscribe((data:any) =>{
      console.log(data);
      
      if (!data.apertura_activa) {
        this.MostrarApertura = true;
        localStorage.setItem("Apertura_Consultor", "");
      }else{
        this.MostrarApertura = false;
        localStorage.setItem("Apertura_Consultor", data.query_data.Id_Consultor_Apertura_Cuenta);
      }
    });
  }

  public ShowTablero(){
    this.MostrarApertura = false;
  }

  public ShowAperturaCuentas($event){
    this.MostrarApertura = true;

  }

}
