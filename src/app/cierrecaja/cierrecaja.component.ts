import { Component, OnInit } from '@angular/core';
import { log } from 'util';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';

@Component({
  selector: 'app-cierrecaja',
  templateUrl: './cierrecaja.component.html',
  styleUrls: ['./cierrecaja.component.scss']
})
export class CierrecajaComponent implements OnInit {

  public Funcionario_Data = JSON.parse(localStorage['User']);
  public MonedasSistema:any = [];
  public Totales:any =[];
  public CeldasIngresoEgresoEncabezado:any = [];
  public CeldasIngresoEgresoValores:any = [];
  public SumatoriaTotales:any = [];
  public TotalesIngresosMonedas:any = [];
  public TotalesEgresosMonedas:any = [];
  public TotalRestaIngresosEgresos = [];
  public Modulos:Array<string> = ['Cambios','Transferencias','Giros','Traslados','Corresponsal Bancario','Servicios Externos'];
  public max_cel_colspan = 0;

  constructor(public globales:Globales, private cliente:HttpClient) { }

  ngOnInit() {
    this.ConsultarTotalesCierre();

    setTimeout(() => {
      this.ArmarCeldasTabla();  
    }, 1000);
    
  }

  ConsultarTotalesCierre(){
    this.cliente.get(this.globales.ruta+'php/cierreCaja/Cierre_Caja_Nuevo.php', {params: {id:this.Funcionario_Data.Identificacion_Funcionario}}).subscribe((data:any)=>{
      console.log(data);
      this.MonedasSistema = data.monedas;
      this.Totales = data.totales_ingresos_egresos;
    });
  }

  ArmarCeldasTabla(){
    
    if (this.MonedasSistema.length > 0) {
      this.MonedasSistema.forEach(m => {
        let celda_i = {Nombre_Celda:'Ingresos'};
        let celda_e = {Nombre_Celda:'Egresos'};
        this.CeldasIngresoEgresoEncabezado.push(celda_i);
        this.CeldasIngresoEgresoEncabezado.push(celda_e);
        this.max_cel_colspan+=2;
      });      
    }

    console.log(this.max_cel_colspan);
    

    if (this.Modulos.length > 0) {
      this.Modulos.forEach(modulo => {
        let ind = 0;
        this.CeldasIngresoEgresoValores[modulo] = [];

        this.MonedasSistema.forEach(moneda => {
          
          let totalesObj = this.Totales.filter(x => x.Modulo == modulo && x.Moneda_Id == moneda.Id_Moneda);
          let ing = "0";
          let eg = "0";
          let obj = {};
          
          if (totalesObj.length > 0) {
            if (totalesObj[0].Ingreso_Total != '') {
              ing = totalesObj[0].Ingreso_Total;
              //this.CeldasIngresoEgresoValores.push(ingreso);
            }else{
              //let ing = {Valor_Ingreso:0};  
              //this.CeldasIngresoEgresoValores.push(ingreso);
            }

            if (totalesObj[0].Egreso_Total != '') {
               eg = totalesObj[0].Egreso_Total;  
              //this.CeldasIngresoEgresoValores.push(egreso);
            }else{
              //let egreso = {Valor_Egreso:0};  
              //this.CeldasIngresoEgresoValores.push(egreso);
            }
          }else{

            /*let ingreso = {Valor_Ingreso:0};
            let egreso = {Valor_Egreso:0}; 
            this.CeldasIngresoEgresoValores.push(ingreso);
            this.CeldasIngresoEgresoValores.push(egreso);*/
          }

          obj = {Valor_Ingreso:ing, Valor_Egreso:eg};
          this.CeldasIngresoEgresoValores[modulo].push(obj);
          if (ind == 0 || ind == 2) {

            if (!this.SumatoriaTotales[ind]) {
              this.SumatoriaTotales[ind] = 0;
            }
                   
            this.SumatoriaTotales[ind] += parseFloat(ing);

            if (!this.SumatoriaTotales[(ind + 1)]) {
              this.SumatoriaTotales[(ind + 1)] = 0;
            }
            this.SumatoriaTotales[(ind + 1)] += parseFloat(eg);
          }

          ind+=2;
        });
      }); 
      
      this.SumatoriaTotales.forEach((total, i) => {
        
        if (i % 2 == 0) {
          this.TotalesIngresosMonedas.push(total);  
        }else{
          this.TotalesEgresosMonedas.push(total);
        }        
      });

      this.TotalesIngresosMonedas.forEach((t,index) => {
        let resta = parseFloat(t) - parseFloat(this.TotalesEgresosMonedas[index]);
        this.TotalRestaIngresosEgresos.push(resta);
      });
      
    }
  }

  ArmarCeldasValoresTabla(){

    if (this.Totales.length > 0) {
      this.MonedasSistema.forEach(element => {
        let celdas = {Ingreso:'Ingreso', Egreso:'Egreso'};
        this.CeldasIngresoEgresoEncabezado.push(celdas);
      });
    }
  }
}
