<?php

namespace App\Controller;

use App\Entity\ModeleMission;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ModelMissionController extends AbstractController
{
    #[Route('/model/mission', name: 'app_model_mission')]
    public function index(): Response
    {
        return $this->render('model_mission/index.html.twig', [
            'controller_name' => 'ModelMissionController',
        ]);
    }

    #[Route('/modele-mission/nouveau', name: 'app_modele_mission_new')]
    public function new(): Response
    {
        // 1. On crée une entité vide
        $mission = new ModeleMission();

        // 2. On rend la page "cadre" et on lui passe l'entité
        return $this->render('model_mission/new.html.twig', [
            'mission' => $mission,
        ]);
    }
}
