<?php

namespace App\Entity;

use App\Repository\ParticulierRepository;
use Doctrine\ORM\Mapping as ORM;use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ParticulierRepository::class)]
#[ApiResource]
class Particulier extends Client
{

    #[ORM\Column(length: 255)]
    #[Groups(['mission:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    private ?string $prenom = null;


    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }
}
