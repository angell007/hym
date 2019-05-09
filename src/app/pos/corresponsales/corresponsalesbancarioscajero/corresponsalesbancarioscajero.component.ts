import { Component, OnInit } from '@angular/core';
import { CorresponsalDiarioModel } from '../../../Modelos/CorresponsalDiarioModel';
import { CorresponsalDiarioShortModel } from '../../../Modelos/CorresponsalDiarioShortModel';
import { GeneralService } from '../../../shared/services/general/general.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { ValidacionService } from '../../../shared/services/validaciones/validacion.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { CorresponsalbancarioService } from '../../../shared/services/corresponsalesbancarios/corresponsalbancario.service';

@Component({
  selector: 'app-corresponsalesbancarioscajero',
  templateUrl: './corresponsalesbancarioscajero.component.html',
  styleUrls: ['./corresponsalesbancarioscajero.component.scss', '../../../../style.scss']
})
export class CorresponsalesbancarioscajeroComponent implements OnInit {

  public CorresponsalModel:CorresponsalDiarioShortModel = new CorresponsalDiarioShortModel();
  public CorresponsalesBancarios:Array<any> = [];

  constructor(private _generalService: GeneralService,
              private _swalService:SwalService,
              private _validacionService:ValidacionService,
              private _toastService:ToastService,
              private _corresponsalService:CorresponsalbancarioService)
  { 
    this.GetCorresponsalesBancarios();
  }

  ngOnInit() {
  }

  GetCorresponsalesBancarios(){
    this._corresponsalService.getCorresponsales().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CorresponsalesBancarios = data.query_data;
      }else{

        this.CorresponsalesBancarios = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  public CalcularTotalCorresponsal(){
    let consignaciones = this.CorresponsalModel.Consignacion != '' ? parseFloat(this.CorresponsalModel.Consignacion) : 0;
    let retiro = this.CorresponsalModel.Retiro != '' ? parseFloat(this.CorresponsalModel.Retiro) : 0;

    if (consignaciones == 0 || retiro == 0) {
      this.CorresponsalModel.Total_Corresponsal = '0';
    }else{
      this.CorresponsalModel.Total_Corresponsal = (consignaciones - retiro).toString();
    }
  }

  public GuardarCorresponsalDiario(){
    this.CorresponsalModel.Identificacion_Funcionario = this._generalService.SessionDataModel.funcionarioData.Identificacion_Funcionario;
    this.CorresponsalModel.Id_Caja = this._generalService.SessionDataModel.idCaja;
    this.CorresponsalModel.Id_Oficina = this._generalService.SessionDataModel.idOficina;
    this.CorresponsalModel.Fecha = this._generalService.FechaActual;
    this.CorresponsalModel.Hora = this._generalService.HoraActual;

    let info = JSON.stringify(this.CorresponsalModel);
    let datos = new FormData();
    datos.append("modulo", 'Corresponsal_Diario');
    datos.append("modelo", info);
    this._corresponsalService.saveCorresponsalDiario(datos).subscribe(data => {
      if (data.codigo == 'success') {
        this.LimpiarModeloCorresponsal();
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }else{
        this._swalService.ShowMessage(data);
      }
    });
    // this.http.post(this.globales.ruta + 'php/corresponsaldiario/guardar_corresponsal_diario.php', datos).subscribe((data: any) => {
    //   this.LimpiarModeloCorresponsal();
    // });
  }

  private ValidateBeforeSubmit(){
  }

  private LimpiarModeloCorresponsal(){
    this.CorresponsalModel = new CorresponsalDiarioShortModel();
  }

}
