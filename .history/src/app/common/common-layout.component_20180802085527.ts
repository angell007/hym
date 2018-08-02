import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

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

    constructor(private router : Router,private toastyService: ToastyService) {
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
        this.toastyService.default('Hi there');
        // Or create the instance of ToastOptions
        var toastOptions:ToastOptions = {
            title: "My title",
            msg: "The message",
            showClose: true,
            timeout: 5000,
            theme: 'default',
            onAdd: (toast:ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function(toast:ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };
        // Add see all possible types in one shot
        this.toastyService.info(toastOptions);
        this.toastyService.success(toastOptions);
        this.toastyService.wait(toastOptions);
        this.toastyService.error(toastOptions);
        this.toastyService.warning(toastOptions);
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
}
