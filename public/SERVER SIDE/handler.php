<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once './vendor/autoload.php';

use FormGuide\Handlx\FormHandler;

$pp = new FormHandler(); 

$validator = $pp->getValidator();
$validator->fields(['Name','Email'])->areRequired()->maxLength(50);
$validator->field('Email')->isEmail();
$validator->field('Message')->maxLength(6000);

$pp->requireReCaptcha();
$pp->getReCaptcha()->initSecretKey('6Lf-47kUAAAAAHV8S713CW6fXGliih1yAuTGEL7d');

$pp->sendEmailTo('sarveshkulkarni1999@gmail.com', 'amurtobasu@gmail.com', 'shubhammishra69897@gmail.com', 'maheshdesai1398@gmail.com');

echo $pp->process($_POST);