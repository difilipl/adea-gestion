<?php

namespace App\DataFixtures;

use App\Entity\Utilisateur;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UtilisateurFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        $utilisateur = new Utilisateur();
        $utilisateur->setEmail('admin@adea-vb.fr');
        $utilisateur->setRoles(['ROLE_ADMIN']);
        $utilisateur->setPassword(
            $this->passwordHasher->hashPassword($utilisateur, 'password123')
        );

        $manager->persist($utilisateur);

        $manager->flush();
    }
}
