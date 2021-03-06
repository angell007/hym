import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./auth/auth.guard";

// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
import { TransferenciasComponent } from './transferencias/transferencias.component';
import { TrasladosComponent } from './traslados/traslados.component';
import { PosComponent } from './pos/pos.component';
import { GirosComponent } from './giros/giros.component';
import { CorresponsalesbancariosComponent } from './corresponsalesbancarios/corresponsalesbancarios.component';
import { ServiciosexternosComponent } from './serviciosexternos/serviciosexternos.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { TercerosComponent } from './configuracion/terceros/terceros.component';
import { GruposComponent } from './configuracion/grupos/grupos.component';
import { TipodocumentoComponent } from './configuracion/tipodocumento/tipodocumento.component';
import { MonedasComponent } from './configuracion/monedas/monedas.component';
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
import { TipodocumentoextranjeroComponent } from "./configuracion/tipodocumentoextranjero/tipodocumentoextranjero.component";
import { TipocuentaComponent } from "./configuracion/tipocuenta/tipocuenta.component";
import { LiquidacionsalarioComponent } from "./liquidacionsalario/liquidacionsalario.component";
import { CargosComponent } from "./configuracion/cargos/cargos.component";
import { PerfilComponent } from "./configuracion/perfil/perfil.component";
import { PerfilcrearComponent } from './configuracion/perfilcrear/perfilcrear.component';
import { PerfileditarComponent } from './configuracion/perfileditar/perfileditar.component';
import { OficinascrearComponent } from "./configuracion/oficinas/oficinascrear/oficinascrear.component";
import { OficinaseditarComponent } from "./configuracion/oficinas/oficinaseditar/oficinaseditar.component";
import { OficinaverComponent } from "./configuracion/oficinas/oficinaver/oficinaver.component";
import { CuentasbancariasverComponent } from './configuracion/cuentasbancarias/cuentasbancariasver/cuentasbancariasver.component';
import { RemitenteComponent } from "./configuracion/remitente/remitente.component";
import { TercerosverComponent } from './configuracion/terceros/tercerosver/tercerosver.component';
import { TransferenciaverComponent } from "./transferencias/transferenciaver/transferenciaver.component";
import { TableroComponent } from './tablero/tablero.component';
import { ComprascrearComponent } from './configuracion/compras/comprascrear/comprascrear.component';
import { CompraseditarComponent } from './configuracion/compras/compraseditar/compraseditar.component';
import { CierrecajaComponent } from './cierrecaja/cierrecaja.component';
import { GrupostercerosComponent } from './configuracion/gruposterceros/gruposterceros.component';
import { AdministrarfuncionarioComponent } from './configuracion/funcionarios/administrarfuncionario/administrarfuncionario.component';
import { CierrecuentasconsultorComponent } from './tableros/tableroconsultor/cierrecuentasconsultor/cierrecuentasconsultor.component';
import { CuadrecuentasconsultorComponent } from './tableros/tableroconsultor/cuadrecuentasconsultor/cuadrecuentasconsultor.component';
import { DetallemovimientoscuentaComponent } from './tableros/tableroconsultor/detallemovimientoscuenta/detallemovimientoscuenta.component';
import { CuentasconsultorComponent } from './cuentasconsultor/cuentasconsultor.component';
import { DetallemovimientoscuentagerenteComponent } from './configuracion/cuentasbancarias/detallemovimientoscuentagerente/detallemovimientoscuentagerente.component';
import { TrasladoscajaComponent } from './trasladoscaja/trasladoscaja.component';
import { ConsolidadosService } from './customservices/consolidados.service';
import { ConsolidadoComponent } from './tableros/tablerocajero/consolidado/consolidado.component';
import { TablerocajeroprincipalComponent } from './tableros/tablerocajeroprincipal/tablerocajeroprincipal.component';
import { MotivoscambioComponent } from './motivoscambio/motivoscambio.component';
import { LogComponent } from './configuracion/log/log.component';
import { TableroconsultorComponent } from './tableros/tableroconsultor/tableroconsultor.component';
import { VistaprincipalconsultorComponent } from './tableros/tableroconsultor/vistaprincipalconsultor/vistaprincipalconsultor.component';
import { RedirectComponent } from './redirect/redirect.component';
import { CajasAbiertasComponent } from './cajas-abiertas/cajas-abiertas.component';
import { FlujoEfectivoComponent } from './components/flujo-efectivo/flujo-efectivo.component';
import { PagoAgentesExternosComponent } from './pago-agentes-externos/pago-agentes-externos.component';
import { ArriveServiceComponent } from './servicio-externo/arrive-service/arrive-service.component';

// insert into Funcionario_Modulo (`Id_Funcionario`, `Id_Modulo`) SELECT fun.Identificacion_Funcionario, modi.Id_Modulo FROM Modulo as modi inner join Funcionario fun on fun.Identificacion_Funcionario = 9999999

export const AppRoutes: Routes = [

    {
        path: 'servicio-externo', component: CommonLayoutComponent,
        children: [{ path: '', component: ArriveServiceComponent, canActivate: [AuthGuard] }]
    },

    // {
    //     path: 'servicio-externo',
    //     component: ArriveServiceComponent
    //     // component: CommonLayoutComponent, loadChildren: () => import('./servicio-externo/servicio-externo.module').then(m => m.ServicioExternoModule)
    // },

    {
        path: 'tablero', component: CommonLayoutComponent,
        children: [{ path: '', component: TableroComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'aperturados', component: CommonLayoutComponent,
        children: [{ path: '', component: CajasAbiertasComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'flujo', component: CommonLayoutComponent,
        children: [{ path: '', component: FlujoEfectivoComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'consultor', component: CommonLayoutComponent,
        children: [{ path: '', component: RedirectComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'recaudador', component: CommonLayoutComponent,
        children: [{ path: '', component: RedirectComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cajero', component: CommonLayoutComponent,
        children: [{ path: '', component: RedirectComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cajero-principal', component: CommonLayoutComponent,
        children: [{ path: '', component: RedirectComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cajeros', component: CommonLayoutComponent,
        children: [{ path: '', component: TablerocajeroprincipalComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'configuraciongeneral', component: CommonLayoutComponent,
        children: [{ path: '', component: CofiguracionComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'oficinas', component: CommonLayoutComponent,
        children: [{ path: '', component: OficinasComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cajas', component: CommonLayoutComponent,
        children: [{ path: '', component: CajasComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'log', component: CommonLayoutComponent,
        children: [{ path: '', component: LogComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'bancos', component: CommonLayoutComponent,
        children: [{ path: '', component: BancosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cuentasbancarias', component: CommonLayoutComponent,
        children: [{ path: '', component: CuentasbancariasComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'perfiles', component: CommonLayoutComponent,
        children: [{ path: '', component: PerfilesComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'perfil/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: PerfilComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'perfilcrear', component: CommonLayoutComponent,
        children: [{ path: '', component: PerfilcrearComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'perfileditar/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: PerfileditarComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'funcionarios', component: CommonLayoutComponent,
        children: [{ path: '', component: FuncionariosComponent, canActivate: [AuthGuard] }]
    },
    // {
    //     path: 'funcionariocrear', component: CommonLayoutComponent,
    //     children: [{ path: '', component: FuncionariocrearComponent, canActivate: [AuthGuard] }]
    // },
    {
        path: 'administrarfuncionario/:id_funcionario', component: CommonLayoutComponent,
        children: [{ path: '', component: AdministrarfuncionarioComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'clientes', component: CommonLayoutComponent,
        children: [{ path: '', component: ClientesComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'proveedores', component: CommonLayoutComponent,
        children: [{ path: '', component: ProveedoresComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'destinatarios', component: CommonLayoutComponent,
        children: [{ path: '', component: DestinatariosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'agentesexternos', component: CommonLayoutComponent,
        children: [{ path: '', component: AgentesexternosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'transferencias', component: CommonLayoutComponent,
        children: [{ path: '', component: TransferenciasComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'traslados', component: CommonLayoutComponent,
        children: [{ path: '', component: TrasladosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'trasladoscaja', component: CommonLayoutComponent,
        children: [{ path: '', component: TrasladoscajaComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'pos', component: CommonLayoutComponent,
        children: [{ path: '', component: PosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'giros', component: CommonLayoutComponent,
        children: [{ path: '', component: GirosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'corresponsalesbancarios', component: CommonLayoutComponent,
        children: [{ path: '', component: CorresponsalesbancariosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'serviciosexternos', component: CommonLayoutComponent,
        children: [{ path: '', component: ServiciosexternosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'indicadores', component: CommonLayoutComponent,
        children: [{ path: '', component: IndicadoresComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'terceros', component: CommonLayoutComponent,
        children: [{ path: '', component: TercerosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'grupos', component: CommonLayoutComponent,
        children: [{ path: '', component: GruposComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'tipodocumento', component: CommonLayoutComponent,
        children: [{ path: '', component: TipodocumentoComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'monedas', component: CommonLayoutComponent,
        children: [{ path: '', component: MonedasComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cajarecaudos', component: CommonLayoutComponent,
        children: [{ path: '', component: CajarecaudosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'compras', component: CommonLayoutComponent,
        children: [{ path: '', component: ComprasComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'comprascrear', component: CommonLayoutComponent,
        children: [{ path: '', component: ComprascrearComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'compraseditar/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: CompraseditarComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'egresos', component: CommonLayoutComponent,
        children: [{ path: '', component: EgresosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'balancegeneral', component: CommonLayoutComponent,
        children: [{ path: '', component: BalancegeneralComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'flujoefectivo', component: CommonLayoutComponent,
        children: [{ path: '', component: FlujoefectivoComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cuentascobrar', component: CommonLayoutComponent,
        children: [{ path: '', component: CuentascobrarComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cuentaspagar', component: CommonLayoutComponent,
        children: [{ path: '', component: CuentaspagarComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cuentasterceros', component: CommonLayoutComponent,
        children: [{ path: '', component: CuentastercerosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'funcionarioeditar/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: FuncionarioeditarComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'funcionariover/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: FuncionarioverComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'informaciongiros', component: CommonLayoutComponent,
        children: [{ path: '', component: InformaciongirosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'tipodocumentoextranjero', component: CommonLayoutComponent,
        children: [{ path: '', component: TipodocumentoextranjeroComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'tipocuenta', component: CommonLayoutComponent,
        children: [{ path: '', component: TipocuentaComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'liquidacionsalario', component: CommonLayoutComponent,
        children: [{ path: '', component: LiquidacionsalarioComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cargo', component: CommonLayoutComponent,
        children: [{ path: '', component: CargosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'motivos-cambios', component: CommonLayoutComponent,
        children: [{ path: '', component: MotivoscambioComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'oficinacrear', component: CommonLayoutComponent,
        children: [{ path: '', component: OficinascrearComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'oficinaeditar/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: OficinaseditarComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'oficinaver/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: OficinaverComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cuentabancariaver/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: CuentasbancariasverComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'remitente', component: CommonLayoutComponent,
        children: [{ path: '', component: RemitenteComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'tercerover/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: TercerosverComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'transferenciaver/:id', component: CommonLayoutComponent,
        children: [{ path: '', component: TransferenciaverComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'gruposterceros', component: CommonLayoutComponent,
        children: [{ path: '', component: GrupostercerosComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cierrecaja/:id_funcionario', component: CommonLayoutComponent,
        children: [{ path: '', component: CierrecajaComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'consolidado/:id_funcionario/:fecha', component: CommonLayoutComponent,
        children: [{ path: '', component: ConsolidadoComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cierrecuentasconsultor/:id_funcionario', component: CommonLayoutComponent,
        children: [{ path: '', component: CierrecuentasconsultorComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cuadrecuentas', component: CommonLayoutComponent,
        children: [{ path: '', component: CuadrecuentasconsultorComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'detallemovimientoscuenta/:id_cuenta/:accion', component: CommonLayoutComponent,
        children: [{ path: '', component: DetallemovimientoscuentaComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'cuentasconsultor/:id_funcionario', component: CommonLayoutComponent,
        children: [{ path: '', component: CuentasconsultorComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'detallemovimientoscuentagerencial/:id_cuenta', component: CommonLayoutComponent,
        children: [{ path: '', component: DetallemovimientoscuentagerenteComponent, canActivate: [AuthGuard] }]
    },
    {
        path: 'pago-agentes-externos', component: CommonLayoutComponent,
        children: [{ path: '', component: PagoAgentesExternosComponent, canActivate: [AuthGuard] }]
    },

    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }

];

