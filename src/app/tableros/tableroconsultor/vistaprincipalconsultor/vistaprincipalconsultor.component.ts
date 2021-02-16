import { Component, OnInit } from '@angular/core';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';

@Component({
  selector: 'app-vistaprincipalconsultor',
  templateUrl: './vistaprincipalconsultor.component.html',
  styleUrls: ['./vistaprincipalconsultor.component.scss']
})
export class VistaprincipalconsultorComponent implements OnInit {

  public MostrarApertura:boolean = false;
  public Cargado:boolean = false;
  public MostrarConsultor:boolean = false;
  public MostrarVisualConsultor:boolean = false;

  constructor(private _cuentaBancariaService:CuentabancariaService,
              private _generalService:GeneralService) 
  {
    // if (JSON.parse(localStorage.getItem('CuentasDescuadradas')) == []) {
      // localStorage.setItem("Volver_Apertura", "Si"); 
    // }
  }

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
      // console.log(data);
      
      if (!data.apertura_activa) {
        console.log('MostrarApertura');
        this.MostrarApertura = true;
        this.Cargado = true;
        localStorage.setItem("Apertura_Consultor", "");
        localStorage.setItem("Volver_Apertura", "Si"); 
      }else{
        console.log('MostrarConsultor');
        
        this.MostrarConsultor = true;
        this.Cargado = true;
        localStorage.setItem("Volver_Apertura", "No"); 
        localStorage.setItem("Apertura_Consultor", data.query_data.Id_Diario_Consultor);
      }
    });
  }

  public ShowTablero($event){
  //  this.MostrarApertura = false;
  console.log('show',$event);
    this.setViews();    
    if($event == 'Consultor'){

      this.MostrarConsultor = true;
    }else{
      this.MostrarVisualConsultor = true;
      
    }

  }

  public ShowAperturaCuentas($event){
    this.setViews();    
    this.MostrarApertura = true;

  }

  public setViews(){
    this.MostrarApertura = false;
    this.MostrarVisualConsultor = false;
    this.MostrarConsultor = false;
  }


}
