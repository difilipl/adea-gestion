<?php

namespace App\Entity;

use App\Repository\ModeleEtapeRepository;
use Doctrine\ORM\Mapping as ORM;use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ModeleEtapeRepository::class)]
#[ApiResource]
class ModeleEtape
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['read'])]
    private ?int $ordre = null;

    #[ORM\Column]
    #[Groups(['read'])]
    private ?int $duree_jours = null;

    #[ORM\ManyToOne(inversedBy: 'modeleEtapes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?ModeleMission $modele_mission = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?TypeEtape $type_etape = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOrdre(): ?int
    {
        return $this->ordre;
    }

    public function setOrdre(int $ordre): static
    {
        $this->ordre = $ordre;

        return $this;
    }

    public function getDureeJours(): ?int
    {
        return $this->duree_jours;
    }

    public function setDureeJours(int $duree_jours): static
    {
        $this->duree_jours = $duree_jours;

        return $this;
    }

    public function getModeleMission(): ?ModeleMission
    {
        return $this->modele_mission;
    }

    public function setModeleMission(?ModeleMission $modele_mission): static
    {
        $this->modele_mission = $modele_mission;

        return $this;
    }

    public function getTypeEtape(): ?TypeEtape
    {
        return $this->type_etape;
    }

    public function setTypeEtape(?TypeEtape $type_etape): static
    {
        $this->type_etape = $type_etape;

        return $this;
    }
}
