<?php

namespace App\DataFixtures;

use App\Entity\TypeEtape;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TypeEtapeFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $data = [
            'Etude du projet',
            'Signature du contrat de prestation',
            'Présentation du projet',
            'Validation et signature de la proposition commerciale par le client',
            'Visite technique pour validation technique du projet',
            'Dépôt de la déclaration préalable en mairie',
            "Validation de l'autorisation d'urbanisme",
            'Demande de Raccordement Enedis',
            'Début des Travaux d’installation de la centrale photovoltaïque',
            'Mise en service du générateur Solaire',
        ];

        foreach ($data as $index => $value) {
            $typeEtape = new TypeEtape();
            $typeEtape->setNom($value);
            $manager->persist($typeEtape);

            $this->addReference('type_etape_' . ($index + 1), $typeEtape);
        }
        $manager->flush();

    }
}
