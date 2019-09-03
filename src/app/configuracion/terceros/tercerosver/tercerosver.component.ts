import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../../shared/globales/globales';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { TerceroService } from '../../../shared/services/tercero/tercero.service';
import { ToastService } from '../../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-tercerosver',
  templateUrl: './tercerosver.component.html',
  styleUrls: ['./tercerosver.component.scss']
})
export class TercerosverComponent implements OnInit {

  id = this.route.snapshot.params["id"];
  public TotalesMonedas:Array<any> = [];
  // Tercero:any = {};
  // MovimientosTercero =[];
  // SaldoActual: any;
  // Monedas=[];

  // @ViewChild('ModalAjuste') ModalAjuste: any;
  // @ViewChild('confirmacionSwal') confirmacionSwal: any;  

  constructor(private route: ActivatedRoute,
              private http : HttpClient, 
              private globales: Globales,
              private _terceroService:TerceroService,
              private _toastService:ToastService) { }

  ngOnInit() {
    //this.GetTotalesMonedas();
  }

  GetTotalesMonedas(){
    this._terceroService.getTotalesMonedasTercero(this.id).subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.TotalesMonedas = data.query_data;
      }else{
        this.TotalesMonedas = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

//   SaldoPesos=[];
//   SaldoBolivar =[];
//   actualizarVista(){
//     this.http.get(this.globales.ruta+'php/terceros/detalle_tercero.php',{
//       params:{id:this.id}
//     }).subscribe((data:any)=>{
//       this.Tercero = data;  
//     });

//     this.http.get(this.globales.ruta+'php/genericos/lista_generales.php',{
//       params:{modulo : "Moneda"}
//     }).subscribe((data:any)=>{
//       this.Monedas = data;  
//     });

//     this.http.get(this.globales.ruta + 'php/movimientos/movimiento_tercero.php', {
//       params: { id: this.id }
//     }).subscribe((data: any) => {
//       this.MovimientosTercero = data.lista;
// //console.log(data.lista)
//       this.SaldoActual = data.total;
//       this.SaldoPesos = data.totalPeso;
//       this.SaldoBolivar = data.totalBolivar;
//     });
//   }

//   GuardarMovimiento(formulario: NgForm, modal) {
//     formulario.value.Id_Tercero = this.id;
//     let info = JSON.stringify(formulario.value);
//     let datos = new FormData();
//     datos.append("modulo", 'Movimiento_Tercero');
//     datos.append("datos", info);
//     datos.append("Id_Tercero",this.id);
//     datos.append("Id_Movimiento_Tercero",this.idItem);
//     this.http.post(this.globales.ruta + 'php/terceros/guardar_ajuste_tercero.php', datos)
//       .subscribe((data: any) => {
//        formulario.reset();
//         modal.hide();
//         this.actualizarVista();
//         this.confirmacionSwal.title = "Movimiento Realizado"
//         this.confirmacionSwal.text = "Se ha guardado correctamente el movimiento"
//         this.confirmacionSwal.type = "success";
//         this.confirmacionSwal.show();
//       });
//   }

//   idItem: any;
//   ajusteBancario:any = {};
//   editarAjuste(id, modal) {
//     this.idItem = id;
//     this.http.get(this.globales.ruta + 'php/genericos/detalle.php', {
//       params: { id: id, modulo: "Movimiento_Tercero" }
//     }).subscribe((data: any) => {
//       this.ajusteBancario = data;
//     });
//     modal.show();
//   }

//   borrarAjuste(id) {
//     let datos = new FormData();
//     datos.append("modulo", 'Movimiento_Tercero');
//     datos.append("id", id);
//     this.http.post(this.globales.ruta + 'php/genericos/eliminar_generico.php', datos)
//       .subscribe((data: any) => {
//         this.actualizarVista();
//         this.confirmacionSwal.title = "Movimiento Eliminado"
//         this.confirmacionSwal.text = "Se ha eliminado el ajuste"
//         this.confirmacionSwal.type = "success";
//         this.confirmacionSwal.show();
//       });
//   }

//   crear(){
//     this.ModalAjuste.show();
//     var today = new Date();
//     var dd = today.getDate();
//     var mm = today.getMonth()+1; //January is 0!
//     var yyyy = today.getFullYear();
//     var hoy = yyyy+'-'+mm+'-'+dd;
//     (document.getElementById("datefield") as HTMLInputElement).setAttribute("max",hoy);
//   }

}
