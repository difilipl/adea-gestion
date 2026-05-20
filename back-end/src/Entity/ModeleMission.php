<?php

namespace App\Entity;

use App\Repository\ModeleMissionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ModeleMissionRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['modele_mission:read']])]
class ModeleMission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['modele_mission:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['modele_mission:read'])]
    private ?string $nom = null;

    /**
     * @var Collection<int, ModeleEtape>
     */
    #[ORM\OneToMany(targetEntity: ModeleEtape::class, mappedBy: 'modele_mission')]
    #[Groups(['modele_mission:read'])]
    private Collection $modeleEtapes;

    public function __construct()
    {
        $this->modeleEtapes = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, ModeleEtape>
     */
    public function getModeleEtapes(): Collection
    {
        return $this->modeleEtapes;
    }

    public function addModeleEtape(ModeleEtape $modeleEtape): static
    {
        if (!$this->modeleEtapes->contains($modeleEtape)) {
            $this->modeleEtapes->add($modeleEtape);
            $modeleEtape->setModeleMission($this);
        }

        return $this;
    }

    public function removeModeleEtape(ModeleEtape $modeleEtape): static
    {
        if ($this->modeleEtapes->removeElement($modeleEtape)) {
            // set the owning side to null (unless already changed)
            if ($modeleEtape->getModeleMission() === $this) {
                $modeleEtape->setModeleMission(null);
            }
        }

        return $this;
    }
}
