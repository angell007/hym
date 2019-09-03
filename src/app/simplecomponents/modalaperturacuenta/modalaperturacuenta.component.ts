import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CuentabancariaService } from '../../shared/services/cuentasbancarias/cuentabancaria.service';
import { Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';
import { GeneralService } from '../../shared/services/general/general.service';
import { SwalService } from '../../shared/services/swal/swal.service';

@Component({
  selector: 'app-modalaperturacuenta',
  templateUrl: './modalaperturacuenta.component.html',
  styleUrls: ['./modalaperturacuenta.component.scss', '../../../style.scss']
})
export class ModalaperturacuentaComponent implements OnInit {

  @Input() AbrirModal:Observable<any> = new Observable();
  @Output() EnviarCuentasSeleccionadas:EventEmitter<any> = new EventEmitter();
  public openSubscription:any;
  
  @ViewChild('ModalAperturaCuenta') ModalAperturaCuenta:any;

  public CuentasBancarias:Array<any> = [];
  public CuentasBancariasSeleccionadas:Array<any> = [];
  public CuentasBancariasSeleccionadasId:Array<string> = [];
  public Cargando:boolean = false;

  constructor(private _cuentaBancariaService:CuentabancariaService,
              public generalService:GeneralService,
              private _swalService:SwalService) { }

  ngOnInit() {
    this.openSubscription = this.AbrirModal.subscribe((data:any) => {
      console.log("abriendo modal apertura cuenta");

      this.GetCuentasBancariasApertura();      
      this.ModalAperturaCuenta.show();
    });
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

  public SeleccionarCuenta(seleccionada:string, cuenta:any){
    console.log(cuenta);
    
    if (seleccionada == '0') {
      let ind = this.CuentasBancarias.findIndex(x => x.Id_Cuenta_Bancaria == cuenta.Id_Cuenta_Bancaria);    
      if (ind > -1) {
        this.CuentasBancariasSeleccionadas.push(cuenta);
        this.CuentasBancariasSeleccionadasId.push(cuenta.Id_Cuenta_Bancaria);
        this.CuentasBancarias[ind].Seleccionada = '1';
        this.CuentasBancarias[ind].Habilitar_Monto = '1';
        console.log(this.CuentasBancariasSeleccionadas);
        console.log(this.CuentasBancariasSeleccionadasId);        
      }
    }else{
      let eliminar = this.CuentasBancariasSeleccionadas.findIndex(x => x.Id_Cuenta_Bancaria == cuenta.Id_Cuenta_Bancaria);
      if (eliminar > -1) {
        this.CuentasBancariasSeleccionadas.splice(eliminar, 1);
      }
      
      let eliminar2 = this.CuentasBancariasSeleccionadasId.findIndex(x => x == cuenta.Id_Cuenta_Bancaria);
      if (eliminar2 > -1) {
        this.CuentasBancariasSeleccionadasId.splice(eliminar, 1);
      }
      
      let ind = this.CuentasBancarias.findIndex(x => x.Id_Cuenta_Bancaria == cuenta.Id_Cuenta_Bancaria);    
      if (ind > -1) {
        this.CuentasBancarias[ind].Seleccionada = '0';
        this.CuentasBancarias[ind].Habilitar_Monto = '0';
        this.CuentasBancarias[ind].Monto_Apertura = '0';
      }
      console.log(this.CuentasBancariasSeleccionadas);
      console.log(this.CuentasBancariasSeleccionadasId);  
    }
  }

  public GuardarAperturaCuentas(){
    let data = new FormData();
    data.append('cuentas', this.generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadasId)));
    data.append('modelo_cuentas', this.generalService.normalize(JSON.stringify(this.CuentasBancariasSeleccionadas)));
    data.append('id_funcionario', this.generalService.Funcionario.Identificacion_Funcionario);
    data.append('modulo', 'Tablero Consultor');

    this._cuentaBancariaService.AperturaCuentaBancaria(data).subscribe((d:any) => {
      console.log(d);
      if (d.codigo == 'success') {
        this._swalService.ShowMessage(d);
        this.EnviarCuentasSeleccionadas.emit(this.CuentasBancariasSeleccionadas);
        this.ModalAperturaCuenta.hide();
        this._limpiarListas();
      }else{
        this._swalService.ShowMessage(d);
      }
      
    });
  }

  private _limpiarListas(){
    this.CuentasBancarias = [];
    this.CuentasBancariasSeleccionadas = [];
    this.CuentasBancariasSeleccionadasId = [];
  }

  public CerrarModal(){
    console.log("cerrando modal");
    
  }

}
