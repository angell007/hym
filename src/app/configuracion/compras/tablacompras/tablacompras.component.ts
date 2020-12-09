import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Globales } from '../../../shared/globales/globales';
import { CompraService } from '../../../shared/services/compra/compra.service';
import { CambioService } from '../../../shared/services/cambio.service';

@Component({
  selector: 'app-tablacompras',
  templateUrl: './tablacompras.component.html',
  styleUrls: ['./tablacompras.component.scss', '../../../../style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TablacomprasComponent implements OnInit, OnChanges {

  @Input() Id_Moneda:string = '';
  @Input() CodigoMoneda:string = '';

  @Output() ActualizarCompra:EventEmitter<Array<any>> = new EventEmitter();
  @Output() MostrarSwal = new EventEmitter();

  public ComprasPendientes:Array<any> = [];
  private ComprasSeleccionadas:Array<any> = [];
  public msgObj:any= {
    type: 'warning',
    title: 'Alerta',
    msg: 'Mensaje prueba'
  };

  constructor(public compraService:CompraService) { }

  ngOnChanges(changes:SimpleChanges){
    
    if (changes.Id_Moneda.previousValue != undefined) {
      this.CargaInicial();
    }
  }

  ngOnInit() {
    this.CargaInicial();
  }

  CargaInicial(){
    
    if(!this.VerificarMoneda()){
      return;
    }

    this.ConsultarComprasPendientes();
  }

  ConsultarComprasPendientes(){
    this.compraService.getComprasPendientes(this.Id_Moneda).subscribe((data:any) => {

      // console.log(data);
      
      if (data.codigo == 'success') {
        
        this.ComprasPendientes = data.compras_pendientes;
      }else{
        this.ComprasPendientes = [];
        this.msgObj.type = data.codigo;
        this.msgObj.type = data.title;
        this.msgObj.msg = data.mensaje;

        this.MostrarSwal.emit(this.msgObj);
      }
    });
  }

  VerificarMoneda():boolean{   
    if (this.Id_Moneda == '') {
      this.msgObj.type = 'warning';
      this.msgObj.title = 'Alerta';
      this.msgObj.msg = 'Debe escoger una moneda para consultar las compras pendientes!';
      
      this.MostrarSwal.emit(this.msgObj);      
      
      return false;
    }

    return true;
  }

  SeleccionarCompra(seleccionado, idCuenta, listIndex){        

    if(seleccionado == '0'){
      this.ComprasPendientes[listIndex].Seleccionado = '1';
      let compraObj = this.ComprasPendientes.find(x => x.Id_Compra_Cuenta == idCuenta);
      this.ComprasSeleccionadas.push(compraObj);

    }else{
      
      this.ComprasPendientes[listIndex].Seleccionado = '0';
      let compraInd = this.ComprasSeleccionadas.findIndex(x => x.Id_Compra_Cuenta == idCuenta);
      this.ComprasSeleccionadas.splice(compraInd, 1);
    }

    this.ActualizarCompra.emit(this.ComprasSeleccionadas);
  }

}
