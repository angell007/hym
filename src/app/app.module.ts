import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { FormWizardModule } from 'angular2-wizard';
import { FuncionarioService } from './shared/funcionario/funcionario.service'
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { ThemeConstants } from './shared/config/theme-constant';
import { ChartsModule } from 'ng2-charts';
import { StickyModule } from 'ng2-sticky-kit';
import { ScrollToModule } from 'ng2-scroll-to';
import { NgxMasonryModule } from 'ngx-masonry';
import { ToastyModule } from 'ng2-toasty';
import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';
import { DataTablesModule } from 'angular-datatables';
//import { NgxSpinnerModule } from 'ngx-spinner';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';

registerLocaleData(localeES);

//Layout Modules
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

//Directives
import { NgbModule, NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import { Sidebar_Directives } from './shared/directives/side-nav.directive';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { Globales } from './shared/globales/globales';

// Routing Module
import { AppRoutes } from './app.routing';
import { AuthGuard } from './auth/auth.guard';

//Services
import { CambioService } from './shared/services/cambio.service';
import { GrupoterceroService } from './shared/services/grupotercero.service';
import { CompraService } from './shared/services/compra/compra.service';
import { ProveedorService } from './shared/services/proveedor/proveedor.service';
import { TerceroService } from './shared/services/tercero/tercero.service';
import { CajaService } from './shared/services/caja/caja.service';
import { TransferenciaService } from './shared/services/transferencia/transferencia.service';
import { GiroService } from './shared/services/giro/giro.service';
import { DepartamentoService } from './shared/services/departamento/departamento.service';
import { MunicipioService } from './shared/services/municipio/municipio.service';
import { DocumentoService } from './shared/services/documento/documento.service';
import { GeneralService } from './shared/services/general/general.service';

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
import { TercerosComponent } from './configuracion/terceros/terceros.component';
import { GruposComponent } from './configuracion/grupos/grupos.component';
import { TipodocumentoComponent } from './configuracion/tipodocumento/tipodocumento.component';
import { MonedasComponent } from './configuracion/monedas/monedas.component';
import { NgxMaskModule } from 'ngx-mask'
import { NgxCurrencyModule } from "ngx-currency";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ngx-currency/src/currency-mask.config";
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CajarecaudosComponent } from './configuracion/cajarecaudos/cajarecaudos.component';
import { ComprasComponent } from './configuracion/compras/compras.component';
import { EgresosComponent } from './egresos/egresos.component';
import { BalancegeneralComponent } from './indicadores/balancegeneral/balancegeneral.component';
import { FlujoefectivoComponent } from './indicadores/flujoefectivo/flujoefectivo.component';
import { CuentascobrarComponent } from './indicadores/cuentascobrar/cuentascobrar.component';
import { CuentaspagarComponent } from './indicadores/cuentaspagar/cuentaspagar.component';
import { CuentastercerosComponent } from './indicadores/cuentasterceros/cuentasterceros.component';
import { InformaciongirosComponent } from './configuracion/informaciongiros/informaciongiros.component';
import { FuncionarioeditarComponent } from './configuracion/funcionarioeditar/funcionarioeditar.component';
import { FuncionarioverComponent } from './configuracion/funcionariover/funcionariover.component';
import { LiquidacionsalarioComponent } from './liquidacionsalario/liquidacionsalario.component';
import { TipodocumentoextranjeroComponent } from './configuracion/tipodocumentoextranjero/tipodocumentoextranjero.component';
import { TipocuentaComponent } from './configuracion/tipocuenta/tipocuenta.component';
import { CargosComponent } from './configuracion/cargos/cargos.component';
import { PerfilcrearComponent } from './configuracion/perfilcrear/perfilcrear.component';
import { PerfileditarComponent } from './configuracion/perfileditar/perfileditar.component';
import { PerfilComponent } from './configuracion/perfil/perfil.component';
import { OficinascrearComponent } from './configuracion/oficinas/oficinascrear/oficinascrear.component';
import { OficinaseditarComponent } from './configuracion/oficinas/oficinaseditar/oficinaseditar.component';
import { OficinaverComponent } from './configuracion/oficinas/oficinaver/oficinaver.component';
import { CuentasbancariasverComponent } from './configuracion/cuentasbancarias/cuentasbancariasver/cuentasbancariasver.component';
import { RemitenteComponent } from './configuracion/remitente/remitente.component';
import { TercerosverComponent } from './configuracion/terceros/tercerosver/tercerosver.component';
import { TransferenciaverComponent } from './transferencias/transferenciaver/transferenciaver.component';
import { TableroComponent } from './tablero/tablero.component';
import { TablerocajeroComponent } from './tableros/tablerocajero/tablerocajero.component';
import { TablerocajeroprincipalComponent } from './tableros/tablerocajeroprincipal/tablerocajeroprincipal.component';
import { TableroconsultorComponent } from './tableros/tableroconsultor/tableroconsultor.component';
import { TableroauditoriaComponent } from './tableros/tableroauditoria/tableroauditoria.component';
import { TablerogerenciaComponent } from './tableros/tablerogerencia/tablerogerencia.component';
import { TableroDirective } from "./tablero/tablero.directive";
import { ComprascrearComponent } from './configuracion/compras/comprascrear/comprascrear.component';
import { CompraseditarComponent } from './configuracion/compras/compraseditar/compraseditar.component';
import { cardPortletRefresh, cardPortletDelete } from './shared/directives/cards.directive';
import { CreardestinatarioComponent } from './creardestinatario/creardestinatario.component';
import { CierrecajaComponent } from './cierrecaja/cierrecaja.component';
import { PuntosPipe } from './common/Pipes/puntos.pipe';
import { InformativecardComponent } from './simplecomponents/informativecard/informativecard.component';
import { GraficabarraComponent } from './graficabarra/graficabarra.component';
import { TablatransferenciasComponent } from './tableros/tableroconsultor/tablatransferencias/tablatransferencias.component';
import { TablatransferenciasrealizadasComponent } from './tableros/tableroconsultor/tablatransferenciasrealizadas/tablatransferenciasrealizadas.component';
import { TablatransferenciasdevueltasComponent } from './tableros/tableroconsultor/tablatransferenciasdevueltas/tablatransferenciasdevueltas.component';
import { DatachartComponent } from './simplecomponents/datachart/datachart.component';
import { FuncionarioactivosComponent } from './tableros/tablerocajeroprincipal/funcionarioactivos/funcionarioactivos.component';
import { TablaresumentotalizadoComponent } from './tableros/tablerocajeroprincipal/tablaresumentotalizado/tablaresumentotalizado.component';
import { FuncionarioinformativecardComponent } from './simplecomponents/funcionarioinformativecard/funcionarioinformativecard.component';
import { TablaresumenmunicipioComponent } from './complexcomponents/tablaresumenmunicipio/tablaresumenmunicipio.component';
import { TablatotalesmonedasComponent } from './simplecomponents/tablatotalesmonedas/tablatotalesmonedas.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { TablacomprasComponent } from './configuracion/compras/tablacompras/tablacompras.component';
import { ModaltestComponent } from './modalcomponents/modaltest/modaltest.component';
import { GrupostercerosComponent } from './configuracion/gruposterceros/gruposterceros.component';
import { TablatercerosComponent } from './configuracion/terceros/tablaterceros/tablaterceros.component';

 
export var CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    allowZero: false,
    decimal: ",",
    precision: 2,
    prefix: " ",
    suffix: "",
    thousands: ".",
    nullable: false
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, { useHash: false }),
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        HttpClientModule,
        HttpModule,
        ReactiveFormsModule,
        //FormWizardModule,
        NgxDatatableModule,
        DataTablesModule,
        ChartsModule,
        NvD3Module,
        StickyModule,
        ToastyModule,
        NgxMasonryModule,
        ScrollToModule.forRoot(),
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn btn-danger'  
          }),
        NgxMaskModule.forRoot(),
        NgxCurrencyModule,
        MDBBootstrapModule.forRoot(),
        MyDateRangePickerModule
        //NgxSpinnerModule
    ],
    schemas: [ NO_ERRORS_SCHEMA ],
    declarations: [
        PuntosPipe,
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
        TercerosComponent,
        GruposComponent,
        TipodocumentoComponent,
        MonedasComponent,
        CajarecaudosComponent,
        ComprasComponent,
        EgresosComponent,
        BalancegeneralComponent,
        FlujoefectivoComponent,
        CuentascobrarComponent,
        CuentaspagarComponent,
        CuentastercerosComponent,
        InformaciongirosComponent,
        InformaciongirosComponent,
        FuncionarioeditarComponent,
        FuncionarioverComponent,
        LiquidacionsalarioComponent,
        TipodocumentoextranjeroComponent,
        TipocuentaComponent,
        CargosComponent,
        PerfilcrearComponent,
        PerfileditarComponent,
        PerfilComponent,
        OficinascrearComponent,
        OficinaseditarComponent,
        OficinaverComponent,
        CuentasbancariasverComponent,
        RemitenteComponent,
        TercerosverComponent,
        TransferenciaverComponent,
        TableroComponent,
        TablerocajeroComponent,
        TablerocajeroprincipalComponent,
        TableroconsultorComponent,
        TableroauditoriaComponent,
        TablerogerenciaComponent,
        TableroDirective,
        ComprascrearComponent,
        CompraseditarComponent,
        cardPortletRefresh,
        cardPortletDelete,
        CreardestinatarioComponent,
        CierrecajaComponent,
        InformativecardComponent,
        GraficabarraComponent,
        TablatransferenciasComponent,
        TablatransferenciasrealizadasComponent,
        TablatransferenciasdevueltasComponent,
        DatachartComponent,
        FuncionarioactivosComponent,
        TablaresumentotalizadoComponent,
        FuncionarioinformativecardComponent,
        TablaresumenmunicipioComponent,
        TablatotalesmonedasComponent,
        TablacomprasComponent,
        ModaltestComponent,
        GrupostercerosComponent,
        TablatercerosComponent
    ],
    exports:[
        ModalBasicComponent
    ],
    providers: [
        CambioService,
        CompraService,
        ProveedorService,
        CajaService,
        TransferenciaService,
        FuncionarioService,
        GiroService,
        GrupoterceroService,
        TerceroService,
        DepartamentoService,
        MunicipioService,
        DocumentoService,
        GeneralService,
        AuthGuard,
        ThemeConstants,
        Globales,
        NgbDropdown,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
        { provide: LOCALE_ID, useValue: "es" }
    ],
    bootstrap: [AppComponent],
    entryComponents: [TableroauditoriaComponent,TablerocajeroComponent,TablerocajeroprincipalComponent,TableroconsultorComponent,TablerogerenciaComponent]
})


export class AppModule { }
