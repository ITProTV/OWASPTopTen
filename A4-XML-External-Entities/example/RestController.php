<?php

require_once("MobileRestHandler.php");

$view = "";
if(isset($_GET['view']))
    $view = $_GET['view'];

switch($view) {
    case 'all':
        $mobileRestHandler = new MobileRestHandler();
        $mobileRestHandler->getAllMobiles();
        break;
    case 'single':
        $mobileRestHandler = new MobileRestHandler();
        $mobileRestHandler->getMobile($_GET['id']);
        break;
    case '':
        break;
}