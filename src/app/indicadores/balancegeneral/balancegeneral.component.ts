import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Globales } from '../../shared/globales/globales';
import { Router } from '@angular/router';
import { IndicadorService } from '../../shared/services/indicadores/indicador.service';
import { MonedaService } from '../../shared/services/monedas/moneda.service';
import { ToastService } from '../../shared/services/toasty/toast.service';

@Component({
  selector: 'app-balancegeneral',
  templateUrl: './balancegeneral.component.html',
  styleUrls: ['./balancegeneral.component.scss', '../../../style.scss']
})
export class BalancegeneralComponent implements OnInit {

  public Monedas:Array<any> = [];
  public ArmarTabla:boolean = false;

  constructor(private _indicadorService:IndicadorService,
              private _monedaService:MonedaService,
              private _toastService:ToastService) { }

  ListaBalance = [];
  ngOnInit() {
    this.GetMonedas();
    this.GetBalance();
  }

  GetBalance(){
    this._indicadorService.getBalanceGeneral().subscribe((data: any) => {
      this.ListaBalance = data;
      this.ArmarTabla = true;
    });
  }

  GetMonedas(){
    this._monedaService.getMonedas().subscribe((data:any) => {
      if (data.codigo == 'success') {
        this.Monedas = data.query_data;
      }else{

        this.Monedas = [];
        let toastObj = {textos:[data.titulo, data.mensaje], tipo:data.codigo, duracion:4000};
        this._toastService.ShowToast(toastObj);
      }
    });
  }

  GetNombreArray(ind:any){
    let i = 0;
    for (let index = 0; index < this.ListaBalance.length; index++) {
      
      for (const key in this.ListaBalance[index]) {
        if (ind == i) {
          return key;
        }      
        i++;
      }  
    }
  }

}
