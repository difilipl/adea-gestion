<?php

namespace App\Entity;

use App\Repository\BibliothequeDocRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
#[ORM\Entity(repositoryClass: BibliothequeDocRepository::class)]
#[ApiResource]
class BibliothequeDoc
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom_modele = null;

    #[ORM\Column(length: 255)]
    private ?string $chemin_fichier = null;

    #[ORM\ManyToOne(inversedBy: 'bibliothequeDocs')]
    #[ORM\JoinColumn(nullable: false)]
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
