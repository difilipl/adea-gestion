<?php

namespace App\DataFixtures;

use App\Entity\Pro;
use App\Enum\TypeClient;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProFixtures extends Fixture
{
    public const PRO_TEST_REF = 'pro-test';

    public function load(ObjectManager $manager): void
    {
        $pro = new Pro();
        $pro->setNomEntreprise('Soleil Énergie France');
        $pro->setSiret('12345678901234');
        $pro->setEmailPrincipal('contact@soleilenergie.fr');
        $pro->setTelephone('0475001122');
        $pro->setStatut(TypeClient::CLIENT);
        $pro->setInfosImportantes('Client pro historique pour les dossiers d\'urbanisme photovoltaïques.');

        $manager->persist($pro);
        $manager->flush();

        $this->addReference(self::PRO_TEST_REF, $pro);
    }
}
