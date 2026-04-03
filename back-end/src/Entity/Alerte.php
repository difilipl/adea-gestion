<?php

namespace App\Entity;

use App\Repository\AlerteRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
#[ORM\Entity(repositoryClass: AlerteRepository::class)]
#[ApiResource]
class Alerte
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $message = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $date_echeance = null;

    #[ORM\Column]
    private ?bool $est_lue = null;

    #[ORM\ManyToOne(inversedBy: 'alertes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;

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

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;

        return $this;
    }
}
