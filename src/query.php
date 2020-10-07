<?php
include_once("class.dao.php");

class consulta {
	protected	$query 		= 0,
	            $tipo = 'simple',
				$resultado = [];
				

	public function connect() {
	    global $MY_CONFIG;
		include($MY_CONFIG . "config.db.php");
		
	    $link = mysql_connect($db_host,$db_user, $db_password) or die('No se pudo conectar: ' . mysql_error());
        mysql_select_db($db_name) or die('No se pudo seleccionar la base de datos');
        $result = mysql_query($this->query) or die('Consulta fallida: ' . mysql_error());

        if($this->tipo == 'simple'){
           $this->resultado=mysql_fetch_assoc($result);
        }else{
             while($lista=mysql_fetch_assoc($result)){
                $lista = array_map('utf8_encode', $lista);
                $this->resultado[]=$lista;
            }   
        }
        @mysql_free_result($this->resultado);
        
        mysql_close($link);
	}
	
	public function connect2() {
	    global $MY_CONFIG;
		include($MY_CONFIG . "config.db.php");
		
	    $link = mysql_connect($db_host,$db_user, $db_password) or die('No se pudo conectar: ' . mysql_error());
        mysql_select_db($db_name) or die('No se pudo seleccionar la base de datos');
        $result = mysql_query($this->query) or die('Consulta fallida: ' . mysql_error());
        
        mysql_close($link);
	}
	

    public function setQuery($query){
        $this->query = $query;
    }
    
    public function setTipo($arg){
         $this->tipo = $arg; 
    }

    public function getData(){
        self::connect();
        return $this->resultado;
    }
    
    public function deleteData(){
        self::connect2();
        return $this->resultado;
    }
    
    public function createData(){
        self::connect2();
        return $this->resultado;
    }

	public function __construct() {
	}

	public function __destruct() {
		unset ($query);
		unset ($resultado);
	}
	
	

}
?>