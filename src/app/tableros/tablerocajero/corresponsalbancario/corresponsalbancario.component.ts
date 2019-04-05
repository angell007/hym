import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../shared/services/toasty/toast.service';
import { SwalService } from '../../../shared/services/swal/swal.service';
import { CorresponsalbancarioService } from '../../../shared/services/corresponsalesbancarios/corresponsalbancario.service';

@Component({
  selector: 'app-corresponsalbancario',
  templateUrl: './corresponsalbancario.component.html',
  styleUrls: ['./corresponsalbancario.component.scss']
})
export class CorresponsalbancarioComponent implements OnInit {
  
  public CorresponsalesBancarios:Array<any> = [];
  public CorreponsalSeleccionado:string = '';

  constructor(private _toastService:ToastService,
              private _swalService:SwalService,
              private _corresponsalBancarioService:CorresponsalbancarioService) 
  {
    this.GetCorresponsalesBancarios();
  }

  ngOnInit() {    
  }

  GetCorresponsalesBancarios(){ 
    this._corresponsalBancarioService.getCorresponsales().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.CorresponsalesBancarios = data.query_data;
        if (this.CorresponsalesBancarios.length > 0) {
          this.CorreponsalSeleccionado = this.CorresponsalesBancarios[0].Id_Corresponsal_Bancario;  
        }
        
      }
    });
  }

  CambiarCorresponsal(idCorresponsal:string){
    this.CorreponsalSeleccionado = idCorresponsal;
  }
}
