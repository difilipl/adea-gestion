<?php

namespace App\DataFixtures;

use App\Entity\Particulier;
use App\Enum\TypeClient;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ParticulierFixtures extends Fixture
{
    public const PARTICULIER_TEST_REF = 'particulier-test';

    public function load(ObjectManager $manager): void
    {
        $particulier = new Particulier();
        $particulier->setNom('Dupont');
        $particulier->setPrenom('Jean');
        $particulier->setEmailPrincipal('jean.dupont@gmail.com');
        $particulier->setTelephone('0611223344');
        $particulier->setStatut(TypeClient::CLIENT);

        $manager->persist($particulier);
        $manager->flush();
        $this->addReference(self::PARTICULIER_TEST_REF, $particulier);
    }
}
