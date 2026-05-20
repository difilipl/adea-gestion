<?php

namespace App\Entity;

use App\Repository\EmailRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: EmailRepository::class)]
#[ApiResource]
#[ApiResource(normalizationContext: ['groups' => ['email:read']])]
class Email
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['email:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['email:read'])]
    private ?string $sujet = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['email:read'])]
    private ?string $contenu = null;

    #[ORM\Column(length: 255)]
    #[Assert\Email(message: "Le format de l'email est invalide")]
    #[Groups(['email:read'])]
    private ?string $expediteur = null;

    #[ORM\Column]
    #[Groups(['email:read'])]
    private ?\DateTimeImmutable $date_reception = null;

    #[ORM\Column(length: 255)]
    private ?string $message_id = null;

    #[ORM\ManyToOne(inversedBy: 'emails')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Client $client = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSujet(): ?string
    {
        return $this->sujet;
    }

    public function setSujet(string $sujet): static
    {
        $this->sujet = $sujet;

        return $this;
    }

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): static
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getExpediteur(): ?string
    {
        return $this->expediteur;
    }

    public function setExpediteur(string $expediteur): static
    {
        $this->expediteur = $expediteur;

        return $this;
    }

    public function getDateReception(): ?\DateTimeImmutable
    {
        return $this->date_reception;
    }

    public function setDateReception(\DateTimeImmutable $date_reception): static
    {
        $this->date_reception = $date_reception;

        return $this;
    }

    public function getMessageId(): ?string
    {
        return $this->message_id;
    }

    public function setMessageId(string $message_id): static
    {
        $this->message_id = $message_id;

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
