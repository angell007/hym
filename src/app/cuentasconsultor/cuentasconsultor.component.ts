import { Component, OnInit } from '@angular/core';
import { CuentabancariaService } from '../shared/services/cuentasbancarias/cuentabancaria.service';
import { GeneralService } from '../shared/services/general/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../shared/services/swal/swal.service';

@Component({
  selector: 'app-cuentasconsultor',
  templateUrl: './cuentasconsultor.component.html',
  styleUrls: ['./cuentasconsultor.component.scss']
})
export class CuentasconsultorComponent implements OnInit {

  public CuentasBancarias:Array<any> = [];
  public Nombre_Funcionario:string = "Nombre Consultor";
  public Cargando:boolean = false;
  public Id_Funcionario:string =  this._activeRoute.snapshot.params["id_funcionario"];
  public Id_Apertura:any =  localStorage.getItem('Apertura_Consultor');

  constructor(private _cuentaBancariaService:CuentabancariaService,
              public generalService:GeneralService,
              private _activeRoute:ActivatedRoute,
              private _route:Router,
              private _swalService:SwalService) { }

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

  public VerMovimientos(idCuentaBancaria:string){
    this._route.navigate(['/detallemovimientoscuenta', idCuentaBancaria, 'Ver']);
  }

  public AjustarCuenta(idCuentaBancaria:string){
    this._route.navigate(['/detallemovimientoscuenta', idCuentaBancaria, 'Ajustar']);
  }

  public VolverATablero(){    
    this._route.navigate(["/tablero"]);
  }

}
