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


export const AppRoutes: Routes = [
    { 
        path : 'tablero', component : CommonLayoutComponent,
        children:[{path : '', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate:[AuthGuard]}]
    },
    { 
        path : 'configuraciongeneral', component : CommonLayoutComponent,
        children:[{path : '', component : CofiguracionComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'oficinas', component : CommonLayoutComponent,
        children:[{path : '', component : OficinasComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'cajas', component : CommonLayoutComponent,
        children:[{path : '', component : CajasComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'bancos', component : CommonLayoutComponent,
        children:[{path : '', component : BancosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'cuentasbancarias', component : CommonLayoutComponent,
        children:[{path : '', component : CuentasbancariasComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'perfiles', component : CommonLayoutComponent,
        children:[{path : '', component : PerfilesComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'funcionarios', component : CommonLayoutComponent,
        children:[{path : '', component : FuncionariosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'funcionariocrear', component : CommonLayoutComponent,
        children:[{path : '', component : FuncionariocrearComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'clientes', component : CommonLayoutComponent,
        children:[{path : '', component : ClientesComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'proveedores', component : CommonLayoutComponent,
        children:[{path : '', component : ProveedoresComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'destinatarios', component : CommonLayoutComponent,
        children:[{path : '', component : DestinatariosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'agentesexternos', component : CommonLayoutComponent,
        children:[{path : '', component : AgentesexternosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'transferencias', component : CommonLayoutComponent,
        children:[{path : '', component : TransferenciasComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'traslados', component : CommonLayoutComponent,
        children:[{path : '', component : TrasladosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'pos', component : CommonLayoutComponent,
        children:[{path : '', component : PosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'giros', component : CommonLayoutComponent,
        children:[{path : '', component : GirosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'corresponsalesbancarios', component : CommonLayoutComponent,
        children:[{path : '', component : CorresponsalesbancariosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'serviciosexternos', component : CommonLayoutComponent,
        children:[{path : '', component : ServiciosexternosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'indicadores', component : CommonLayoutComponent,
        children:[{path : '', component : IndicadoresComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'terceros', component : CommonLayoutComponent,
        children:[{path : '', component : TercerosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'grupos', component : CommonLayoutComponent,
        children:[{path : '', component : GruposComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'tipodocumento', component : CommonLayoutComponent,
        children:[{path : '', component : TipodocumentoComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'monedas', component : CommonLayoutComponent,
        children:[{path : '', component : MonedasComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'cajarecaudos', component : CommonLayoutComponent,
        children:[{path : '', component : CajarecaudosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'compras', component : CommonLayoutComponent,
        children:[{path : '', component : ComprasComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'egresos', component : CommonLayoutComponent,
        children:[{path : '', component : EgresosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'balancegeneral', component : CommonLayoutComponent,
        children:[{path : '', component : BalancegeneralComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'flujoefectivo', component : CommonLayoutComponent,
        children:[{path : '', component : FlujoefectivoComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'cuentascobrar', component : CommonLayoutComponent,
        children:[{path : '', component : CuentascobrarComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'cuentaspagar', component : CommonLayoutComponent,
        children:[{path : '', component : CuentaspagarComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'cuentasterceros', component : CommonLayoutComponent,
        children:[{path : '', component : CuentastercerosComponent, canActivate:[AuthGuard]}]
    },
    { 
        path : 'funcionarioeditar', component : CommonLayoutComponent,
        children:[{path : '', component : FuncionarioeditarComponent, canActivate:[AuthGuard]}]
    },      
    { 
        path : 'informaciongiros', component : CommonLayoutComponent,
        children:[{path : '', component : InformaciongirosComponent, canActivate:[AuthGuard]}]
    },
    { path : 'login', component: LoginComponent },
    { path : '' , redirectTo:'login', pathMatch:'full' }
    
];

