<?php

namespace App\DataFixtures;

use App\Entity\Categorie;
use App\Entity\ModeleMission;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ModeleMissionFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {

        $data= [
            "déclaration d'urbanisme",
            "Demandes de raccordement auprès des gestionnaires de réseaux",
            "Aide à la rédaction des documents techniques",
            "Veille des annonces d’appel d’offre",
            "Modélisation de projets",
            "Contrôle des notes de frais",
            "Rédaction des fiches de poste",
            "Préparation des éléments à transmettre pour paie",
            "Réalisation d’organigrammes, registre du personnel",
            "Suivi du salarié",
            "Suivi de plannings",
            "Mise en place de tableaux de bord et de suivis",
            "Relance des justificatifs manquants",
            "Classement des justificatifs comptables",
            "Pointage et rapprochement bancaire",
            "Service après-vente",
            "Suivi des dossiers clients",
            "Suivi des notes de frais",
            "Relance d’impayés",
            "Gestion dossiers clients et fournisseurs",
            "Edition et envoi des devis et factures",
            "Création de supports commerciaux simples et/ou de présentation",
            "Saisie et mise en page de documents",
            "Gestion de plannings avec prise de RDV",
            "Gestion de boîte mail",
            "Permanence téléphonique",
            "Archivage",
        ];

        foreach ($data as $index => $value){
            $modeleMission = new ModeleMission();
            $modeleMission->setNom($value);
            $manager->persist($modeleMission);

            $this->addReference('modele_mission_'.$index, $modeleMission);
        }

        $manager->flush();
    }
}
