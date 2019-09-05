import { Component, OnInit } from '@angular/core';
import { CuentabancariaService } from '../../../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../../../shared/services/general/general.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cierrecuentasconsultor',
  templateUrl: './cierrecuentasconsultor.component.html',
  styleUrls: ['./cierrecuentasconsultor.component.scss', '../../../../style.scss']
})
export class CierrecuentasconsultorComponent implements OnInit {

  public CuentasBancarias:Array<any> = [];
  public Nombre_Funcionario:string = "Juan Perez";
  public Cargando:boolean = false;
  public Id_Funcionario:string =  this._activeRoute.snapshot.params["id_funcionario"];

  constructor(private _cuentaBancariaService:CuentabancariaService,
              public generalService:GeneralService,
              private _activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.GetCuentasBancariasApertura();
  }

  public GetCuentasBancariasApertura(){
    this.Cargando = true;
    this._cuentaBancariaService.GetCuentasBancariasCierre(this.Id_Funcionario).subscribe((data:any) => {
      console.log(data);
      if (data.codigo == 'success') {
        this.Cargando = false;
        this.CuentasBancarias = data.query_data;
      }else{
        this.CuentasBancarias = [];
      }
    });
  }

}
