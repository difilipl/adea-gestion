<?php

namespace App\DataFixtures;

use App\Entity\Mission;
use App\Entity\Particulier;
use App\Entity\Pro;
use App\Enum\StatutMission;
use App\Entity\ModeleMission;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class MissionFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        // 1. Récupération des clients depuis leurs fixtures dédiées
        $clientPro = $this->getReference(ProFixtures::PRO_TEST_REF, Pro::class);
        $clientParticulier = $this->getReference(ParticulierFixtures::PARTICULIER_TEST_REF, Particulier::class);

        // 2. Récupération des modèles (index 0 = urbanisme, index 14 = pré-compta)
        $modeleUrba = $this->getReference('modele_mission_0', ModeleMission::class);
        $modelePrecompta = $this->getReference('modele_mission_14', ModeleMission::class);


        if ($modeleUrba) {
            $missionUrba = new Mission();
            $missionUrba->setTitre('Déclaration Préalable - Centrale Solaire 36kWc');
            $missionUrba->setDateDebut(new \DateTime('2026-06-01'));
            $missionUrba->setStatut(StatutMission::EN_COURS);
            $missionUrba->setClient($clientPro);
            $missionUrba->setModeleMission($modeleUrba);

            $manager->persist($missionUrba);
        }


        if ($modelePrecompta) {
            $missionCompta = new Mission();
            $missionCompta->setTitre('Rapprochement Bancaire Trimestriel');
            $missionCompta->setDateDebut(new \DateTime('2026-06-15'));
            $missionCompta->setStatut(StatutMission::PAS_EN_COURS);
            $missionCompta->setDateFinPrevue(new \DateTime('2026-07-15'));
            $missionCompta->setClient($clientParticulier);
            $missionCompta->setModeleMission($modelePrecompta);

            $manager->persist($missionCompta);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            TypeEtapeFixtures::class,
            ModeleMissionFixtures::class,
            ModeleEtapeFixtures::class,
            ProFixtures::class,
            ParticulierFixtures::class,
        ];
    }
}
