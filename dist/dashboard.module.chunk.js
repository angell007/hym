webpackJsonp(["dashboard.module"],{

/***/ "./src/app/dashboard/dashboard-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardRoutes; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dashboard_component__ = __webpack_require__("./src/app/dashboard/dashboard.component.ts");
//Dashboard Components

var DashboardRoutes = [
    {
        path: '',
        component: __WEBPACK_IMPORTED_MODULE_0__dashboard_component__["a" /* DashboardComponent */],
        data: {
            title: 'Dashboard'
        }
    }
];


/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ammap3__ = __webpack_require__("./node_modules/ammap3/ammap/ammap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ammap3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ammap3__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ammap3_ammap_maps_js_usaLow__ = __webpack_require__("./node_modules/ammap3/ammap/maps/js/usaLow.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ammap3_ammap_maps_js_usaLow___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ammap3_ammap_maps_js_usaLow__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_assets_js_jquery_sparkline_jquery_sparkline_js__ = __webpack_require__("./src/assets/js/jquery.sparkline/jquery.sparkline.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_assets_js_jquery_sparkline_jquery_sparkline_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_assets_js_jquery_sparkline_jquery_sparkline_js__);
// Typing for Ammap
/// <reference path="../shared/typings/ammaps/ammaps.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



//import Chart from 'chart.js';

var DashboardComponent = /** @class */ (function () {
    function DashboardComponent() {
    }
    DashboardComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            template: __webpack_require__("./src/app/dashboard/dashboard.html")
        }),
        __metadata("design:paramtypes", [])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.html":
/***/ (function(module, exports) {

module.exports = "<h4>Tablero de Indicadores y Business Intelligence</h4>\n<p>Estamos Trabajando</p>"

/***/ }),

/***/ "./src/app/dashboard/dashboard.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardModule", function() { return DashboardModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_config_theme_constant__ = __webpack_require__("./src/app/shared/config/theme-constant.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dashboard_routing_module__ = __webpack_require__("./src/app/dashboard/dashboard-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dashboard_component__ = __webpack_require__("./src/app/dashboard/dashboard.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// Dashboard Component

var DashboardModule = /** @class */ (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* RouterModule */].forChild(__WEBPACK_IMPORTED_MODULE_3__dashboard_routing_module__["a" /* DashboardRoutes */])
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__dashboard_component__["a" /* DashboardComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_2__shared_config_theme_constant__["a" /* ThemeConstants */]
            ]
        })
    ], DashboardModule);
    return DashboardModule;
}());



/***/ })

});
//# sourceMappingURL=dashboard.module.chunk.js.map