import { Component, OnInit, ViewChild } from '@angular/core';
import { log } from 'util';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { forEach } from '@angular/router/src/utils/collection';
import { Funcionario } from '../shared/funcionario/funcionario.model';

@Component({
  selector: 'app-cierrecaja',
  templateUrl: './cierrecaja.component.html',
  styleUrls: ['./cierrecaja.component.scss']
})
export class CierrecajaComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal:any;

  public Funcionario = JSON.parse(localStorage['User']);
  public Id_Caja = JSON.parse(localStorage['Caja']);
  public Id_Oficina = JSON.parse(localStorage['Oficina']);
  public Modulos:Array<string> = ['Cambios','Transferencias','Giros','Traslados','Corresponsal Bancario','Servicios Externos'];
  public MonedasSistema:any = [];
  public Totales:any =[];
  public CeldasIngresoEgresoEncabezado:any = [];
  public CeldasIngresoEgresoValores:any = [];
  public SumatoriaTotales:any = [];
  public TotalesIngresosMonedas:any = [];
  public TotalesEgresosMonedas:any = [];
  public TotalRestaIngresosEgresos = [];
  public max_cel_colspan = 0;
  public TotalEntregado:any = [];
  public Diferencias:any = [];
  public FieldsDisabled:Array<boolean> = [];
  public Armado = false;
  public observaciones = '';
  private ResumenMovimiento:any = [];
  public CierreCajaModel:any = {
    Id_Funcionario: this.Funcionario.Identificacion_Funcionario,
    Caja_Cierre: this.Id_Caja == '' ? 0 : this.Id_Caja,
    Oficina_Cierre: this.Id_Oficina == '' ? 0 : this.Id_Oficina,
    Observacion: ''
  };
  public entregardiferencia:any = [];

  constructor(public globales:Globales, private cliente:HttpClient) { }

  ngOnInit() {
    this.ConsultarTotalesCierre();

    setTimeout(() => {
      this.ArmarCeldasTabla();  
    }, 1000);
    
  }

  ConsultarTotalesCierre(){
    this.cliente.get(this.globales.ruta+'php/cierreCaja/Cierre_Caja_Nuevo.php', {params: {id:this.Funcionario.Identificacion_Funcionario}}).subscribe((data:any)=>{
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

    if (this.Modulos.length > 0) {
      this.Modulos.forEach(modulo => {
        let ind = 0;
        this.CeldasIngresoEgresoValores[modulo] = [];

        this.MonedasSistema.forEach(moneda => {
          
          let totalesObj = this.Totales.filter(x => x.Modulo == modulo && x.Moneda_Id == moneda.Id_Moneda);
          let ing = "";
          let eg = "";
          let obj = {};
          
          if (totalesObj.length > 0) {
            if (totalesObj[0].Ingreso_Total != '') {
              ing = totalesObj[0].Ingreso_Total;
              //this.CeldasIngresoEgresoValores.push(ingreso);
            }else{
              //ing = "0";  
              //this.CeldasIngresoEgresoValores.push(ing);
            }

            if (totalesObj[0].Egreso_Total != '') {
               eg = totalesObj[0].Egreso_Total;  
              //this.CeldasIngresoEgresoValores.push(egreso);
            }else{
              //eg = "0";  
              //this.CeldasIngresoEgresoValores.push(egreso);
            }
          }else{

            /*let ingreso = {Valor_Ingreso:0};
            let egreso = {Valor_Egreso:0}; 
            this.CeldasIngresoEgresoValores.push(ingreso);
            this.CeldasIngresoEgresoValores.push(egreso);*/
            ing = "0";  
            eg = "0";  
          }

          obj = {Valor_Ingreso:ing, Valor_Egreso:eg, Codigo:moneda.Codigo};
          this.CeldasIngresoEgresoValores[modulo].push(obj);

          if (ind % 2 == 0) {

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

        if (resta == 0) {
          this.FieldsDisabled[index] = true;
        }
      });

      this.MonedasSistema.forEach((m,i) => {
        let obj = {Moneda:m.Id_Moneda, Entregado:"", Codigo:m.Codigo, Nombre:m.Nombre};
        this.TotalEntregado.push(obj);

        let obj1 = {Moneda:m.Id_Moneda, Diferencia:0, Codigo:m.Codigo, Nombre:m.Nombre};
        this.Diferencias.push(obj1);
      });      
      console.log(this.TotalesIngresosMonedas);
      console.log(this.TotalesEgresosMonedas);
      console.log(this.SumatoriaTotales);
      
      this.Armado = true;
      
    }else{
      this.Armado = true;
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

  GuardarCierre(){
    /*if (!this.ValidarMontos()) {
      return;
    }*/
    
    this.ArmarResumenMovimientos();
    console.log(this.ResumenMovimiento);
    
    let entregado = JSON.stringify(this.TotalEntregado);
    let diferencias = JSON.stringify(this.Diferencias);
    let resumen = JSON.stringify(this.ResumenMovimiento);
    let model = JSON.stringify(this.CierreCajaModel);
    let data = new FormData();
    console.log(resumen);
    data.append("entregado", entregado);
    data.append("diferencias", diferencias);
    data.append("modelo", model);
    data.append("funcionario", this.Funcionario.Identificacion_Funcionario);
    data.append("resumen_movimientos", resumen);

    this.cliente.post(this.globales.ruta + 'php/diario/guardar_cierre_caja.php', data).subscribe((data: any) => {

      if (data.tipo == 'error') {
        
        this.ShowSwal(data.tipo, 'Error', data.mensaje);
      }else{
        
        this.LimpiarModelos();
        //this.ShowSwal('success', 'Registro Exitoso!', 'Se guardó el cierre correctamente!');
        this.ShowSwal(data.tipo, 'Registro Exitoso', data.mensaje);
      }
    });
  }

  ValidarMontos(){

    for (let index = 0; index < this.TotalRestaIngresosEgresos.length; index++) {
      if (this.TotalRestaIngresosEgresos[index] != 0) {

        if (this.TotalEntregado[index].Entregado == 0) {
          this.ShowSwal('warning', 'Alerta', 'Debe colocar el valor entregado en '+this.TotalEntregado[index].Nombre);
          return false;
        }
      }      
    }

    return true;
  }

  CalcularDiferencia(value, pos){   

    if (value == '') {
      this.Diferencias[pos].Diferencia = 0;
      return;
    }else{
      value = parseFloat(value);
    }

    let total_entregar = this.TotalRestaIngresosEgresos[pos] != '' ? parseFloat(this.TotalRestaIngresosEgresos[pos]) : 0;
    //let diferencia = this.Diferencias[pos].Diferencia;

    let resta = total_entregar - value;
    this.Diferencias[pos].Diferencia = resta;
  }

  ArmarResumenMovimientos(){
    this.Modulos.forEach((modulo,i) => {
      this.ResumenMovimiento[i] = [];

      let ind = 0;
      this.MonedasSistema.forEach(moneda => {

        let ing = this.SumatoriaTotales[ind];
        let eg = this.SumatoriaTotales[(ind + 1)];
        let objResumen = { "Valor": ing.toString(), "Moneda": moneda.Id_Moneda, "Tipo": "Ingreso", "Modulo": modulo };
        let objResumen2 = { "Valor": eg.toString(), "Moneda": moneda.Id_Moneda, "Tipo": "Egreso", "Modulo": modulo };

        this.ResumenMovimiento[i].push(objResumen);
        this.ResumenMovimiento[i].push(objResumen2);
        ind+=2;
      });
    });
  }

   //MOSTRAR ALERTAS DESDE LA INSTANCIA DEL SWEET ALERT GLOBAL
  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  LimpiarModelos(){

  }
}
