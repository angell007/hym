import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormWizardModule } from 'angular2-wizard';
import { FuncionarioService } from './shared/funcionario/funcionario.service'
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { ThemeConstants } from './shared/config/theme-constant';
import { ChartsModule } from 'ng2-charts';
import { StickyModule } from 'ng2-sticky-kit';
import { ScrollToModule } from 'ng2-scroll-to';
import { NgxMasonryModule } from 'ngx-masonry';
import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';

//Layout Modules
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

//Directives
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Sidebar_Directives } from './shared/directives/side-nav.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Routing Module
import { AppRoutes } from './app.routing';
import { AuthGuard } from './auth/auth.guard';

// App Component
import { ModalBasicComponent } from './shared/modal-basic/modal-basic.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CofiguracionComponent } from './configuracion/cofiguracion/cofiguracion.component';
import { OficinasComponent } from './configuracion/oficinas/oficinas.component';
import { CajasComponent } from './configuracion/cajas/cajas.component';
import { BancosComponent } from './configuracion/bancos/bancos.component';
import { CuentasbancariasComponent } from './configuracion/cuentasbancarias/cuentasbancarias.component';
import { PerfilesComponent } from './configuracion/perfiles/perfiles.component';
import { FuncionariosComponent } from './configuracion/funcionarios/funcionarios.component';
import { FuncionariocrearComponent } from './configuracion/funcionariocrear/funcionariocrear.component';
import { ClientesComponent } from './configuracion/clientes/clientes.component';
import { ProveedoresComponent } from './configuracion/proveedores/proveedores.component';
import { DestinatariosComponent } from './configuracion/destinatarios/destinatarios.component';
import { AgentesexternosComponent } from './agentesexternos/agentesexternos.component';
import { TrasladosComponent } from './traslados/traslados.component';
import { PosComponent } from './pos/pos.component';
import { GirosComponent } from './giros/giros.component';
import { CorresponsalesbancariosComponent } from './corresponsalesbancarios/corresponsalesbancarios.component';
import { ServiciosexternosComponent } from './serviciosexternos/serviciosexternos.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { TransferenciasComponent } from './transferencias/transferencias.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, { useHash: false }),
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormWizardModule,
        NgxDatatableModule,
        ChartsModule,
        NvD3Module,
        StickyModule,
        NgxMasonryModule,
        ScrollToModule.forRoot(),
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-danger'  
          }) 
    ],
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        AuthenticationLayoutComponent,
        Sidebar_Directives,
        LoginComponent,
        CofiguracionComponent,
        OficinasComponent,
        CajasComponent,
        BancosComponent,
        CuentasbancariasComponent,
        PerfilesComponent,
        FuncionariosComponent,
        FuncionariocrearComponent,
        ClientesComponent,
        ProveedoresComponent,
        DestinatariosComponent,
        ModalBasicComponent,
        AgentesexternosComponent,
        TrasladosComponent,
        PosComponent,
        GirosComponent,
        CorresponsalesbancariosComponent,
        ServiciosexternosComponent,
        IndicadoresComponent,
        TransferenciasComponent,
    ],
    exports:[
        ModalBasicComponent
    ],
    providers: [
        FuncionarioService,
        AuthGuard,
        ThemeConstants
    ],
    bootstrap: [AppComponent]
})


export class AppModule { }
