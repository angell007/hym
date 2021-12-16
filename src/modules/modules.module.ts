import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesRoutes } from './modules.routing';
import { CustomTrasladosComponent } from '../app/traslados/custom-traslados/custom-traslados.component';

// import { TrasladosComponent } from './traslados.component';
// import { TablatrasladosComponent } from './tablatraslados/tablatraslados.component';
// import { AppModule } from '../app.module';

// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgxMaskModule } from 'ngx-mask';
// import { NgxCurrencyModule } from 'ngx-currency';
// import { SwalService } from '../shared/services/swal/swal.service';
// import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// import { NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
// import { PuntosPipe } from './../common/Pipes/puntos.pipe';
// import { PuntosPipe } from './../../common/Pipes/puntos.pipe.ts';

// export const CustomCurrencyMaskConfig = {
//   align: "right",
//   allowNegative: true,
//   allowZero: true,
//   decimal: ",",
//   precision: 2,
//   prefix: "",
//   suffix: "",
//   thousands: ".",
//   nullable: true,
//   min: null,
//   max: null,
  // inputMode: CurrencyMaskInputMode.NATURAL
// };

@NgModule({
  imports: [
    CommonModule,
    // AppModule,
    // FormsModule,
    // ReactiveFormsModule,
    // NgbDropdownModule,
    // NgbPaginationModule,
    // NgxMaskModule.forRoot(),
    // NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ModulesRoutes,
    // NgbTypeaheadConfig,
  ],
  declarations: [
    CustomTrasladosComponent
    // TrasladosComponent,
    // TablatrasladosComponent,
    // NgbTypeahead,
    // SwalService
    // PuntosPipe
  ]
})

export class ModulesModule { }
