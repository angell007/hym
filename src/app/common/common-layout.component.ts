import { Component, Directive, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, Subscription, pipe } from 'rxjs/Rx';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { NgForm } from '../../../node_modules/@angular/forms';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { log } from 'util';
import { CajaService } from '../shared/services/caja/caja.service';
import { SwalService } from '../shared/services/swal/swal.service';
import { TrasladocajaService } from '../shared/services/traslados_caja/trasladocaja.service';
import { ToastService } from '../shared/services/toasty/toast.service';
import { OficinaService } from '../shared/services/oficinas/oficina.service';
import { AperturacajaService } from '../shared/services/aperturacaja/aperturacaja.service';
import { GeneralService } from '../shared/services/general/general.service';
import { NuevofuncionarioService } from '../shared/services/funcionarios/nuevofuncionario.service';
import { QzTrayService } from '../shared/qz-tray.service';
import { tap } from 'rxjs/operators';
import { NotificacionsService } from '../customservices/notificacions.service';
import { ConsolidadosService } from '../customservices/consolidados.service';
import { TrasladosCustomService } from '../customservices/traslados.custom.service';
import { ValidateCajeroService } from '../validate-cajero.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html',
    styleUrls: ['./common-layout.component.scss', '../../../node_modules/ng2-toasty/bundles/style-bootstrap.css', '../.././style.scss'],
    providers: [QzTrayService, NotificacionsService, ConsolidadosService, TrasladosCustomService, ValidateCajeroService]

})

export class CommonLayoutComponent implements OnInit {

    public mostrarDatos: boolean = false;
    public CargandoLabels: Array<any> = [
        'Cargando Monedas',
        'Cargando Oficinas',
        'Cargando Cajas',
        'Cargando Saldos',
        'Cargando Impresoras',
        'Cargando Mac',
        'Cargando Listas Generales'
    ]
    public fraseCargando: any = 'Cargando Datos';
    public app: any;
    public headerThemes: any;
    public changeHeader: any;
    public sidenavThemes: any;
    public changeSidenav: any;
    public headerSelected: any;
    public sidenavSelected: any;
    public searchActived: any;
    public searchModel: any;
    public user: any = JSON.parse(localStorage.User);
    public changePasswordMessage: string;
    public alertas: any = [];
    public alertasCajas: any = [];
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
    TotalTraslados: any
    public Modulos: Array<string> = ['Cambios', 'Transferencias', 'Giros', 'Traslados', 'Corresponsal', 'Servicios', 'Egresos'];

    @ViewChild('confirmSwal') confirmSwal: any;
    @ViewChild('ModalCambiarContrasena') ModalCambiarContrasena: any;
    @ViewChild('CierreCaja') CierreCaja: any;
    @ViewChild('errorSwal') errorSwal: any;
    @ViewChild('ModalCambiarBanco') ModalCambiarBanco: any;
    @ViewChild('mensajeSwal') mensajeSwal: any;
    @ViewChild('macSwal') macSwal: any;
    @ViewChild('ModalResumenCuenta') ModalResumenCuenta: any;
    @ViewChild('ModalCierreCuentaBancaria') ModalCierreCuentaBancaria: any;
    @ViewChild('ModalAjuste') ModalAjuste: any;
    @ViewChild('alertSwal') alertSwal: any;

    @ViewChild('modalOficinaCaja') modalOficinaCaja: any;
    @ViewChild('ModalAperturaCaja') ModalAperturaCaja: any;

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

    public counter = '0';
    public counterServices = '0';

    //VARIABLES NUEVA
    public Oficinas: any = [];
    public Cajas: any = [];
    public oficina_seleccionada: any = '';
    public caja_seleccionada: any = '';

    public Paises: any = [];

    public AperturaCuentaModel: any = {
        Id_Cuenta_Bancaria: '',
        Id_Moneda: '',
        Valor: '',
        Id_Bloqueo_Cuenta: ''
    };

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

    //NUEVO CODIGO

    public MostrarToasty: boolean = false;

    //#region APERTURA CAJA

    public MonedasSistema: any = [];

    public DiarioModel: any = {
        Id_Diario: '',
        Id_Funcionario: this.user.Identificacion_Funcionario,
        Caja_Apertura: this.caja_seleccionada,
        Oficina_Apertura: this.oficina_seleccionada
    };

    public ValoresMonedasApertura: any = [
        { Id_Moneda: '', Valor_Moneda_Apertura: '', NombreMoneda: '', Codigo: '' }
    ];

    public NombreCaja: string = '';
    public NombreOficina: string = '';
    public permisos;
    public indicadores: boolean;
    public configuracion: boolean;


    constructor(private router: Router,

        private activeRoute: ActivatedRoute,
        public qz: QzTrayService,
        private http: HttpClient,
        private globales: Globales,
        public toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private cajaService: CajaService,
        private swalService: SwalService,
        private _notificacionService: NotificacionsService,
        private trasladoCajaService: TrasladocajaService,
        private toastService: ToastService,
        private trasladosCustomService: TrasladosCustomService,
        private _oficinaService: OficinaService,
        private _cajaService: CajaService,
        private _aperturaCajaService: AperturacajaService,
        private _generalService: GeneralService,
        private _funcionarioService: NuevofuncionarioService,
        private consolidadosService: ConsolidadosService,
        private _vService: ValidateCajeroService
    ) {

        this.http.get(this.globales.ruta + 'php/perfiles/dashboard.php', {
            params: { id: JSON.parse(localStorage['User']).Identificacion_Funcionario }
        }).subscribe((data: any) => {
            window.localStorage.setItem('permisos', JSON.stringify(data.permisos));
            this.permisos = data.permisos;
            let auxind = this.permisos.find(element => element['Nombre_Modulo'] == 'Indicadores')
            this.indicadores = (auxind != undefined) ? true : false
            let auxcon = this.permisos.find(element => element['Nombre_Modulo'] == 'Configuracion')
            this.configuracion = (auxcon != undefined) ? true : false
        });

        this.Cargar();

        this._notificacionService.counter();
        this._notificacionService.notifcaciones$.subscribe((data: any) => this.counter = data)
        // this._notificacionService.notifcacionesServices$.subscribe((data: any) => this.counterServices = data)


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

        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.limit = 1;

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

        this.AsignarPaises();
        this.AsignarMonedas();
        this.AsignarMonedasApertura();
        this.ListarOficinas();

        this.SetOficina();
        this.SetCaja();

        if (!localStorage.getItem('Volver_Apertura')) {
            localStorage.setItem("Volver_Apertura", "Si");
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

    timer = ms => new Promise(res => setTimeout(res, ms))

    async Cargar() {
        for (var i = 0; i < this.CargandoLabels.length; i++) {
            await this.timer(1500); // then the created Promise can be awaited
            this.fraseCargando = this.CargandoLabels[i];
            if (i == this.CargandoLabels.length - 1) {
                i = 0;
            }
        }
    }
    async ngOnInit() {

        this.swalService.event.subscribe((data: any) => {
            this.ShowSwal(data.type, data.title, data.msg);
        });

        this.toastService.event.subscribe((data: any) => {
            this.ShowToasty(data.textos, data.tipo, data.duracion);
        });

        switch (this.user.Id_Perfil) {
            // administrador
            case "1": {
                this.OcultarCajero = false;
                this.OcultarConsultor = false;
                break;
            }
            //cajero principal
            case "2": {
                this.OcultarCajero = true;
                break;
            }
            // cajero
            case "3": {
                this.http.get(this.globales.ruta + 'php/pos/traslado_recibido.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
                    data = data.filter(x => x.Estado == "Pendiente")
                    this.TotalTraslados = data.length
                });


                this.OcultarCajero = true;
                // await this.consolidadosService.getValoresIniciales()
                // await this.consolidadosService.getValoresApertura()
                break;
            }
            // consultor
            case "4": {
                this.OcultarCajero = true;
                this.OcultarConsultor = true;
                break;
            }
            // auditor 
            case "5": {
                break;
            }
            // 
            case "6": {
                this.OcultarCajero = false;
                this.OcultarConsultor = false;
                break;
            }
        }

        localStorage.setItem('Perfil', this.user.Id_Perfil);


        this.CheckCajaOficina();

        this.http.get(this.globales.ruta + 'php/sesion/alerta.php', { params: { id: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {
            this.alertas = data;
        });

        this.startTimer();

        if (localStorage['Banco']) {
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

    }



    salir() {

        this._registrarCierreSesion();

        localStorage.removeItem("Token");
        localStorage.removeItem("User");
        localStorage.removeItem("Banco");
        localStorage.removeItem('Perfil');
        localStorage.setItem('CuentaConsultor', '');
        localStorage.setItem('MonedaCuentaConsultor', '');
        localStorage.clear();

        setTimeout(() => {
            this.router.navigate(["/login"]);
        }, 800);
    }

    private _registrarCierreSesion() {
        let data = new FormData();
        data.append('id_funcionario', this._generalService.Funcionario.Identificacion_Funcionario);
        this._funcionarioService.LogCierreSesion(data).subscribe();
    }

    ValidateConsultorBeforeLogout() {
        let funcionario = JSON.parse(localStorage['User']);

        if (funcionario.Id_Perfil == '4') {

            let cuenta = localStorage.getItem('CuentaConsultor');

            if (cuenta != '') {
                this.ShowSwal('warning', 'Cuenta Abierta', 'Debe cerrar la cuenta en la que opera antes de cerrar la sesi??n!');
                return false;
            }
        }

        return true;
    }


    CambiarContrasena(formulario: NgForm, modal) {
        let datos = new FormData();
        datos.append("clave", formulario.value.clave);
        datos.append("user", this.user.Identificacion_Funcionario);
        this.http.post(this.globales.ruta + 'php/funcionarios/cambia_clave.php', datos).subscribe((data: any) => {
            this.changePasswordMessage = data.Mensaje;
            formulario.reset();
            this.ModalCambiarContrasena.hide();
            this.confirmSwal.show();
        });
    }


    muestra_tabla(id) {

        this.trasladosCustomService.CargarDatosTraslados();

        var tot = document.getElementsByClassName('modulos').length;
        for (let i = 0; i < tot; i++) {
            var id2 = document.getElementsByClassName('modulos').item(i).getAttribute("id");
            document.getElementById(id2).style.display = 'none';
        }

        document.getElementById(id).style.display = 'block';


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
        this.GiroComision = 0;

        this.ingresoCambio = 0;
        this.ingresoCambioBolivar = 0;
        this.ingresoTransferencia = 0;
        this.ingresoTraslado = 0;
        this.egresoTraslado = 0;
        this.totalIngresosPesos = 0;
        this.egresoCambio = 0;
        this.egresoCambioBolivar = 0;
        this.ingresoCorresponsal = 0;
        this.EntregadoIngresosPesos = 0;

        this.http.get(this.globales.ruta + 'php/cierreCaja/Cierre_Caja_V2.php', { params: { id: this.user.Identificacion_Funcionario } }).pipe
            (tap(x => { /*console.log('obteniendo consultyya de cierre de caja ', x);*/ })).subscribe((data: any) => {

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

    GuardarMontoInicial2(modal) {

        let id_funcionario = this.user.Identificacion_Funcionario;
        let info = JSON.stringify(this.AperturaCuentaModel);
        let datos = new FormData();
        datos.append("modelo", info);
        datos.append("id_funcionario", id_funcionario);
        this.http.post(this.globales.ruta + '/php/cuentasbancarias/apertura_cuenta_bancaria.php', datos).subscribe((data: any) => {

            this.mensajeSwal.title = "Registro Exitoso";
            this.mensajeSwal.text = data.mensaje;
            this.mensajeSwal.type = data.codigo;
            this.mensajeSwal.show();

            localStorage.setItem('Cuenta_Bancaria', this.AperturaCuentaModel.Id_Cuenta_Bancaria);
            localStorage.setItem('Moneda_Cuenta_Bancaria', this.AperturaCuentaModel.Id_Moneda);

            modal.hide();
        });

    }

    Movimientos = [];
    MontoInicialCuenta = [];
    sumaIngresos = 0;
    sumaEgresos = 0;
    SaldoActual = 0;
    MontoInicial = 0;
    ValorInicial = 0;
    CierreCuentaBancaria() {
        //JSON.parse(localStorage['Banco']);
        this.ModalResumenCuenta.show();
        //return;
        this.MontoInicialCuenta = [];
        this.MontoInicial = 0;
        this.sumaEgresos = 0;
        this.sumaIngresos = 0;
        this.SaldoActual = 0;
        this.Movimientos = [];
        this.ValorInicial = 0;

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
                if (element.Tipo == "Ingreso" && element.Detalle != "Saldo Inicial") { this.sumaIngresos += Number(element.ValorSinSimbolo) }
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
        if (value == '') {
            this.AperturaCuentaModel.Valor = '';
            this.AperturaCuentaModel.Id_Cuenta_Bancaria = value;
            this.AperturaCuentaModel.Id_Moneda = '';
            return;
        }

        this.IdBanco = value;
        var index = this.ListaBancos.findIndex(x => x.Id_Cuenta_Bancaria === value);
        if (index > -1) {
            this.SaldoInicialBanco = this.ListaBancos[index].Valor;
            this.AperturaCuentaModel.Id_Moneda = this.ListaBancos[index].Id_Moneda;
            this.AperturaCuentaModel.Id_Cuenta_Bancaria = value;
            this.AperturaCuentaModel.Valor = this.ListaBancos[index].Valor;
            //GuardarInicio
        }
    }

    RealizarCierreDiaCuentaBancaria(modal: any = null) {
        let saldoActual = JSON.stringify(this.SaldoActual);
        JSON.parse(localStorage['Banco'])
        let datos = new FormData();
        datos.append("SaldoActualBanco", saldoActual);
        datos.append("Id_Cuenta_Bancaria", JSON.parse(localStorage['Banco']));
        this.http.post(this.globales.ruta + 'php/cierreCaja/Cierre_Banco.php', datos)
            .subscribe((data: any) => {
                this.salir();
                modal.hide();
            });
    }

    //FUNCIONES NUEVAS

    AsignarMonedas() {
        this.MonedasSistema = this.globales.Monedas;
    }

    AsignarMonedasApertura() {
        if (this.MonedasSistema.length > 0) {

            this.ValoresMonedasApertura = [];
            this.MonedasSistema.forEach(moneda => {
                let monObj = { Id_Moneda: moneda.Id_Moneda, Valor_Moneda_Apertura: '', NombreMoneda: moneda.Nombre, Codigo: moneda.Codigo };
                this.ValoresMonedasApertura.push(monObj);
            });
        }
    }

    ListarOficinas() {
        this._oficinaService.getOficinas().subscribe((data: any) => {

            if (data.codigo == 'success') {
                this.Oficinas = data.query_data;
            } else {
                this.Oficinas = [];
                this.ShowSwal(data.tipo, data.titulo, data.mensaje);
            }
        });
    }

    ListarCajas(value: string) {
        if (value == '') {
            this.Cajas = [];
            return;
        }

        this.http.get(this.globales.ruta + 'php/cajas/listar_cajas_por_oficina.php', { params: { id: value } }).subscribe((data: any) => {

            if (data.tipo == 'error') {
                this.Cajas = [];
                this.ShowSwal(data.tipo, 'Error', data.mensaje);
            } else {
                this.Cajas = data.data;
                //this.ShowSwal(data.tipo, 'Registro Exitoso', data.mensaje);
            }
        });
    }

    async AsignarPaises() {
        this.Paises = await this.globales.Paises;
    }

    GuardarOficinaCaja() {
        if (this.oficina_seleccionada == '') {
            this.ShowSwal('warning', 'Alerta', 'Debe escoger la oficina!');
            return;
        }

        if (this.caja_seleccionada == '') {
            this.ShowSwal('warning', 'Alerta', 'Debe escoger la caja!');
            return;
        }

        /*this.cajaService.verificarCaja(this.caja_seleccionada).subscribe((data:any) => {
    
            if (data.codigo == 'success') {*/

        this._generalService.SessionDataModel.idOficina = this.oficina_seleccionada;
        this._generalService.SessionDataModel.idCaja = this.caja_seleccionada;

        // localStorage.setItem("Oficina", this.oficina_seleccionada);        
        // localStorage.setItem("Caja", this.caja_seleccionada);
        this.DiarioModel.Caja_Apertura = this.caja_seleccionada;
        this.DiarioModel.Oficina_Apertura = this.oficina_seleccionada;
        this.SetNombreOficina(this.oficina_seleccionada);
        this.SetNombreCaja(this.caja_seleccionada);
        this.modalOficinaCaja.hide();
        this._aperturaCajaService.OpenModalApertura(null);
        /*}else{
            this.ShowSwal(data.codigo, data.titulo, data.mensaje);
            localStorage.setItem("Oficina", '');        
            localStorage.setItem("Caja", '');
            this.DiarioModel.Caja_Apertura = '';
            this.DiarioModel.Oficina_Apertura = '';
        }
    }); */
    }

    ShowSwal(tipo: string, titulo: string, msg: string) {
        this.alertSwal.type = tipo;
        this.alertSwal.title = titulo;
        this.alertSwal.text = msg;
        this.alertSwal.show();
    }

    ShowToasty(data: Array<string>, tipo: string = 'default', duracion: number = 3000) {

        let toastOptions = {
            title: data[0],
            msg: data[1],
            showClose: true,
            timeout: duracion,
            onAdd: (toast: ToastData) => {
                this.MostrarToasty = true;
            },
            onRemove: function (toast: ToastData) {
                this.MostrarToasty = false;
            }
        }

        switch (tipo) {
            // case 'default': this.toastyService.default(toastOptions); break;
            // case 'info': this.toastyService.info(toastOptions); break;
            // case 'success': this.toastyService.success(toastOptions); break;
            // case 'wait': this.toastyService.wait(toastOptions); break;
            // case 'error': this.toastyService.error(toastOptions); break;
            // case 'warning': this.toastyService.warning(toastOptions); break;
        }
    }

    SetNombreCaja(idCaja: string) {
        this.cajaService.getNombreCaja(idCaja).subscribe((data: any) => {
            this.NombreCaja = data.caja;
            this._aperturaCajaService.OpenModalApertura(null);
        });
    }

    SetNombreOficina(idOficina: string) {

        localStorage.removeItem('monedaDefault');

        if (this.Oficinas.length > 0) {
            let oficinaObj = this.Oficinas.find(x => x.Id_Oficina == idOficina);
            this.NombreOficina = oficinaObj.Nombre;

            this.http.get(this.globales.ruta + 'php/oficinas/get_montos.php', { params: { id_oficina: oficinaObj.Id_Oficina } }).subscribe((data: any) => {
                localStorage.setItem('Montos', JSON.stringify(data.query_data));
            });

            this.globales.Monedas.forEach(element => {
                if (element.MDefault == '1') {
                    localStorage.setItem('monedaDefault', JSON.stringify(element));
                }
            });
        }
    }

    CargarBancosPais(id_pais) {
        if (id_pais == '') {
            this.LimpiarModeloCuentaBancaria();
            this.ListaBancos = [];
            return;
        }

        this.http.get(this.globales.ruta + 'php/bancos/lista_bancos_por_pais.php', { params: { id_pais: id_pais } }).subscribe((data: any) => {
            this.ListaBancos = data;
        });
    }

    LimpiarModeloCuentaBancaria() {
        this.AperturaCuentaModel = {
            Id_Cuenta_Bancaria: '',
            Id_Moneda: '',
            Valor: '',
            Id_Bloqueo_Cuenta: ''
        };
    }

    VerificarAntesDeCierre() {
        this.trasladoCajaService.getTrasladosPendientes(this.user.Identificacion_Funcionario).subscribe((data: any) => {
            if (data.codigo != 'success') {
                this.swalService.ShowMessage(data);
            } else {

                this.router.navigate(['/cierrecaja', this.user.Identificacion_Funcionario]);
            }
        });
    }

    SetOficina() {
        if (localStorage.getItem("Oficina") && localStorage.getItem("Oficina") != '') {
            this.oficina_seleccionada = localStorage.getItem("Oficina");
            this._generalService.SessionDataModel.idOficina = this.oficina_seleccionada;
        } else {
            this.oficina_seleccionada = '';
        }
    }

    SetCaja() {
        if (localStorage.getItem("Caja") && localStorage.getItem("Caja") != '') {
            this.caja_seleccionada = localStorage.getItem("Caja");
            this._generalService.SessionDataModel.idCaja = this.caja_seleccionada;
        } else {
            this.caja_seleccionada = '';
        }
    }

    CheckCajaOficina() {
        var macFormatted = '';
        // this.qz.getMac().subscribe(
        //     data => {
        // for (var i = 0; i < data.macAddress.length; i++) {
        //     macFormatted += data.macAddress[i];
        //     if (i % 2 == 1 && i < data.macAddress.length - 1) {
        //         macFormatted += ":";
        //     }
        // }

        console.log(macFormatted);

        if (this.oficina_seleccionada == '' || this.caja_seleccionada == '') {
            this.http.get(this.globales.ruta + 'php/cajas/get_caja_mac.php', { params: { mac: 'F4:39:09:E3:70:11', id_funcionario: this.user.Identificacion_Funcionario } }).subscribe((data: any) => {

                if (data.mensaje == 'Se han encontrado registros!') {
                    this.oficina_seleccionada = data.query_data.Id_Oficina;
                    this.caja_seleccionada = data.query_data.Id_Caja;

                    localStorage.setItem('Oficina', this.oficina_seleccionada);
                    localStorage.setItem('Caja', this.caja_seleccionada);

                    this.SetNombreOficina(this.oficina_seleccionada);
                    this.SetNombreCaja(this.caja_seleccionada);
                    this.mostrarDatos = true;
                    this.DesconectarQz();
                } else {
                    this.macSwal.title = data.titulo;
                    this.macSwal.html = data.mensaje;
                    this.macSwal.type = data.codigo;
                    this.macSwal.show();
                    this.DesconectarQz();


                    //this.ShowSwal('error', 'Error con Equipo', 'El equipo desde donde intenta ingresar no se encuentra registrado en nuestro sistema, por favor contacte al administrador');
                    /*setTimeout(() => {
                        this.salir();
                    }, 10000);*/
                }
            });
            //this.modalOficinaCaja.show();
        } else {
            this.ListarCajas(this.oficina_seleccionada);
            this.SetNombreOficina(this.oficina_seleccionada);
            this.SetNombreCaja(this.caja_seleccionada);
            this.mostrarDatos = true;
            this.DesconectarQz();
        }
        // },
        // err => {
        //     this.macSwal.title = "QZ TRY NO ENCONTRADO O NO HABILITADO"
        //     this.macSwal.html = "El Software QzTry NO ha sido habilitado o no ha sido encontrado en el sistema, por favor descarguelo <a  href='https://qz.io/' target='_blank'>aqu??</a> y siga <a href='' target='_blank'>estas instucciones</a> para volver a intentarlo"
        //     this.macSwal.type = "error"
        //     this.macSwal.show();
        // }
        // );




    }
    // DesconectarQz() {
    //     this.qz.removePrinter();
    // }
    DesconectarQz() {
        this.qz.removePrinter();
    }

    ComprobarPos() {
        const misPermisos = JSON.parse(window.localStorage.getItem('permisos'));
        let pos = misPermisos.find((permiso) => {
            return permiso.Nombre_Modulo == 'POS';
        })
        if ((pos != null && pos != undefined && pos != '') || JSON.parse(localStorage['User']).Id_Perfil == 2 || JSON.parse(localStorage['User']).Id_Perfil == 3) {
            return true
        } else {
            return false
        }
    }
}
