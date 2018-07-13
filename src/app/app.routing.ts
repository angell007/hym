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
    { path : 'login', component: LoginComponent },
    { path : '' , redirectTo:'login', pathMatch:'full' }
    
];

