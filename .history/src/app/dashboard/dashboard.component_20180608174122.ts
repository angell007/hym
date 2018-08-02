// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />

import { Component, AfterViewChecked } from '@angular/core';
import { ThemeConstants } from '../shared/config/theme-constant';
import 'ammap3';
import 'ammap3/ammap/maps/js/usaLow';
//import Chart from 'chart.js';
import 'assets/js/jquery.sparkline/jquery.sparkline.js';
import * as $ from 'jquery';

@Component({
    templateUrl: 'dashboard.html'
})

export class DashboardComponent {
  
    constructor() {  
    }
}
