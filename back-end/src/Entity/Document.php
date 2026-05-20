<?php

namespace App\Entity;

use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['document:read']])]
class  Document
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['document:read', 'mission:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['document:read', 'mission:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['document:read', 'mission:read'])]
    private ?string $chemin_local = null;

    #[ORM\Column(length: 10)]
    #[Groups(['document:read', 'mission:read'])]
    private ?string $format = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['document:read'])]
    private ?Categorie $categorie = null;

    #[ORM\ManyToOne(inversedBy: 'documents')]
    private ?Mission $mission = null;

    #[ORM\ManyToOne(inversedBy: 'documents')]
    private ?Etape $etape = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getCheminLocal(): ?string
    {
        return $this->chemin_local;
    }

    public function setCheminLocal(string $chemin_local): static
    {
        $this->chemin_local = $chemin_local;

        return $this;
    }

    public function getFormat(): ?string
    {
        return $this->format;
    }

    public function setFormat(string $format): static
    {
        $this->format = $format;

        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function getMission(): ?Mission
    {
        return $this->mission;
    }

    public function setMission(?Mission $mission): static
    {
        $this->mission = $mission;

        return $this;
    }

    public function getEtape(): ?Etape
    {
        return $this->etape;
    }

    public function setEtape(?Etape $etape): static
    {
        $this->etape = $etape;

        return $this;
    }
}
