<?php
include_once('class.lista.php');
include_once('class.complex.php');

class Configuracion {
    
function Consecutivo($index){
    $oItem = new complex('Configuracion','Id_Configuracion',1);
    $nc = $oItem->getData();
    
    $oItem->$index=$oItem->$index+1;
    $oItem->save();
    $num_cotizacion=$nc[$index];
    unset($oItem);
    
    $cod = $nc["Prefijo_".$index].sprintf("%05d", $num_cotizacion);
    
    return $cod;
}    

} 
