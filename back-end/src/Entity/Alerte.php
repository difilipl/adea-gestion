<?php

namespace App\Entity;

use App\Repository\AlerteRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: AlerteRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['alerte:read']])]
class Alerte
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['alerte:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['alerte:read'])]
    private ?string $message = null;

    #[ORM\Column]
    #[Groups(['alerte:read'])]
    private ?\DateTimeImmutable $date_echeance = null;

    #[ORM\Column]
    #[Groups(['alerte:read'])]
    private ?bool $est_lue = null;

    #[ORM\Column(length: 50)]
    #[Groups(['alerte:read'])]
    private string $type = 'info';

    #[ORM\JoinColumn(nullable: false)]
    #[ORM\ManyToOne(inversedBy: 'alertes')]
    private ?Mission $mission = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getDateEcheance(): ?\DateTimeImmutable
    {
        return $this->date_echeance;
    }

    public function setDateEcheance(\DateTimeImmutable $date_echeance): static
    {
        $this->date_echeance = $date_echeance;

        return $this;
    }

    public function isEstLue(): ?bool
    {
        return $this->est_lue;
    }

    public function setEstLue(bool $est_lue): static
    {
        $this->est_lue = $est_lue;

        return $this;
    }
    public function getType(): string
    {
        return $this->type;
    }
    public function setType(string $type): static
    {
        $this->type = $type; return $this;
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
}
