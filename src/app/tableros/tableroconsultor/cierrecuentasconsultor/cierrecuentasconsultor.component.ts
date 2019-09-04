import { Component, OnInit } from '@angular/core';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';

@Component({
  selector: 'app-cierrecuentasconsultor',
  templateUrl: './cierrecuentasconsultor.component.html',
  styleUrls: ['./cierrecuentasconsultor.component.scss']
})
export class CierrecuentasconsultorComponent implements OnInit {

  public CuentasBancarias:Array<any> = [];
  public Nombre_Funcionario:string = "";
  public Cargando:boolean = false;

  constructor(private _cuentaBancariaService:CuentabancariaService,
              public generalService:GeneralService) { }

  ngOnInit() {
  }

  public GetCuentasBancariasApertura(){
    this._cuentaBancariaService.GetCuentasBancariasCierre().subscribe((data:any) => {
      console.log(data);
      
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
      }else{
        this.CuentasBancarias = [];
      }
    });
  }

}
