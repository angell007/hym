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

    @ViewChild('confirmSwal') confirmSwal: any;
    @ViewChild('ModalCambiarContrasena') ModalCambiarContrasena: any;
    cajero = true;

    ticks = 0;

    minutesDisplay: number = 0;
    hoursDisplay: number = 0;
    secondsDisplay: number = 0;

    sub: Subscription;
    myDate: Date;

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


    ngOnInit() {
        this.user = JSON.parse(localStorage.User);

        switch (this.user.Id_Cargo) {
            case "3": {
                this.cajero = false;
                break;
            }
            default:{
                this.cajero = true;
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
}
