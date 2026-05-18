<?php

namespace App\Enum;

enum StatutMission: string
{
case EN_COURS = 'en cours';
case PAS_EN_COURS = 'en attente';
case TERMINE = 'termine';

}
