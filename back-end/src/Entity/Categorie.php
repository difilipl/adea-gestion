<?php

namespace App\Entity;

use App\Repository\CategorieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
#[ORM\Entity(repositoryClass: CategorieRepository::class)]
#[ApiResource]
class Categorie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $libelle = null;

    /**
     * @var Collection<int, BibliothequeDoc>
     */
    #[ORM\OneToMany(targetEntity: BibliothequeDoc::class, mappedBy: 'categorie')]
    private Collection $bibliothequeDocs;

    public function __construct()
    {
        $this->bibliothequeDocs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): static
    {
        $this->libelle = $libelle;

        return $this;
    }

    /**
     * @return Collection<int, BibliothequeDoc>
     */
    public function getBibliothequeDocs(): Collection
    {
        return $this->bibliothequeDocs;
    }

    public function addBibliothequeDoc(BibliothequeDoc $bibliothequeDoc): static
    {
        if (!$this->bibliothequeDocs->contains($bibliothequeDoc)) {
            $this->bibliothequeDocs->add($bibliothequeDoc);
            $bibliothequeDoc->setCategorie($this);
        }

        return $this;
    }

    public function removeBibliothequeDoc(BibliothequeDoc $bibliothequeDoc): static
    {
        if ($this->bibliothequeDocs->removeElement($bibliothequeDoc)) {
            // set the owning side to null (unless already changed)
            if ($bibliothequeDoc->getCategorie() === $this) {
                $bibliothequeDoc->setCategorie(null);
            }
        }

        return $this;
    }
}
