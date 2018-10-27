import { Component, Directive, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { NgForm } from '../../../node_modules/@angular/forms';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html',
    styleUrls: ['./common-layout.component.scss']
})

export class CommonLayoutComponent implements OnInit {

    public app: any;
    public headerThemes: any;
    public changeHeader: any;
    public sidenavThemes: any;
    public changeSidenav: any;
    public headerSelected: any;
    public sidenavSelected: any;
    public searchActived: any;
    public searchModel: any;
    public user: any;
    public changePasswordMessage: string;
    public alertas: any[];
    public alertasCajas: any[];
    public contadorTraslado = 0;
    public cierreCajaCambioIngreso = [];
    public cierreCajaCambioEgreso = [];
    public SaldoInicialPeso: number = 0;

    SumaIngresosPesos: number = 0;
    SumaIngresosBolivar: number = 0;
    SumaEgresosPesos: number = 0;
    SumaEgresosBolivar: number = 0;
    EntregadoIngresosPesos: number = 0;
    EntregadoIngresosBolivares: number = 0;
    EntregadoEgresosBolivares: number = 0;

    @ViewChild('confirmSwal') confirmSwal: any;
    @ViewChild('ModalCambiarContrasena') ModalCambiarContrasena: any;
    @ViewChild('CierreCaja') CierreCaja: any;
    @ViewChild('errorSwal') errorSwal: any;
    @ViewChild('ModalCambiarBanco') ModalCambiarBanco: any;
    @ViewChild('mensajeSwal') mensajeSwal: any;
    @ViewChild('ModalResumenCuenta') ModalResumenCuenta: any;
    @ViewChild('ModalCierreCuentaBancaria') ModalCierreCuentaBancaria: any;
    @ViewChild('ModalAjuste') ModalAjuste: any;

    cajero = true;

    ticks = 0;

    minutesDisplay: number = 0;
    hoursDisplay: number = 0;
    secondsDisplay: number = 0;

    sub: Subscription;
    myDate: Date;

    CambiosIngresos: any = [];
    TransferenciaIngresos: any = [];
    GiroIngresos: any = [];
    TrasladoIngresos: any = [];
    CorresponsalIngresos: any = [];
    ServicioIngresos: any = [];
    CambiosEgresos: any = [];
    GiroEgresos: any = [];
    TrasladoEgresos: any = [];

    ingresoCambio: any = 0;
    ingresoTransferencia: any = 0;
    ingresoGiro: any = 0;
    ingresoTraslado: any = 0;
    ingresoCorresponsal: any = 0;
    ingresoServicio: any = 0;

    egresoCambio: any = 0;
    egresoGiro: any = 0;
    egresoTraslado: any = 0;

    fajosPesos = [
        { "BilleteEntero100": 50000, "ValorEntero100": 0, "BilleteEntero50": 50000, "ValorEntero50": 0, "BilleteSuelto": 50000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 20000, "ValorEntero100": 0, "BilleteEntero50": 20000, "ValorEntero50": 0, "BilleteSuelto": 20000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 10000, "ValorEntero100": 0, "BilleteEntero50": 10000, "ValorEntero50": 0, "BilleteSuelto": 10000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 5000, "ValorEntero100": 0, "BilleteEntero50": 5000, "ValorEntero50": 0, "BilleteSuelto": 5000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 2000, "ValorEntero100": 0, "BilleteEntero50": 2000, "ValorEntero50": 0, "BilleteSuelto": 2000, "ValorSuelto": 0, "Moneda": "Pesos" },
        { "BilleteEntero100": 1000, "ValorEntero100": 0, "BilleteEntero50": 1000, "ValorEntero50": 0, "BilleteSuelto": 1000, "ValorSuelto": 0, "Moneda": "Pesos" }
    ]

    fajosBolivares = [
        { "BilleteEntero100": 500, "ValorEntero100": 0, "BilleteEntero50": 500, "ValorEntero50": 0, "BilleteSuelto": 500, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 200, "ValorEntero100": 0, "BilleteEntero50": 200, "ValorEntero50": 0, "BilleteSuelto": 200, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 100, "ValorEntero100": 0, "BilleteEntero50": 100, "ValorEntero50": 0, "BilleteSuelto": 100, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 50, "ValorEntero100": 0, "BilleteEntero50": 50, "ValorEntero50": 0, "BilleteSuelto": 50, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 20, "ValorEntero100": 0, "BilleteEntero50": 20, "ValorEntero50": 0, "BilleteSuelto": 20, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 10, "ValorEntero100": 0, "BilleteEntero50": 10, "ValorEntero50": 0, "BilleteSuelto": 10, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 5, "ValorEntero100": 0, "BilleteEntero50": 5, "ValorEntero50": 0, "BilleteSuelto": 5, "ValorSuelto": 0, "Moneda": "Bolivares" },
        { "BilleteEntero100": 2, "ValorEntero100": 0, "BilleteEntero50": 2, "ValorEntero50": 0, "BilleteSuelto": 2, "ValorSuelto": 0, "Moneda": "Bolivares" }
    ]

    constructor(private router: Router, private http: HttpClient, private globales: Globales, private toastyService: ToastyService) {
        this.app = {
            layout: {
                sidePanelOpen: false,
                isMenuOpened: true,
                isMenuCollapsed: false,
                themeConfigOpen: false,
                rtlActived: false,
                searchActived: false
            }
        };

        this.headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
        this.changeHeader = changeHeader;

        function changeHeader(headerTheme) {
            this.headerSelected = headerTheme;
        }

        this.sidenavThemes = ['sidenav-default', 'side-nav-dark'];
        this.changeSidenav = changeSidenav;

        function changeSidenav(sidenavTheme) {
            this.sidenavSelected = sidenavTheme;
        }
    }

    startTimer() {
        setInterval(() => {
            this.myDate = new Date();
        }, 1000);
    }

    OcultarCajero = false;
    OcultarConsultor = false;
    ListaBancos = [];
    nombreBanco = "";
    ngOnInit() {

        this.user = JSON.parse(localStorage.User);
        localStorage.setItem('Perfil',this.user.Permisos[0].Id_Perfil);
        switch (this.user.Permisos[0].Id_Perfil) {
            case "1":{
                this.OcultarCajero = false;
                this.OcultarConsultor = false;
                break;                
            }
            case "2":{
                this.OcultarCajero = true;
                break;
            }
            case "3": {
                this.OcultarCajero = true;
                break;
            }
            case "4": {
                this.OcultarCajero = true;
                this.OcultarConsultor = true;
                break;
            }
            case "5":{
                break;
            }
            case "6":{
                this.OcultarCajero = false;
                this.OcultarConsultor = false;
                break;
            }
        }

        this.http.get(this.globales.ruta + 'php/sesion/alerta.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.alertas = data;
        });

        if (this.user.Password == this.user.Username) {
            this.ModalCambiarContrasena.show();
        }

        this.startTimer();
        //console.log(localStorage)

        this.http.get(this.globales.ruta + 'php/trasladocaja/notificaciones_traslado.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.alertasCajas = data;
            if (this.alertasCajas.length > 0) {
                this.contadorTraslado = this.alertasCajas.length;
            } else {
                this.contadorTraslado = 0;
            }

        });

        setInterval(() => {
            this.http.get(this.globales.ruta + 'php/trasladocaja/notificaciones_traslado.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
                this.alertasCajas = data;
                if (this.alertasCajas.length > 0) {
                    this.contadorTraslado = this.alertasCajas.length;
                } else {
                    this.contadorTraslado = 0;
                }

            });
        }, 30000);

        this.http.get(this.globales.ruta + 'php/consultor/lista_bancos.php').subscribe((data: any) => {
            this.ListaBancos = data;
        });

        setInterval(() => {
            this.cerrarCaja()
        }, 30000);

        this.http.get(this.globales.ruta + 'php/movimientos/movimiento_cuenta_bancaria.php', {
            params: { id: JSON.parse(localStorage['Banco']) }
        }).subscribe((data: any) => {
            this.Movimientos = data.lista;
        });

        this.http.get(this.globales.ruta + 'php/movimientos/movimiento_cuenta_bancaria.php', {
            params: { id: JSON.parse(localStorage['Banco']) }
        }).subscribe((data: any) => {
            this.Movimientos = data.lista;
        });

        this.http.get(this.globales.ruta + '/php/genericos/detalle.php', { params: { id: JSON.parse(localStorage['Banco']), modulo: "Cuenta_Bancaria" } }).subscribe((data: any) => {
            this.nombreBanco = data.Nombre_Titular;
        });
    }

    salir() {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        localStorage.removeItem("Banco");
        localStorage.removeItem('Perfil');
        this.router.navigate(["/login"]);
    }

    ngAfterViewInit() {
        // this._toastyConfig.theme = 'bootstrap';
        let toastOptions: ToastOptions = {
            title: 'title',
            msg: 'my message',
            showClose: true,
            timeout: 15000,
            theme: "bootstrap",
            onAdd: (toast: ToastData) => {
                //console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function (toast: ToastData) {
                //console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
        this.toastyService.error(toastOptions);
    }



    CambiarContrasena(formulario: NgForm) {
        //console.log(formulario.value);
        let datos = new FormData();
        datos.append("clave", formulario.value.clave);
        datos.append("user", this.user.Identificacion_Funcionario);
        this.http.post(this.globales.ruta + 'php/funcionarios/cambia_clave.php', datos).subscribe((data: any) => {
            this.changePasswordMessage = data.Mensaje;
            //console.log(this.changePasswordMessage);
            formulario.reset();
            this.ModalCambiarContrasena.hide();
            this.confirmSwal.show();
        });
    }

    muestra_tabla(id) {
        var tot = document.getElementsByClassName('modulos').length;
        for (let i = 0; i < tot; i++) {
            var id2 = document.getElementsByClassName('modulos').item(i).getAttribute("id");
            document.getElementById(id2).style.display = 'none';
        }
        document.getElementById(id).style.display = 'block';

        let datos = new FormData();
        datos.append("id", JSON.parse(localStorage['User']).Identificacion_Funcionario);
        this.http.post(this.globales.ruta + 'php/trasladocaja/limpiar_notificaciones.php', datos).subscribe((data: any) => {
            this.alertasCajas = [];
            this.contadorTraslado = 0;

        });

    }


    totalIngresosPesos = 0;
    totalIngresosBolivares = 0;
    TotalEgresosPesos = 0;
    TotalEgresosBolivares = 0;
    SaldoInicialPesos = 0;
    SaldoInicialBolivares = 0;
    EntregadoIngresosBolivar = 0;
    ingresoCambioBolivar = 0;
    egresoCambioBolivar = 0;
    egresoGiroBolivar = 0;
    egresoTrasladoBolivar = 0;
    ingresoTrasladoBolivar = 0;
    GiroComision: any = 0;

    cerrarCaja(value = "") {

        this.CambiosIngresos = [];
        this.TransferenciaIngresos = [];
        this.GiroIngresos = [];
        this.TrasladoIngresos = [];
        this.CorresponsalIngresos = [];
        this.ServicioIngresos = [];
        this.CambiosEgresos = [];
        this.GiroEgresos = [];
        this.TrasladoEgresos = [];
        this.totalIngresosPesos = 0;
        this.totalIngresosBolivares = 0;
        this.TotalEgresosPesos = 0;
        this.TotalEgresosBolivares = 0;
        this.SaldoInicialPesos = 0;
        this.SaldoInicialBolivares = 0;
        this.EntregadoIngresosBolivar = 0;
        this.ingresoCambioBolivar = 0;
        this.egresoCambioBolivar = 0;
        this.egresoGiroBolivar = 0;
        this.egresoTrasladoBolivar = 0;
        this.ingresoTrasladoBolivar = 0;
        this.GiroComision = 0

        this.http.get(this.globales.ruta + 'php/cierreCaja/Cierre_Caja_V2.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {

            var ingresos = data.Ingresos;
            var egresos = data.Egresos;
            this.totalIngresosPesos = data.TotalIngresosPesos;
            this.totalIngresosBolivares = data.TotalIngresosBolivares;
            this.TotalEgresosPesos = data.TotalEgresosPesos;
            this.TotalEgresosBolivares = data.TotalEgresosBolivares;

            if (data.SaldoInicial[0]) {
                this.SaldoInicialPesos = data.SaldoInicial[0].Monto_Inicio;
                this.SaldoInicialBolivares = data.SaldoInicial[0].Monto_Inicio_Bolivar;
                this.EntregadoIngresosPesos = Number(this.SaldoInicialPesos) + Number(this.totalIngresosPesos) - Number(this.TotalEgresosPesos);
                this.EntregadoIngresosBolivar = Number(this.SaldoInicialBolivares) + Number(this.totalIngresosBolivares) - Number(this.TotalEgresosBolivares);
            }

            ingresos.forEach(element => {
                if (element.modulo == "Cambios") { this.CambiosIngresos.push(element) }
                if (element.modulo == "Transferencia") { this.TransferenciaIngresos.push(element) }
                if (element.modulo == "Giro") { this.GiroIngresos.push(element) }
                if (element.modulo == "Traslado") { this.TrasladoIngresos.push(element) }
                if (element.modulo == "Corresponsal") { this.CorresponsalIngresos.push(element) }
                if (element.modulo == "Servicio") { this.ServicioIngresos.push(element) }
            });

            egresos.forEach(element => {
                if (element.modulo == "Cambios") { this.CambiosEgresos.push(element) }
                if (element.modulo == "Giro") { this.GiroEgresos.push(element) }
                if (element.modulo == "Traslado") { this.TrasladoEgresos.push(element) }
            });

            if (this.CambiosIngresos[0]) {
                var index = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
                var index1 = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
                if (index1 > -1) {
                    this.ingresoCambio = this.CambiosIngresos[index1].Ingreso
                }

                if (index > -1) {
                    this.ingresoCambioBolivar = this.CambiosIngresos[index].Ingreso;
                }

            }
            if (this.TransferenciaIngresos[0]) { this.ingresoTransferencia = this.TransferenciaIngresos[0].Ingreso }
            if (this.GiroIngresos[0]) { this.ingresoGiro = this.GiroIngresos[0].Ingreso; this.GiroComision = this.GiroIngresos[0].Comision }
            if (this.TrasladoIngresos[0]) {
                var index = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
                var index1 = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
                if (index1 > -1) {
                    this.ingresoTraslado = this.TrasladoIngresos[index1].Ingreso
                }

                if (index > -1) {
                    this.ingresoTrasladoBolivar = this.TrasladoIngresos[index].Ingreso;
                }
            }
            if (this.CorresponsalIngresos[0]) { this.ingresoCorresponsal = this.CorresponsalIngresos[0].Ingreso }
            if (this.ServicioIngresos[0]) { this.ingresoServicio = this.ServicioIngresos[0].Ingreso }

            if (this.CambiosEgresos[0]) {

                var index = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
                var index1 = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
                if (index1 > -1) {
                    this.egresoCambio = this.CambiosEgresos[index1].Egreso
                }

                if (index > -1) {
                    this.egresoCambioBolivar = this.CambiosEgresos[index].Egreso;
                }
            }
            if (this.GiroEgresos[0]) {

                var index = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
                var index1 = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
                if (index1 > -1) {
                    this.egresoGiro = this.GiroEgresos[index1].Egreso
                }

                if (index > -1) {
                    this.egresoGiroBolivar = this.GiroEgresos[index].Egreso;
                }
            }
            if (this.TrasladoEgresos[0]) {

                var index = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
                var index1 = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
                if (index1 > -1) {
                    this.egresoTraslado = this.TrasladoEgresos[index1].Egreso
                }

                if (index > -1) {
                    this.egresoTrasladoBolivar = this.TrasladoEgresos[index].Egreso;
                }
            }

        });

        if (value != "") {
            this.CierreCaja.show();
        }

    }

    entregadoPesos = 0;
    diferenciaPesos = 0;
    calcularFajoBilletes(valor, pos, item) {
        //console.log(valor + " --- " +posicion + " --- " +item );
        switch (item) {
            case "ValorEntero100": {
                this.fajosPesos[pos].ValorEntero100 = valor;
                break
            };
            case "ValorEntero50": {
                this.fajosPesos[pos].ValorEntero50 = valor;
                break
            };
            case "ValorSuelto": {
                this.fajosPesos[pos].ValorSuelto = valor;
                break
            };
        }

        var sumaFajos100 = 0;
        var sumaFajos50 = 0;
        var sumaFajossueltos = 0;
        this.fajosPesos.forEach(element => {
            sumaFajos100 += (Number(element.BilleteEntero100) * Number(element.ValorEntero100));
            sumaFajos50 += (Number(element.BilleteEntero50) * Number(element.ValorEntero50));
            sumaFajossueltos += (Number(element.BilleteSuelto) * Number(element.ValorSuelto));
        });
        var monedaPeso = (document.getElementById("MonedasPesos") as HTMLInputElement).value;
        var sumatoria = sumaFajos100 + sumaFajos50 + sumaFajossueltos + Number(monedaPeso);
        this.entregadoPesos = sumatoria;
        //EntregadoIngresosPesos
        this.diferenciaPesos = this.EntregadoIngresosPesos - Number(sumatoria);
    }

    entregadoBolivar = 0;
    diferenciaBolivar = 0;
    calcularFajoBilletesBolivar(valor, pos, item) {
        //console.log(valor + " --- " +posicion + " --- " +item );
        switch (item) {
            case "ValorEntero100": {
                this.fajosBolivares[pos].ValorEntero100 = valor;
                break
            };
            case "ValorEntero50": {
                this.fajosBolivares[pos].ValorEntero50 = valor;
                break
            };
            case "ValorSuelto": {
                this.fajosBolivares[pos].ValorSuelto = valor;
                break
            };
        }

        var sumaFajos100 = 0;
        var sumaFajos50 = 0;
        var sumaFajossueltos = 0;
        this.fajosBolivares.forEach(element => {
            sumaFajos100 += (Number(element.BilleteEntero100) * Number(element.ValorEntero100));
            sumaFajos50 += (Number(element.BilleteEntero50) * Number(element.ValorEntero50));
            sumaFajossueltos += (Number(element.BilleteSuelto) * Number(element.ValorSuelto));
        });
        var sumatoria = sumaFajos100 + sumaFajos50 + sumaFajossueltos;
        this.entregadoBolivar = sumatoria;
        //EntregadoIngresosBolivar
        this.diferenciaBolivar = this.EntregadoIngresosBolivar - Number(sumatoria);
    }

    RealizarCierreCaja() {

        var resumenMovimientos =
            [
                { "Valor": this.ingresoCambio, "Moneda": "Pesos", "Tipo": "Ingreso", "Modulo": "Cambio" },
                { "Valor": this.ingresoCambioBolivar, "Moneda": "Bolivar", "Tipo": "Ingreso", "Modulo": "Cambio" },
                { "Valor": this.ingresoTransferencia, "Moneda": "Pesos", "Tipo": "Ingreso", "Modulo": "Transferencia" },
                { "Valor": this.ingresoGiro, "Moneda": "Pesos", "Tipo": "Ingreso", "Modulo": "Giro" },
                { "Valor": this.ingresoTraslado, "Moneda": "Pesos", "Tipo": "Ingreso", "Modulo": "Traslado" },
                { "Valor": this.ingresoTrasladoBolivar, "Moneda": "Bolivar", "Tipo": "Ingreso", "Modulo": "Trasaldo" },
                { "Valor": this.ingresoCorresponsal, "Moneda": "Pesos", "Tipo": "Ingreso", "Modulo": "Corresponsal" },
                { "Valor": this.ingresoServicio, "Moneda": "Pesos", "Tipo": "Ingreso", "Modulo": "Servicio" },
                { "Valor": this.egresoCambio, "Moneda": "Pesos", "Tipo": "Egreso", "Modulo": "Cambio" },
                { "Valor": this.egresoCambioBolivar, "Moneda": "Bolivar", "Tipo": "Egreso", "Modulo": "Cambio" },
                { "Valor": this.egresoGiro, "Moneda": "Pesos", "Tipo": "Egreso", "Modulo": "Giro" },
                { "Valor": this.egresoTraslado, "Moneda": "Pesos", "Tipo": "Egreso", "Modulo": "Trasaldo" },
                { "Valor": this.egresoTrasladoBolivar, "Moneda": "Bolivar", "Tipo": "Egreso", "Modulo": "Trasaldo" },
            ];

        var cierre = [
            { "Monto_Cierre": this.entregadoPesos, "Diferencia": this.diferenciaPesos, "Monto_Cierre_Bolivar": this.entregadoBolivar, "Diferencia_Bolivar": this.diferenciaBolivar },
        ]

        var observacion = (document.getElementById("Observacion") as HTMLInputElement).value;

        if (this.entregadoPesos > 0 && this.diferenciaPesos > 0 && this.entregadoBolivar > 0 && this.diferenciaBolivar > 0) {
            if (observacion != "") {
                let movimientos = JSON.stringify(resumenMovimientos);
                let cierreCaja = JSON.stringify(cierre);
                let datos = new FormData();
                datos.append("resumenMovimientos", movimientos);
                datos.append("cierre", cierreCaja);
                datos.append("observacion", observacion);
                datos.append("funcionario", JSON.parse(localStorage['User']).Identificacion_Funcionario);

                this.http.post(this.globales.ruta + 'php/diario/cierre_caja.php', datos)
                    .subscribe((data: any) => {
                        this.salir();
                    });
            } else {
                this.errorSwal.title = "Observaciones"
                this.errorSwal.text = "Agregue la observacion para poder continuar"
                this.errorSwal.type = "warning"
                this.errorSwal.show();
            }
        } else {
            this.errorSwal.title = "Saldos"
            this.errorSwal.text = "Las diferencias deben ser mayores a 0 para poder continuar"
            this.errorSwal.type = "warning"
            this.errorSwal.show();
        }
    }

    GuardarMontoInicial(formulario: NgForm, modal) {

        formulario.value.Id_Funcionario = JSON.parse(localStorage['User']).Identificacion_Funcionario;
        formulario.value.Id_Cuenta_Bancaria = this.IdBanco;
        formulario.value.Monto_Inicial = this.SaldoInicialBanco;
        let info = JSON.stringify(formulario.value);
        let datos = new FormData();
        datos.append("datos", info);
        this.http.post(this.globales.ruta + '/php/consultor/cambiar_banco_consultor.php', datos).subscribe((data: any) => {
            if (data != "") {
                formulario.reset();
                this.mensajeSwal.title = "Apertura"
                this.mensajeSwal.text = "Se ha realizado la apertura con esta cuenta"
                this.mensajeSwal.type = "success"
                this.mensajeSwal.show();
                modal.hide();
                this.http.get(this.globales.ruta + 'php/consultor/verificar_banco_consultor.php', { params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario } }).subscribe((data: any) => {
                    localStorage.setItem('Banco', data[0].Id_Cuenta_Bancaria);
                });

            } else {
                this.mensajeSwal.title = "Apertura";
                this.mensajeSwal.text = "El banco seleccionado se le asigno a otro consultor";
                this.mensajeSwal.type = "warning";
                this.mensajeSwal.show();
            }

        });

    }

    Movimientos = [];
    MontoInicialCuenta = [];
    sumaIngresos = 0;
    sumaEgresos = 0;
    SaldoActual = 0;
    MontoInicial = 0;
    ValorInicial =0;
    CierreCuentaBancaria() {
        //JSON.parse(localStorage['Banco']);

        this.MontoInicialCuenta = [];
        this.MontoInicial = 0;
        this.sumaEgresos = 0;
        this.sumaIngresos = 0;
        this.SaldoActual = 0;
        this.Movimientos = [];
        this.ValorInicial =0;

        this.http.get(this.globales.ruta + '/php/genericos/detalle.php', {
            params: { id: JSON.parse(localStorage['Banco']), modulo: "Cuenta_Bancaria" }
        }).subscribe((data: any) => {
            this.MontoInicialCuenta = data;
            this.ValorInicial = data.Monto_Inicial;
            this.MontoInicial = data.Monto_Inicial;
        });

        this.http.get(this.globales.ruta + 'php/movimientos/movimiento_cuenta_bancaria.php', {
            params: { id: JSON.parse(localStorage['Banco']) }
        }).subscribe((data: any) => {
            this.Movimientos = data.lista;
           
            /*if (Number(this.MontoInicial) + Number(this.sumaEgresos)  == Number(this.ValorInicial)){
                this.sumaEgresos = 0;   
            }
            this.ModalResumenCuenta.show();*/
        });

        this.http.get(this.globales.ruta + 'php/movimientos/movimientos_cuenta_bancaria_Detalle.php', {
            params: { id: JSON.parse(localStorage['Banco']) }
        }).subscribe((data: any) => {
            data.lista.forEach(element => {
                if (element.Tipo == "Egreso") { this.sumaEgresos += Number(element.ValorSinSimbolo) }
                if (element.Tipo == "Ingreso" && element.Detalle != "Saldo Inicial") { this.sumaIngresos += Number(element.ValorSinSimbolo) }                
            });            


            this.SaldoActual = Number(this.MontoInicial) - Number(this.sumaEgresos) + Number(this.sumaIngresos);
            this.MontoInicial = Number(this.MontoInicial) - Number(this.sumaEgresos);
            /*if (Number(this.MontoInicial) + Number(this.sumaEgresos)  == Number(this.ValorInicial)){
                this.sumaEgresos = 0;   
            }*/
            this.ModalResumenCuenta.show();
        });

        this.http.get(this.globales.ruta + '/php/genericos/detalle.php', { params: { id: JSON.parse(localStorage['Banco']), modulo: "Cuenta_Bancaria" } }).subscribe((data: any) => {
            this.nombreBanco = data.Nombre_Titular;
        });
    }

    CierreCuentaBancariaNoModal() {
        this.MontoInicialCuenta = [];
        this.MontoInicial = 0;
        this.sumaEgresos = 0;
        this.sumaIngresos = 0;
        this.SaldoActual = 0;
        this.Movimientos = [];

        this.http.get(this.globales.ruta + '/php/genericos/detalle.php', {
            params: { id: JSON.parse(localStorage['Banco']), modulo: "Cuenta_Bancaria" }
        }).subscribe((data: any) => {
            this.MontoInicialCuenta = data;
            this.MontoInicial = data.Monto_Inicial;
        });

        this.http.get(this.globales.ruta + 'php/movimientos/movimiento_cuenta_bancaria.php', {
            params: { id: JSON.parse(localStorage['Banco']) }
        }).subscribe((data: any) => {
            this.Movimientos = data.lista;
            this.Movimientos.forEach(element => {
                if (element.Tipo == "Egreso") { this.sumaEgresos += Number(element.ValorSinSimbolo) }
                if (element.Tipo == "Ingreso" && element.Detalle != "Saldo Inicial" ) { this.sumaIngresos += Number(element.ValorSinSimbolo) }
                this.MontoInicial = element.Saldo;
            });

            this.SaldoActual = Number(this.MontoInicial) - Number(this.sumaEgresos) + Number(this.sumaIngresos);
        });
    }

    abrirModal() {
        this.ModalAjuste.show();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var hoy = yyyy + '-' + mm + '-' + dd;
        (document.getElementById("datefield") as HTMLInputElement).setAttribute("max", hoy);
    }

    GuardarMovimiento(formulario: NgForm, modal) {
        let info = JSON.stringify(formulario.value);
        let datos = new FormData();
        var newId = JSON.parse(localStorage['Banco']);
        datos.append("modulo", 'Movimiento_Cuenta_Bancaria');
        datos.append("datos", info);
        datos.append("Id_Cuenta_Bancaria", JSON.parse(localStorage['Banco']));
        this.http.post(this.globales.ruta + 'php/bancos/guardar_ajuste.php', datos)
            .subscribe((data: any) => {
                formulario.reset();
                modal.hide();
                this.CierreCuentaBancariaNoModal();
            });
    }


    SaldoInicialBanco = 0;
    IdBanco = 0;
    VerificarSaldo(value) {
        this.IdBanco = value;
        var index = this.ListaBancos.findIndex(x => x.Id_Cuenta_Bancaria === value);
        if (index > -1) {
            this.SaldoInicialBanco = this.ListaBancos[index].Valor;
            //GuardarInicio
        }

    }

    RealizarCierreDiaCuentaBancaria(modal) {
        let saldoActual = JSON.stringify(this.SaldoActual);
        JSON.parse(localStorage['Banco'])
        let datos = new FormData();
        datos.append("SaldoActualBanco",saldoActual );
        datos.append("Id_Cuenta_Bancaria", JSON.parse(localStorage['Banco']));
        this.http.post(this.globales.ruta + 'php/cierreCaja/Cierre_Banco.php', datos)
            .subscribe((data: any) => {
                this.salir(); 
                modal.hide();
        });
    }
}
