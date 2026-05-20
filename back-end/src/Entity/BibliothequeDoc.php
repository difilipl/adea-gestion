<?php

namespace App\Entity;

use App\Repository\BibliothequeDocRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: BibliothequeDocRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['bibliotheque:read']])]
class BibliothequeDoc
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['bibliotheque:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['bibliotheque:read'])]
    private ?string $nom_modele = null;

    #[ORM\Column(length: 255)]
    #[Groups(['bibliotheque:read'])]
    private ?string $chemin_fichier = null;

    #[ORM\ManyToOne(inversedBy: 'bibliothequeDocs')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['bibliotheque:read'])]
    private ?Categorie $categorie = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomModele(): ?string
    {
        return $this->nom_modele;
    }

    public function setNomModele(string $nom_modele): static
    {
        $this->nom_modele = $nom_modele;

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

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }
}
