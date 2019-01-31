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
  public Modulos:Array<string> = ['Cambios','Transferencias','Giros','Traslados','Corresponsal','Servicios'];
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
  public MostrarTotal:any = [];

  constructor(public globales:Globales, private cliente:HttpClient) { }

  ngOnInit() {
    this.ConsultarTotalesCierre();
      
  }

  ConsultarTotalesCierre(){
    this.cliente.get(this.globales.ruta+'php/cierreCaja/Cierre_Caja_Nuevo.php', {params: {id:this.Funcionario.Identificacion_Funcionario}}).subscribe((data:any)=>{
      console.log(data);
      this.MonedasSistema = data.monedas;
      let t = data.totales_ingresos_egresos;
      for (const k in t) {
        
        let arr = t[k];
        this.Totales[k] = arr;
      }

      console.log(this.Totales);

      setTimeout(() => {
        console.log("ejecutando settimeout");
        
        this.ArmarCeldasTabla();
      }, 1000);

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

      this.MonedasSistema.forEach((m) => {

        this.Modulos.forEach((mod) => {

          let obj = this.Totales[mod];
          let monObj = obj.filter(x => x.Moneda_Id == m.Id_Moneda);
          console.log(monObj[1].Egreso_Total);
          
          if (!this.SumatoriaTotales[m.Nombre]) {

            this.SumatoriaTotales[m.Nombre] = {Ingreso_Total: 0, Egreso_Total: 0};
            this.SumatoriaTotales[m.Nombre].Ingreso_Total += parseFloat(monObj[0].Ingreso_Total);
            this.SumatoriaTotales[m.Nombre].Egreso_Total += parseFloat(monObj[1].Egreso_Total);
          }else{

            this.SumatoriaTotales[m.Nombre].Ingreso_Total += parseFloat(monObj[0].Ingreso_Total);
            this.SumatoriaTotales[m.Nombre].Egreso_Total += parseFloat(monObj[1].Egreso_Total);
          }

        });
      });

      this.MonedasSistema.forEach(moneda => {
        let objMoneda = this.SumatoriaTotales[moneda.Nombre];
        this.MostrarTotal.push(objMoneda.Ingreso_Total);
        this.MostrarTotal.push(objMoneda.Egreso_Total);
        
        this.TotalesIngresosMonedas.push(objMoneda.Ingreso_Total);
        this.TotalesEgresosMonedas.push(objMoneda.Egreso_Total);

        this.TotalRestaIngresosEgresos.push(objMoneda.Ingreso_Total - objMoneda.Egreso_Total);
      });

      console.log(this.MostrarTotal);

      this.MonedasSistema.forEach((m,i) => {
        let obj = {Moneda:m.Id_Moneda, Entregado:"", Codigo:m.Codigo, Nombre:m.Nombre};
        this.TotalEntregado.push(obj);

        let obj1 = {Moneda:m.Id_Moneda, Diferencia:0, Codigo:m.Codigo, Nombre:m.Nombre};
        this.Diferencias.push(obj1);
      });

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
    if (!this.ValidarMontos()) {
      return;
    }
    
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

    let resta = value - total_entregar;
    this.Diferencias[pos].Diferencia = resta;
  }

  ArmarResumenMovimientos(){
    this.Modulos.forEach((modulo,i) => {
      this.ResumenMovimiento[i] = [];

      let ind = 0;
      this.MonedasSistema.forEach(moneda => {

        let obj = this.Totales[modulo];
        let monObj = obj.filter(x => x.Moneda_Id == moneda.Id_Moneda);

        /*let ing = this.SumatoriaTotales[ind];
        let eg = this.SumatoriaTotales[(ind + 1)];*/

        let objResumen = { "Valor": monObj[0].Ingreso_Total, "Moneda": moneda.Id_Moneda, "Tipo": "Ingreso", "Modulo": modulo };
        let objResumen2 = { "Valor": monObj[1].Egreso_Total, "Moneda": moneda.Id_Moneda, "Tipo": "Egreso", "Modulo": modulo };

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
