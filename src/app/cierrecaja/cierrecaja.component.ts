import { Component, OnInit, ViewChild } from '@angular/core';
import { log } from 'util';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { forEach } from '@angular/router/src/utils/collection';
import { Funcionario } from '../shared/funcionario/funcionario.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cierrecaja',
  templateUrl: './cierrecaja.component.html',
  styleUrls: ['./cierrecaja.component.scss']
})
export class CierrecajaComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal:any;

  

  id_funcionario = this.activeRoute.snapshot.params["id_funcionario"];
  solo_ver = this.activeRoute.snapshot.params["solo_ver"];
  public Nombre_Funcionario:string = '';

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
    Id_Funcionario: this.id_funcionario,
    Caja_Cierre: this.Id_Caja == '' ? 0 : this.Id_Caja,
    Oficina_Cierre: this.Id_Oficina == '' ? 0 : this.Id_Oficina,
    Observacion: ''
  };
  public entregardiferencia:any = [];
  public MostrarTotal:any = [];
  public InhabilitarBotonGuardar = true;
  public ValoresMonedasApertura:any = [];

  constructor(public globales:Globales, private cliente:HttpClient, public router:Router, public activeRoute:ActivatedRoute) {
   }

  ngOnInit() {
    this.GetRegistroDiario();
    this.ConsultarTotalesCierre();  
    this.ConsultarNombreFuncionario();  
    console.log(this.solo_ver);
      
  }

  ConsultarNombreFuncionario(){
    this.cliente.get(this.globales.ruta+'php/funcionarios/get_nombre_funcionario.php', {params: {id_funcionario:this.id_funcionario}}).subscribe((data:any)=>{
      
      if (data.codigo == 'success') {
        this.Nombre_Funcionario = data.nombre_funcionario;
        
      }else{

        this.Nombre_Funcionario = '';
        this.ShowSwal(data.codigo, 'Error', data.mensaje);
      }
    });
  }

  ConsultarTotalesCierre(){
    this.cliente.get(this.globales.ruta+'php/cierreCaja/Cierre_Caja_Nuevo.php', {params: {id:this.id_funcionario}}).subscribe((data:any)=>{
      
      this.MonedasSistema = data.monedas;
      let t = data.totales_ingresos_egresos;
      for (const k in t) {
        
        let arr = t[k];
        this.Totales[k] = arr;
      }

      setTimeout(() => {        
        this.ArmarCeldasTabla();
      }, 1000);

    });
  }

  ArmarCeldasTabla(){
    
    if (this.MonedasSistema.length > 0) {
      this.MonedasSistema.forEach((m,i) => {
        let color = i % 2 == 0 ? '#d3d3d3': '#ffffff';
        let celda_i = {Nombre_Celda:'Ingresos', Color:color};
        let celda_e = {Nombre_Celda:'Egresos', Color:color};
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

      this.MonedasSistema.forEach((moneda, i) => {
        let objMoneda = this.SumatoriaTotales[moneda.Nombre];
        let monto_inicial_moneda = this.ValoresMonedasApertura[i];        
        let color = i % 2 == 0 ? '#d3d3d3': '#ffffff';
        let obj_total_ing = {Total:objMoneda.Ingreso_Total.toFixed(2), Color:color};
        let obj_total_eg = {Total:objMoneda.Egreso_Total.toFixed(2), Color:color};
        this.MostrarTotal.push(obj_total_ing);
        this.MostrarTotal.push(obj_total_eg);
        
        this.TotalesIngresosMonedas.push(objMoneda.Ingreso_Total.toFixed(2));
        this.TotalesEgresosMonedas.push(objMoneda.Egreso_Total.toFixed(2));

        let suma_inicial_ingreso = parseFloat(objMoneda.Ingreso_Total) + parseFloat(monto_inicial_moneda);

        this.TotalRestaIngresosEgresos.push((suma_inicial_ingreso - objMoneda.Egreso_Total).toFixed(2));
      });

      console.log(this.MostrarTotal);

      this.MonedasSistema.forEach((m,i) => {
        let obj = {Moneda:m.Id_Moneda, Entregado:"", Codigo:m.Codigo, Nombre:m.Nombre};
        this.TotalEntregado.push(obj);

        let obj1 = {Moneda:m.Id_Moneda, Diferencia:0, Codigo:m.Codigo, Nombre:m.Nombre};
        this.Diferencias.push(obj1);
      });

      this.AsignarFieldsDisabled();

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
    }else if (this.CierreCajaModel.Observacion == '') {      
      this.ShowSwal('warning', 'Alerta', 'Debe colocar la observacion antes de realizar el cierre de caja!');
    }else{
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
      data.append("funcionario", this.id_funcionario);
      data.append("resumen_movimientos", resumen);

      this.cliente.post(this.globales.ruta + 'php/diario/guardar_cierre_caja.php', data).subscribe((data: any) => {

        if (data.tipo == 'error') {
          
          this.ShowSwal(data.tipo, 'Error', data.mensaje);
        }else{
          
          this.LimpiarModelos();
          //this.ShowSwal('success', 'Registro Exitoso!', 'Se guardó el cierre correctamente!');
          this.ShowSwal(data.tipo, 'Registro Exitoso', data.mensaje);
          this.salir();
        }
      });
    }
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

    let entregar = total_entregar < 0 ? (total_entregar * -1) : total_entregar;
    let resta = (value - entregar).toFixed(2);
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

  AsignarFieldsDisabled(){
    this.TotalRestaIngresosEgresos.forEach(valor => {
      console.log(valor);
      
      if (valor == 0 || valor == '') {
        this.FieldsDisabled.push(true);
      }else{
        this.FieldsDisabled.push(false);
      }
    });

    console.log(this.FieldsDisabled);
  }

  InhabilitarBoton(){
    for (let index = 0; index < this.TotalRestaIngresosEgresos.length; index++) {
      if (this.TotalRestaIngresosEgresos[index] != 0) {
        this.InhabilitarBotonGuardar = false;
      }      
    }
  }

  GetRegistroDiario(){
      
    this.cliente
      .get(this.globales.ruta + 'php/diario/get_valores_diario.php', { params: { id: this.id_funcionario } })
      .subscribe((data:any) => {
        data.valores_diario.forEach((valores,i) => {
          this.ValoresMonedasApertura.push(valores.Valor_Moneda_Apertura);
        });
        console.log(this.ValoresMonedasApertura);
        
    });
  }

  salir() {
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    localStorage.removeItem("Banco");
    localStorage.removeItem('Perfil');
    localStorage.setItem('CuentaConsultor', '');
    localStorage.setItem('MonedaCuentaConsultor', '');
    this.router.navigate(["/login"]);
  }
}
