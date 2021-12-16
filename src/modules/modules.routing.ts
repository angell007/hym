import { Routes, RouterModule } from '@angular/router';
import { CustomTrasladosComponent } from '../app/traslados/custom-traslados/custom-traslados.component';


const routes: Routes = [
  {
    path: '', component: CustomTrasladosComponent
  },
];

export const ModulesRoutes = RouterModule.forChild(routes);
