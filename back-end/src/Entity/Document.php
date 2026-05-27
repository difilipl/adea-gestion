<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Delete;
use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['document:read']],
    operations: [
        new Get(),
        new Delete(),
    ]
)]
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
    private ?string $chemin_fichier = null;

    #[ORM\Column(length: 10)]
    #[Groups(['document:read', 'mission:read'])]
    private ?string $format = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['document:read'])]
    private ?Categorie $categorie = null;

    #[ORM\ManyToOne(inversedBy: 'documents')]
    private ?Mission $mission = null;

    #[ORM\ManyToOne(inversedBy: 'documents')]
    private ?Etape $etape = null;

    #[ORM\ManyToOne(inversedBy: 'documents')]
    private ?Client $client = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $type_mime = null;

    #[ORM\Column(nullable: true)]
    private ?int $taille = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $date_upload = null;

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

    public function getCheminFichier(): ?string
    {
        return $this->chemin_fichier;
    }

    public function setCheminFichier(string $chemin_fichier): static
    {
        $this->chemin_fichier = $chemin_fichier;

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

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getTypeMime(): ?string
    {
        return $this->type_mime;
    }

    public function setTypeMime(?string $type_mime): static
    {
        $this->type_mime = $type_mime;

        return $this;
    }

    public function getTaille(): ?int
    {
        return $this->taille;
    }

    public function setTaille(?int $taille): static
    {
        $this->taille = $taille;

        return $this;
    }

    public function getDateUpload(): ?\DateTimeImmutable
    {
        return $this->date_upload;
    }

    public function setDateUpload(\DateTimeImmutable $date_upload): static
    {
        $this->date_upload = $date_upload;

        return $this;
    }
}
