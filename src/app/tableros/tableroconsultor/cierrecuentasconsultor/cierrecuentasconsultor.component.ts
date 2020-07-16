import { Component, OnInit } from '@angular/core';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';

@Component({
  selector: 'app-cierrecuentasconsultor',
  templateUrl: './cierrecuentasconsultor.component.html',
  styleUrls: ['./cierrecuentasconsultor.component.scss']
})
export class CierrecuentasconsultorComponent implements OnInit {

  public CuentasBancarias:Array<any> = [];
  public Cargando : any = false;

  constructor(private _cuentaBancariaService:CuentabancariaService) { }

  ngOnInit() {
  }

  public GetCuentasBancariasApertura(){
    this._cuentaBancariaService.GetCuentasBancariasApertura().subscribe((data:any) => {
      console.log(data);
      
      if (data.codigo == 'success') {
        this.CuentasBancarias = data.query_data;
      }else{
        this.CuentasBancarias = [];
      }
    });
  }

}
