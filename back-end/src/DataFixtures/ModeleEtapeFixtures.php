<?php

namespace App\DataFixtures;

use App\Entity\ModeleEtape;
use App\Entity\ModeleMission;
use App\Entity\TypeEtape;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ModeleEtapeFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $data = [
            [
                'ordre' =>1,
                'duree_jours'=> 1,
                'modele_mission_id'=>0,
                'type_etape_id'=>1,
            ],
            [
                'ordre' =>2,
                'duree_jours'=> 3,
                'modele_mission_id'=>0,
                'type_etape_id'=>2,
            ],
            [
                'ordre' =>3,
                'duree_jours'=> 1,
                'modele_mission_id'=>0,
                'type_etape_id'=>3,
            ],
            [
                'ordre' =>4,
                'duree_jours'=> 12,
                'modele_mission_id'=>0,
                'type_etape_id'=>4,
            ],
            [
                'ordre' =>5,
                'duree_jours'=> 10,
                'modele_mission_id'=>0,
                'type_etape_id'=>5,
            ],
            [
                'ordre' =>6,
                'duree_jours'=> 8,
                'modele_mission_id'=>0,
                'type_etape_id'=>6,
            ],
            [
                'ordre' =>7,
                'duree_jours'=> 90,
                'modele_mission_id'=>0,
                'type_etape_id'=>7,
            ],
            [
                'ordre' =>8,
                'duree_jours'=> 30,
                'modele_mission_id'=>0,
                'type_etape_id'=>8,
            ],
            [
                'ordre' =>9,
                'duree_jours'=> 9,
                'modele_mission_id'=>0,
                'type_etape_id'=>9,
            ],
            [
                'ordre' =>10,
                'duree_jours'=> 4,
                'modele_mission_id'=>0,
                'type_etape_id'=>10,
            ],
        ];

        foreach ($data as $value) {
            $modele_etape = new ModeleEtape();
            $modele_etape->setOrdre($value['ordre']);
            $modele_etape->setDureeJours($value['duree_jours']);

            $modele_mission = $this->getReference('modele_mission_'.$value['modele_mission_id'], ModeleMission::class);
            $modele_etape->setModeleMission($modele_mission );

            $type_etape = $this->getReference('type_etape_'.$value['type_etape_id'], TypeEtape::class);
            $modele_etape->setTypeEtape($type_etape);

            $manager->persist($modele_etape);
        }
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [TypeEtapeFixtures::class, ModeleMissionFixtures::class];
    }
}
