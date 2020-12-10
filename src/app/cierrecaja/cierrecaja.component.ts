import { Component, OnInit, ViewChild } from '@angular/core';
import { log } from 'util';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../shared/globales/globales';
import { forEach } from '@angular/router/src/utils/collection';
import { Funcionario } from '../shared/funcionario/funcionario.model';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../shared/services/general/general.service';
import { NuevofuncionarioService } from '../shared/services/funcionarios/nuevofuncionario.service';
import { type } from 'jquery';

@Component({
  selector: 'app-cierrecaja',
  templateUrl: './cierrecaja.component.html',
  styleUrls: ['./cierrecaja.component.scss']
})
export class CierrecajaComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal: any;



  id_funcionario = this.activeRoute.snapshot.params["id_funcionario"];
  public solo_ver: boolean = this.activeRoute.snapshot.params["solo_ver"];
  public fechaSoloVer: string = this.activeRoute.snapshot.params["fechaSoloVer"];
  public Nombre_Funcionario: string = '';

  public Funcionario = JSON.parse(localStorage['User']);
  public Id_Caja = JSON.parse(localStorage['Caja']);
  public Id_Oficina = JSON.parse(localStorage['Oficina']);
  public Modulos: Array<string> = []; public MonedasSistema: any = [];
  public Totales: any = [];
  public CeldasIngresoEgresoEncabezado: any = [];
  public CeldasIngresoEgresoValores: any = [];
  public SumatoriaTotales: any = [];
  public TotalesIngresosMonedas: any = [];
  public TotalesEgresosMonedas: any = [];
  public TotalRestaIngresosEgresos = [];
  public max_cel_colspan = 0;
  public TotalEntregado: any = [];
  public Diferencias: any = [];
  public FieldsDisabled: Array<boolean> = [];
  public Armado = false;
  public observaciones = '';
  private ResumenMovimiento: any = [];
  public CierreCajaModel: any = {
    Id_Funcionario: this.id_funcionario,
    Caja_Cierre: this.Id_Caja == '' ? 0 : this.Id_Caja,
    Oficina_Cierre: this.Id_Oficina == '' ? 0 : this.Id_Oficina,
    Observacion: ''
  };
  public entregardiferencia: any = [];
  public MostrarTotal: any = [];
  public InhabilitarBotonGuardar = true;
  public ValoresMonedasApertura: any = [];
  public sizeColunm: any = 0 + '%';
  public flagLimites: boolean = false;
  public customModulos = [];
  public valores = [
    '$50.000',
    '$20.000',
    '$10.000',
    '$5.000',
    '$2.000',
    '$1.000']

  constructor(public globales: Globales, private cliente: HttpClient, public router: Router, public activeRoute: ActivatedRoute, private _generalService: GeneralService, private _funcionarioService: NuevofuncionarioService) {
  }

  ngOnInit() {
    this.GetRegistroDiario();
    this.ConsultarTotalesCierre();
    this.ConsultarNombreFuncionario();

  }

  ConsultarNombreFuncionario() {
    this.cliente.get(this.globales.ruta + 'php/funcionarios/get_nombre_funcionario.php', { params: { id_funcionario: this.id_funcionario } }).subscribe((data: any) => {

      if (data.codigo == 'success') {
        this.Nombre_Funcionario = data.nombre_funcionario;

      } else {

        this.Nombre_Funcionario = '';
        this.ShowSwal(data.codigo, 'Error', data.mensaje);
      }
    });
  }

  ConsultarTotalesCierre() {
    let p: any = { id: this.id_funcionario };
    if (this.solo_ver) {
      p.fecha = this.fechaSoloVer;
    }

    this.cliente.get(`${this.globales.rutaNueva}cierre-caja`, { params: p }).subscribe((data: any) => {

      console.log(data);

      this.Modulos = data;
    });
  }


  GuardarCierre() {
    if (!this.ValidarMontos()) {
      return;
    } else if (!this.ValidarDiferencias()) {
      return;
    } else {
      this.ArmarResumenMovimientos();
      console.log(this.ResumenMovimiento);

      let entregado = JSON.stringify(this.TotalEntregado);
      let diferencias = JSON.stringify(this.Diferencias);
      let resumen = JSON.stringify(this.ResumenMovimiento);
      let model = JSON.stringify(this.CierreCajaModel);
      let data = new FormData();

      data.append("entregado", entregado);
      data.append("diferencias", diferencias);
      data.append("modelo", model);
      data.append("funcionario", this.id_funcionario);

      this.cliente.post(this.globales.ruta + 'php/diario/guardar_cierre_caja.php', data).subscribe((data: any) => {

        if (data.tipo == 'error') {

          this.ShowSwal(data.tipo, 'Error', data.mensaje);
        } else {

          this.LimpiarModelos();
          this.ShowSwal(data.tipo, 'Registro Exitoso', data.mensaje);
          this.salir();
        }
      });
    }
  }

  ValidarMontos() {


    // this.Diferencias[pos]

    for (let index = 0; index < this.Modulos.length; index++) {

      if (this.Diferencias[index] < 0) {
        console.log(this.Diferencias[index]);
      }

      // if (this.Modulos[index] != 0) {
      //   if (this.TotalEntregado[index].Entregado == 0) {
      //     this.ShowSwal('warning', 'Alerta', 'Debe colocar el valor entregado en ' + this.TotalEntregado[index].Nombre);
      //     return false;
      //   }
      // }
    }

    return true;
  }

  ValidarDiferencias() {

    for (let index = 0; index < this.Diferencias.length; index++) {
      if (this.Diferencias[index].Diferencia < 0) {
        this.ShowSwal('warning', 'Alerta', 'No puede tener diferencias negativas!');
        return false;
      }
    }

    return true;
  }


  CalcularSumaImput(ingresado, calculado, pos) {

    let saldo = 0;

    const elementos = Array.from(document.querySelectorAll('.input_pesos'))
    elementos.forEach(function (input, index) {

      switch (index) {
        case 0:

          saldo += input['value'] * 100 * 100000
          break;
        case 1:

          saldo += input['value'] * 100 * 50000
          break;
        case 2:

          saldo += input['value'] * 100 * 20000
          break;
        case 3:

          saldo += input['value'] * 100 * 10000
          break;
        case 4:

          saldo += input['value'] * 50 * 100000
          break;
        case 5:

          saldo += input['value'] * 50 * 50000
          break;
        case 6:

          saldo += input['value'] * 50 * 20000
          break;
        case 7:

          saldo += input['value'] * 50 * 10000
          break;
        case 8:

          saldo += input['value'] * 100000
          break;
        case 9:

          saldo += input['value'] * 50000
          break;
        case 10:

          saldo += input['value'] * 20000
          break;
        case 11:

          saldo += input['value'] * 10000
          break;

        case 12:

          saldo += input['value'] * 1
          break;

        default:
          break;
      }

    });

    this.CalcularDiferencia(saldo, calculado, pos)

  }


  CalcularDiferencia(ingresado, calculado, pos) {


    if (calculado == '') {
      return false;
    }

    let resta = ingresado - calculado;


    this.Diferencias[pos] = resta;


    // let montos = Array.of(JSON.parse(localStorage.getItem('Montos')));
    // montos[0].forEach((element, index) => {
    //   if (element['Id_Moneda'] === this.Diferencias[pos]['Moneda']) {
    //     console.log(element['Monto'] < value);
    //     if (parseFloat(element['Monto']) < parseFloat(value)) {
    //       this.flagLimites = true
    //     }
    //   }
    // });

    // if (this.flagLimites) {
    //   this.flagLimites = false;
    //   this.ShowSwal('warning', 'Alerta', 'La cantidad digitada supera los limites para esta oficina');
    //   this.Diferencias[pos].Diferencia = -1;
    //   return false;
    // }

    // if (value == '') {
    //   this.Diferencias[pos].Diferencia = 0;
    //   return;
    // } else {
    //   value = parseFloat(value);
    // }

    // let total_entregar = this.TotalRestaIngresosEgresos[pos] != '' ? parseFloat(this.TotalRestaIngresosEgresos[pos]) : 0;
    // let entregar = total_entregar;


    // let resta = value - entregar;
    // this.Diferencias[pos].Diferencia = resta;
  }

  ArmarResumenMovimientos() {
    this.Modulos.forEach((modulo, i) => {
      this.ResumenMovimiento[i] = [];

      let ind = 0;
      this.MonedasSistema.forEach(moneda => {

        let obj = this.Totales[modulo];
        let monObj = obj.filter(x => x.Moneda_Id == moneda.Id_Moneda);

        let objResumen = { "Valor": monObj[0].Ingreso_Total, "Moneda": moneda.Id_Moneda, "Tipo": "Ingreso", "Modulo": modulo };
        let objResumen2 = { "Valor": monObj[1].Egreso_Total, "Moneda": moneda.Id_Moneda, "Tipo": "Egreso", "Modulo": modulo };

        this.ResumenMovimiento[i].push(objResumen);
        this.ResumenMovimiento[i].push(objResumen2);
        ind += 2;
      });
    });
  }

  //MOSTRAR ALERTAS DESDE LA INSTANCIA DEL SWEET ALERT GLOBAL
  ShowSwal(tipo: string, titulo: string, msg: string) {
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

  LimpiarModelos() {

  }

  AsignarFieldsDisabled() {
    this.TotalRestaIngresosEgresos.forEach(valor => {
      // console.log(valor);

      if (valor == 0 || valor == '') {
        this.FieldsDisabled.push(true);
      } else {
        this.FieldsDisabled.push(false);
      }
    });
  }

  InhabilitarBoton() {
    for (let index = 0; index < this.TotalRestaIngresosEgresos.length; index++) {
      if (this.TotalRestaIngresosEgresos[index] != 0) {
        this.InhabilitarBotonGuardar = false;
      }
    }
  }

  GetRegistroDiario() {

    this.cliente
      .get(this.globales.ruta + 'php/diario/get_valores_diario.php', { params: { id: this.id_funcionario } })
      .subscribe((data: any) => {
        console.log(data);
        data.valores_diario.forEach((valores, i) => {
          this.ValoresMonedasApertura.push(valores.Valor_Moneda_Apertura);
        });
      });
  }

  salir() {
    this._registrarCierreSesion();
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    localStorage.removeItem("Banco");
    localStorage.removeItem('Perfil');
    localStorage.setItem('CuentaConsultor', '');
    localStorage.setItem('MonedaCuentaConsultor', '');
    this.router.navigate(["/login"]);
  }

  private _registrarCierreSesion() {
    let data = new FormData();
    data.append('id_funcionario', this._generalService.Funcionario.Identificacion_Funcionario);
    this._funcionarioService.LogCierreSesion(data).subscribe();
  }

  isEqual(str1: string, str2: string) {
    return str1.toUpperCase() === str2.toUpperCase()
  }

  reduce(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Ingreso_Total) - parseFloat(element.Egreso_Total)
    })
    return suma;
  }
  Ingresos(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Ingreso_Total)
    })
    return suma;
  }
  Egresos(a) {
    let suma = 0;
    a.forEach((element) => {
      suma += parseFloat(element.Egreso_Total)
    })
    return suma;
  }

  validate(a) {
    let validate = false;
    a.forEach((element) => {
      if (element.Ingreso_Total != 0 || element.Egreso_Total != 0) {
        validate = true;
      }
    })
    return validate;
  }
}