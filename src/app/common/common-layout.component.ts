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
    public SaldoInicialPeso:number = 0;

    SumaIngresosPesos:number = 0;
    SumaIngresosBolivar:number = 0;
    SumaEgresosPesos:number = 0;
    SumaEgresosBolivar:number = 0;
    EntregadoIngresosPesos:number = 0;
    EntregadoIngresosBolivares:number = 0;
    EntregadoEgresosBolivares:number = 0;

    @ViewChild('confirmSwal') confirmSwal: any;
    @ViewChild('ModalCambiarContrasena') ModalCambiarContrasena: any;
    @ViewChild('CierreCaja') CierreCaja: any;
    
    cajero = true;

    ticks = 0;

    minutesDisplay: number = 0;
    hoursDisplay: number = 0;
    secondsDisplay: number = 0;

    sub: Subscription;
    myDate: Date;

    CambiosIngresos: any =[];
    TransferenciaIngresos: any =[];
    GiroIngresos: any =[];
    TrasladoIngresos: any =[];
    CorresponsalIngresos: any =[];
    ServicioIngresos: any =[];
    CambiosEgresos: any =[];
    GiroEgresos: any =[];
    TrasladoEgresos: any =[];

    ingresoCambio: any = 0;
    ingresoTransferencia: any = 0;
    ingresoGiro: any = 0;
    ingresoTraslado: any = 0;
    ingresoCorresponsal: any = 0;
    ingresoServicio: any = 0;

    egresoCambio: any= 0;
    egresoGiro: any= 0;
    egresoTraslado: any= 0;

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
    ngOnInit() {

        this.user = JSON.parse(localStorage.User);
        switch (this.user.Permisos[0].Id_Perfil) {
            case "1": {
                this.OcultarCajero = true;
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
            if(this.alertasCajas.length > 0){
               this.contadorTraslado = this.alertasCajas.length;
            }else{
                this.contadorTraslado = 0;
            }

        });

        setInterval(() => {
            this.http.get(this.globales.ruta + 'php/trasladocaja/notificaciones_traslado.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
                this.alertasCajas = data;
                if(this.alertasCajas.length > 0){
                   this.contadorTraslado = this.alertasCajas.length;
                }else{
                    this.contadorTraslado = 0;
                }

            });
        }, 30000);
    }

    salir() {
        localStorage.removeItem("Token");
        localStorage.removeItem("User");
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
    }


    /*cierreCajaCambioIngresoPeso:number=0;
    cierreCajaCambioIngresoBolivar:number=0;
    cierreCajaCambioEgresoPeso:number=0;
    cierreCajaCambioEgresoBolivar:number=0;*/
    totalIngresosPesos = 0;
    totalIngresosBolivares = 0;
    TotalEgresosPesos  = 0;
    TotalEgresosBolivares = 0;
    SaldoInicialPesos=0;
    SaldoInicialBolivares= 0;
    EntregadoIngresosBolivar= 0;
	ingresoCambioBolivar = 0;
	egresoCambioBolivar = 0;
	egresoGiroBolivar = 0;
	egresoTrasladoBolivar = 0;
	ingresoTrasladoBolivar = 0;
    cerrarCaja(){
        this.http.get(this.globales.ruta + 'php/cierreCaja/Cierre_Caja_V2.php', { params: { id: this.user.Identificacion_Funcionario }}).subscribe((data: any) => {
            /*this.cierreCajaCambioIngresoPeso = data.ingresoCambio[1].Ingreso;
            this.cierreCajaCambioIngresoBolivar =data.ingresoCambio[0].Ingreso;
            this.cierreCajaCambioEgresoPeso = data.egresoCambio[0].Egreso;
            this.cierreCajaCambioEgresoBolivar = data.egresoCambio[1].Egreso;
            this.SaldoInicialPeso = data.saldoInicial[0].Monto_Inicio;
            this.SumaIngresosPesos = data.SumaIngresosPesos;
            this.SumaIngresosBolivar = data.SumaIngresosBolivar
            this.SumaEgresosPesos = data.SumaEgresosPesos;
            this.SumaEgresosBolivar = data.SumaEgresosBolivar
            this.EntregadoIngresosPesos =  Number(this.SaldoInicialPeso) + (Number(data.SumaIngresosPesos) - Number(data.SumaEgresosPesos)); 
            this.EntregadoEgresosBolivares = Number(data.SumaIngresosBolivar) - Number(data.SumaEgresosBolivar); */
			
			var ingresos = data.Ingresos;
            var egresos = data.Egresos;
            this.totalIngresosPesos = data.TotalIngresosPesos;
            this.totalIngresosBolivares = data.TotalIngresosBolivares;
            this.TotalEgresosPesos  = data.TotalEgresosPesos;
            this.TotalEgresosBolivares = data.TotalEgresosBolivares;
            
            if(data.SaldoInicial[0]){       
                this.SaldoInicialPesos = data.SaldoInicial[0].Monto_Inicio;
                this.SaldoInicialBolivares = data.SaldoInicial[0].Monto_Inicio_Bolivar;
                this.EntregadoIngresosPesos =  Number(this.SaldoInicialPesos) +  Number(this.totalIngresosPesos) -  Number(this.TotalEgresosPesos);
                this.EntregadoIngresosBolivar = Number(this.SaldoInicialBolivares) + Number(this.totalIngresosBolivares) -  Number(this.TotalEgresosBolivares);           
            }

            ingresos.forEach(element => {
                if(element.modulo == "Cambios"){ this.CambiosIngresos.push(element)}
                if(element.modulo == "Transferencia"){this.TransferenciaIngresos.push(element)}
                if(element.modulo == "Giro"){this.GiroIngresos.push(element)}
                if(element.modulo == "Traslado"){this.TrasladoIngresos.push(element)}
                if(element.modulo == "Corresponsal"){this.CorresponsalIngresos.push(element)}
                if(element.modulo == "Servicio"){this.ServicioIngresos.push(element)}
            });
                        
            egresos.forEach(element => {
                if(element.modulo == "Cambios"){ this.CambiosEgresos.push(element)}
                if(element.modulo == "Giro"){this.GiroEgresos.push(element)}
                if(element.modulo == "Traslado"){this.TrasladoEgresos.push(element)}
            });

            if(this.CambiosIngresos[0]){ 
				var index = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
				var index1 = this.CambiosIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
				if(index1 > -1){
					this.ingresoCambio = this.CambiosIngresos[index1].Ingreso					
				}
				
				if(index > -1){
					this.ingresoCambioBolivar = this.CambiosIngresos[index].Ingreso;
				}

			}
            if(this.TransferenciaIngresos[0]){ this.ingresoTransferencia = this.TransferenciaIngresos[0].Ingreso}
            if(this.GiroIngresos[0]){this.ingresoGiro = this.GiroIngresos[0].Ingreso}
            if(this.TrasladoIngresos[0]){ 
				var index = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Bolivares");
				var index1 = this.TrasladoIngresos.findIndex(x => x.Moneda_Origen === "Pesos");
				if(index1 > -1){
					this.ingresoTraslado = this.TrasladoIngresos[index1].Ingreso					
				}
				
				if(index > -1){
					this.ingresoTrasladoBolivar = this.TrasladoIngresos[index].Ingreso;
				}
			}
            if(this.CorresponsalIngresos[0]){ this.ingresoCorresponsal = this.CorresponsalIngresos[0].Ingreso}
            if(this.ServicioIngresos[0]){ this.ingresoServicio = this.ServicioIngresos[0].Ingreso}

            if(this.CambiosEgresos[0]){ 
				
				var index = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
				var index1 = this.CambiosEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
				if(index1 > -1){
					this.egresoCambio = this.CambiosEgresos[index1].Egreso					
				}
				
				if(index > -1){
					this.egresoCambioBolivar = this.CambiosEgresos[index].Egreso;
				}				
			}
            if(this.GiroEgresos[0]){
								
				var index = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
				var index1 = this.GiroEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
				if(index1 > -1){
					this.egresoGiro = this.GiroEgresos[index1].Egreso					
				}
				
				if(index > -1){
					this.egresoGiroBolivar = this.GiroEgresos[index].Egreso;
				}
			}
            if(this.TrasladoEgresos[0]){ 
				
				var index = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Bolivares");
				var index1 = this.TrasladoEgresos.findIndex(x => x.Moneda_Destino === "Pesos");
				if(index1 > -1){
					this.egresoTraslado = this.TrasladoEgresos[index1].Egreso					
				}
				
				if(index > -1){
					this.egresoTrasladoBolivar = this.TrasladoEgresos[index].Egreso;
				}
			}

            this.CierreCaja.show();
        });
    }
}
