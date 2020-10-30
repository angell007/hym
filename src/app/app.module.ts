import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormWizardModule } from 'angular2-wizard';
import { ArchwizardModule } from 'ng2-archwizard';
import { FuncionarioService } from './shared/funcionario/funcionario.service'
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ThemeConstants } from './shared/config/theme-constant';
import { ChartsModule } from 'ng2-charts';
import { StickyModule } from 'ng2-sticky-kit';
import { ScrollToModule } from 'ng2-scroll-to';
import { NgxMasonryModule } from 'ngx-masonry';
import { ToastyModule } from 'ng2-toasty';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';
import { DataTablesModule } from 'angular-datatables';
//import { NgxSpinnerModule } from 'ngx-spinner';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { SelectModule } from 'ng-select';
import { QzTrayService } from './shared/qz-tray.service';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module

registerLocaleData(localeES);

//Layout Modules
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

//Directives
import { NgbModule, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
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
import { CuentabancariaService } from './shared/services/cuentasbancarias/cuentabancaria.service';
import { SwalService } from './shared/services/swal/swal.service';
import { RemitenteService } from './shared/services/remitentes/remitente.service';
import { CajeroService } from './shared/services/cajeros/cajero.service';
import { TrasladocajaService } from './shared/services/traslados_caja/trasladocaja.service';
import { PermisoService } from './shared/services/permisos/permiso.service';
import { MonedaService } from './shared/services/monedas/moneda.service';
import { BancoService } from './shared/services/bancos/banco.service';
import { ServiciosexternosService } from './shared/services/serviciosexternos/serviciosexternos.service';
import { ValidacionService } from './shared/services/validaciones/validacion.service';
import { DestinatarioService } from './shared/services/destinatarios/destinatario.service';
import { TipodocumentoService } from './shared/services/tiposdocumento/tipodocumento.service';
import { ToastService } from './shared/services/toasty/toast.service';
import { CajarecaudoService } from './shared/services/cajarecaudos/cajarecaudo.service';
import { TipocuentaService } from './shared/services/tiposcuenta/tipocuenta.service';
import { RemitentegiroService } from './shared/services/remitentesgiros/remitentegiro.service';
import { DestinatariogiroService } from './shared/services/destinatariosgiros/destinatariogiro.service';
import { OficinaService } from './shared/services/oficinas/oficina.service';
import { MovimientoterceroService } from './shared/services/movimientostercero/movimientotercero.service';
import { EgresoService } from './shared/services/egresos/egreso.service';
import { AgenteexternoService } from './shared/services/agentesexternos/agenteexterno.service';
import { TrasladoService } from './shared/services/traslados/traslado.service';
import { IndicadorService } from './shared/services/indicadores/indicador.service';
import { PaisService } from './shared/services/paises/pais.service';
import { CorresponsalbancarioService } from './shared/services/corresponsalesbancarios/corresponsalbancario.service';
import { AperturacajaService } from './shared/services/aperturacaja/aperturacaja.service';
import { NuevofuncionarioService } from './shared/services/funcionarios/nuevofuncionario.service';
import { GrupoService } from './shared/services/gruposfuncionarios/grupo.service';
import { DependenciaService } from './shared/services/dependencias/dependencia.service';
import { CargoService } from './shared/services/cargos/cargo.service';
import { PerfilService } from './shared/services/perfiles/perfil.service';
import { ConfiguracionService } from './shared/services/configuraciones/configuracion.service';
import { WebnavigationService } from './shared/services/navegacionweb/webnavigation.service';
// import { Actualizar } 
// from './shared/services/navegacionweb/webnavigation.service';


//MODALES
import { ModalBasicComponent } from './shared/modal-basic/modal-basic.component';
import { ModalpermisojefeComponent } from './simplecomponents/modalpermisojefe/modalpermisojefe.component';
import { ModaltestComponent } from './modalcomponents/modaltest/modaltest.component';
import { ModalremitenteComponent } from './simplecomponents/modalremitente/modalremitente.component';
import { ModalbancoComponent } from './simplecomponents/modalbanco/modalbanco.component';
import { ModalservicioexternoComponent } from './simplecomponents/modalservicioexterno/modalservicioexterno.component';
import { ModalcuentabancariaComponent } from './simplecomponents/modalcuentabancaria/modalcuentabancaria.component';
import { ModaldestinatarioComponent } from './simplecomponents/modaldestinatario/modaldestinatario.component';
import { ModalcajarecaudoComponent } from './simplecomponents/modalcajarecaudo/modalcajarecaudo.component';
import { ModalmonedaComponent } from './simplecomponents/modalmoneda/modalmoneda.component';

// App Component
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
// import { CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
// import { NgxCurrencyModule } from "ngx-currency";
// import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ngx-currency/src/currency-mask.config";
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
import { CustomcurrencyPipe } from './common/Pipes/customcurrency.pipe';
import { SafePipe } from './common/Pipes/safe.pipe';
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
import { GrupostercerosComponent } from './configuracion/gruposterceros/gruposterceros.component';
import { TablatercerosComponent } from './configuracion/terceros/tablaterceros/tablaterceros.component';
import { ThousandSeparatorDirective } from './shared/directives/thousand-separator.directive';
import { TablabancosComponent } from './configuracion/bancos/tablabancos/tablabancos.component';
import { TablaserviciosexternosComponent } from './serviciosexternos/tablaserviciosexternos/tablaserviciosexternos.component';
import { PaginadorinformativoComponent } from './simplecomponents/paginadorinformativo/paginadorinformativo.component';
import { TablacuentasbancariasComponent } from './configuracion/cuentasbancarias/tablacuentasbancarias/tablacuentasbancarias.component';
import { TabladestinatariosComponent } from './configuracion/destinatarios/tabladestinatarios/tabladestinatarios.component';
import { TablacajarecaudosComponent } from './configuracion/cajarecaudos/tablacajarecaudos/tablacajarecaudos.component';
import { TablaremitenteComponent } from './configuracion/remitente/tablaremitente/tablaremitente.component';
import { TablatipodocumentoComponent } from './configuracion/tipodocumento/tablatipodocumento/tablatipodocumento.component';
import { ModaltipodocumentoComponent } from './simplecomponents/modaltipodocumento/modaltipodocumento.component';
import { ModaltipocuentaComponent } from './simplecomponents/modaltipocuenta/modaltipocuenta.component';
import { TablatipocuentaComponent } from './configuracion/tipocuenta/tablatipocuenta/tablatipocuenta.component';
import { TablamonedasComponent } from './configuracion/monedas/tablamonedas/tablamonedas.component';
import { TablaremitentegiroComponent } from './configuracion/informaciongiros/tablaremitentegiro/tablaremitentegiro.component';
import { TabladestinatariogiroComponent } from './configuracion/informaciongiros/tabladestinatariogiro/tabladestinatariogiro.component';
import { ModalremitentegiroComponent } from './simplecomponents/modalremitentegiro/modalremitentegiro.component';
import { ModaldestinatariogiroComponent } from './simplecomponents/modaldestinatariogiro/modaldestinatariogiro.component';
import { TablacajasComponent } from './configuracion/cajas/tablacajas/tablacajas.component';
import { ModalcajaComponent } from './simplecomponents/modalcaja/modalcaja.component';
import { TablaoficinasComponent } from './configuracion/oficinas/tablaoficinas/tablaoficinas.component';
import { ModaloficinaComponent } from './simplecomponents/modaloficina/modaloficina.component';
import { TablaverterceroComponent } from './configuracion/terceros/tablavertercero/tablavertercero.component';
import { TablatotalesterceroComponent } from './configuracion/terceros/tablatotalestercero/tablatotalestercero.component';
import { TablatotalesmonedaterceroComponent } from './configuracion/terceros/tablatotalesmonedatercero/tablatotalesmonedatercero.component';
import { ModalajusteterceroComponent } from './simplecomponents/modalajustetercero/modalajustetercero.component';
import { InformativetotalmonedatercerocardComponent } from './simplecomponents/informativetotalmonedatercerocard/informativetotalmonedatercerocard.component';
import { ColorsaldoPipe } from './common/Pipes/colorsaldo.pipe';
import { ColorsaldoDirective } from './common/CustomAtributeDirectives/colorsaldo.directive';
import { TablaegresosComponent } from './egresos/tablaegresos/tablaegresos.component';
import { ModalegresoComponent } from './simplecomponents/modalegreso/modalegreso.component';
import { TablacomprasrealizadasComponent } from './configuracion/compras/tablacomprasrealizadas/tablacomprasrealizadas.component';
import { TablaagentesexternosComponent } from './agentesexternos/tablaagentesexternos/tablaagentesexternos.component';
import { ModalagenteexternoComponent } from './simplecomponents/modalagenteexterno/modalagenteexterno.component';
import { ModaltrasladoComponent } from './simplecomponents/modaltraslado/modaltraslado.component';
import { TablatrasladosComponent } from './traslados/tablatraslados/tablatraslados.component';
import { CorresponsalbancarioComponent } from './tableros/tablerocajero/corresponsalbancario/corresponsalbancario.component';
import { TablamovimientoscorresponsalComponent } from './tableros/tablerocajero/tablamovimientoscorresponsal/tablamovimientoscorresponsal.component';
import { ModalcorresponsaldiarioComponent } from './simplecomponents/modalcorresponsaldiario/modalcorresponsaldiario.component';
import { AdministrarfuncionarioComponent } from './configuracion/funcionarios/administrarfuncionario/administrarfuncionario.component';
import { TablafuncionariosComponent } from './configuracion/funcionarios/tablafuncionarios/tablafuncionarios.component';
import { ManagedefaultsComponent } from './simplecomponents/managedefaults/managedefaults.component';
import { TablatransferenciascajeroComponent } from './pos/transferencias/tablatransferenciascajero/tablatransferenciascajero.component';
import { DetalletransferenciaComponent } from './pos/transferencias/detalletransferencia/detalletransferencia.component';
import { ModaldetallerecibotransferenciaComponent } from './simplecomponents/modaldetallerecibotransferencia/modaldetallerecibotransferencia.component';
import { CorresponsalesbancarioscajeroComponent } from './pos/corresponsales/corresponsalesbancarioscajero/corresponsalesbancarioscajero.component';
import { ModalaperturacuentaComponent } from './simplecomponents/modalaperturacuenta/modalaperturacuenta.component';
import { CierrecuentasconsultorComponent } from './tableros/tableroconsultor/cierrecuentasconsultor/cierrecuentasconsultor.component';
import { TablaregistroscorresponsalesdiariosComponent } from './pos/corresponsales/tablaregistroscorresponsalesdiarios/tablaregistroscorresponsalesdiarios.component';
import { AperturacuentasconsultorComponent } from './tableros/tableroconsultor/aperturacuentasconsultor/aperturacuentasconsultor.component';
import { VistaprincipalconsultorComponent } from './tableros/tableroconsultor/vistaprincipalconsultor/vistaprincipalconsultor.component';
import { CuadrecuentasconsultorComponent } from './tableros/tableroconsultor/cuadrecuentasconsultor/cuadrecuentasconsultor.component';
import { ModalpagostransferenciaComponent } from './simplecomponents/modalpagostransferencia/modalpagostransferencia.component';
import { ModaldevoluciontransferenciaComponent } from './simplecomponents/modaldevoluciontransferencia/modaldevoluciontransferencia.component';
import { ModalabonocompracuentaComponent } from './simplecomponents/modalabonocompracuenta/modalabonocompracuenta.component';
import { ModalamovertransferenciaComponent } from './simplecomponents/modalamovertransferencia/modalamovertransferencia.component';
import { DetallemovimientoscuentaComponent } from './tableros/tableroconsultor/detallemovimientoscuenta/detallemovimientoscuenta.component';
import { ModalajustecuentaComponent } from './simplecomponents/modalajustecuenta/modalajustecuenta.component';
import { CuentasconsultorComponent } from './cuentasconsultor/cuentasconsultor.component';
import { TableroagenteexternoComponent } from './tableros/tableroagenteexterno/tableroagenteexterno.component';
import { DetallemovimientoscuentagerenteComponent } from './configuracion/cuentasbancarias/detallemovimientoscuentagerente/detallemovimientoscuentagerente.component';
import { TrasladoscajaComponent } from './trasladoscaja/trasladoscaja.component';
import { TablatasladoscajaComponent } from './trasladoscaja/tablatasladoscaja/tablatasladoscaja.component';
import { HourPipe } from './hour.pipe';
import { ConsolidadoComponent } from './tableros/tablerocajero/consolidado/consolidado.component';
import { TesCustomServiceService } from './tes-custom-service.service';
import { ActualizarService } from './customservices/actualizar.service';
import { NgxCurrencyModule } from "ngx-currency";
import { ModaldevoluccionComponent } from './modaldevoluccion/modaldevoluccion.component';



export const customCurrencyMaskConfig = {
    align: "left",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ".",
    nullable: true,
    min: null,
    max: null,
    // inputMode: CurrencyMaskInputMode.NATURAL
};


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, { useHash: false }),
        NgbModule.forRoot(),
        PerfectScrollbarModule,
        HttpClientModule,
        HttpModule,
        ReactiveFormsModule,
        //FormWizardModule,
        ArchwizardModule,
        NgxDatatableModule,
        DataTablesModule,
        ChartsModule,
        NvD3Module,
        StickyModule,
        ToastyModule.forRoot(),
        NgxMasonryModule,
        ScrollToModule.forRoot(),
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-outline-primary btn-rounded',
            cancelButtonClass: 'btn btn-outline-danger btn-rounded'
        }),
        NgxMaskModule.forRoot(),
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
        MDBBootstrapModule.forRoot(),
        MyDateRangePickerModule,
        SelectModule,
        NgxPaginationModule
    ],
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [
        PuntosPipe,
        CustomcurrencyPipe,
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
        TablatercerosComponent,
        ThousandSeparatorDirective,
        ModalpermisojefeComponent,
        ModalremitenteComponent,
        TablabancosComponent,
        ModalbancoComponent,
        TablaserviciosexternosComponent,
        PaginadorinformativoComponent,
        ModalservicioexternoComponent,
        TablacuentasbancariasComponent,
        ModalcuentabancariaComponent,
        TabladestinatariosComponent,
        ModaldestinatarioComponent,
        TablacajarecaudosComponent,
        ModalcajarecaudoComponent,
        TablaremitenteComponent,
        TablatipodocumentoComponent,
        ModaltipodocumentoComponent,
        ModaltipocuentaComponent,
        TablatipocuentaComponent,
        TablamonedasComponent,
        ModalmonedaComponent,
        TablaremitentegiroComponent,
        TabladestinatariogiroComponent,
        ModalremitentegiroComponent,
        ModaldestinatariogiroComponent,
        TablacajasComponent,
        ModalcajaComponent,
        TablaoficinasComponent,
        ModaloficinaComponent,
        TablaverterceroComponent,
        TablatotalesterceroComponent,
        TablatotalesmonedaterceroComponent,
        ModalajusteterceroComponent,
        InformativetotalmonedatercerocardComponent,
        ColorsaldoPipe,
        ColorsaldoDirective,
        SafePipe,
        TablaegresosComponent,
        ModalegresoComponent,
        TablacomprasrealizadasComponent,
        TablaagentesexternosComponent,
        ModalagenteexternoComponent,
        ModaltrasladoComponent,
        TablatrasladosComponent,
        CorresponsalbancarioComponent,
        TablamovimientoscorresponsalComponent,
        ModalcorresponsaldiarioComponent,
        AdministrarfuncionarioComponent,
        TablafuncionariosComponent,
        ManagedefaultsComponent,
        TablatransferenciascajeroComponent,
        DetalletransferenciaComponent,
        ModaldetallerecibotransferenciaComponent,
        CorresponsalesbancarioscajeroComponent,
        ModalaperturacuentaComponent,
        CierrecuentasconsultorComponent,
        TablaregistroscorresponsalesdiariosComponent,
        AperturacuentasconsultorComponent,
        VistaprincipalconsultorComponent,
        CuadrecuentasconsultorComponent,
        ModalpagostransferenciaComponent,
        ModaldevoluciontransferenciaComponent,
        ModalabonocompracuentaComponent,
        ModalamovertransferenciaComponent,
        DetallemovimientoscuentaComponent,
        ModalajustecuentaComponent,
        CuentasconsultorComponent,
        TableroagenteexternoComponent,
        DetallemovimientoscuentagerenteComponent,
        TrasladoscajaComponent,
        TablatasladoscajaComponent,
        HourPipe,
        ConsolidadoComponent,
        ModaldevoluccionComponent
    ],
    exports: [
        ModalBasicComponent
    ],
    providers: [
        ActualizarService,
        QzTrayService,
        CambioService,
        CompraService,
        ProveedorService,
        CajaService,
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
        PuntosPipe,
        CustomcurrencyPipe,
        NgbDropdown,
        // { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
        { provide: LOCALE_ID, useValue: 'es-CO' },
        CuentabancariaService,
        SwalService,
        RemitenteService,
        CajeroService,
        TrasladocajaService,
        PermisoService,
        MonedaService,
        BancoService,
        ServiciosexternosService,
        ValidacionService,
        DestinatarioService,
        TipodocumentoService,
        TipocuentaService,
        ToastService,
        CajarecaudoService,
        RemitentegiroService,
        DestinatariogiroService,
        OficinaService,
        MovimientoterceroService,
        DatePipe,
        EgresoService,
        AgenteexternoService,
        TrasladoService,
        IndicadorService,
        PaisService,
        CorresponsalbancarioService,
        AperturacajaService,
        NuevofuncionarioService,
        GrupoService,
        DependenciaService,
        CargoService,
        PerfilService,
        ConfiguracionService,
        SafePipe,
        WebnavigationService,
        // TransferenciasconsultorService,
        TransferenciaService,
        TesCustomServiceService

    ],
    bootstrap: [AppComponent],
    entryComponents: [TableroauditoriaComponent, TablerocajeroComponent, TablerocajeroprincipalComponent, TableroconsultorComponent, TablerogerenciaComponent, VistaprincipalconsultorComponent]
})


export class AppModule { }
