import {Component, Directive, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { NgForm } from '../../../node_modules/@angular/forms';
import { Globales } from '../shared/globales/globales';
import { HttpClient } from '@angular/common/http';





@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html'
})

export class CommonLayoutComponent implements OnInit {

    public app : any;
    public headerThemes: any;
    public changeHeader: any;
    public sidenavThemes: any;
    public changeSidenav: any;
    public headerSelected: any;
    public sidenavSelected : any;
    public searchActived : any;
    public searchModel: any;
    public user : any;
    public changePasswordMessage: string;
    public alertas : any[];

    @ViewChild('confirmSwal') confirmSwal:any;
    @ViewChild('ModalCambiarContrasena') ModalCambiarContrasena:any;

    constructor(private router : Router, private http : HttpClient, private globales: Globales, private toastyService: ToastyService) {
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


    ngOnInit(){
        this.user = JSON.parse(localStorage.User);
        this.http.get(this.globales.ruta+'php/sesion/alerta.php',{ params: { id: this.user.Identificacion_Funcionario}}).subscribe((data:any)=>{
            this.alertas= data;
        });
        if(this.user.Password==this.user.Username)
        {
          this.ModalCambiarContrasena.show(); 
        }
        
    }
    salir(){
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
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function (toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
        this.toastyService.error(toastOptions);  
    }



    CambiarContrasena(formulario:NgForm)
    {
      console.log(formulario.value);    
      let datos = new FormData();
      datos.append("clave", formulario.value.clave);
      datos.append("user", this.user.Identificacion_Funcionario);
      this.http.post(this.globales.ruta+'php/funcionarios/cambia_clave.php',datos).subscribe((data:any)=>{          
        this.changePasswordMessage = data.Mensaje;
        console.log(this.changePasswordMessage);  
        formulario.reset();
        this.ModalCambiarContrasena.hide();
        this.confirmSwal.show();
      }); 
      
    }










}
