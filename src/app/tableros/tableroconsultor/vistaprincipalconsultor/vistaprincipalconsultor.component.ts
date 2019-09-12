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
  }

  public CambiarVista(){
    this.MostrarApertura = !this.MostrarApertura;
  }

  public ConsultarAperturaFuncionario(){
    this._cuentaBancariaService.GetAperturaFuncionario(this._generalService.Funcionario.Identificacion_Funcionario).subscribe((data:any) =>{
      console.log(data);
      
      if (!data.apertura_activa) {
        this.MostrarApertura = true;
      }else{
        this.MostrarApertura = false;
        //OBTENER LAS CUENTAS DE LA APERTURA ACTUAL
        // this.Id_Apertura = data.query_data.Id_Consultor_Apertura_Cuenta;
        // this._getCuentasFuncionarioApertura();
      }
    });
  }

  public ShowTablero(){
    this.MostrarApertura = false;
  }

}
