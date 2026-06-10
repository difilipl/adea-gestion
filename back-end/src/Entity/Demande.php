<?php

namespace App\Entity;

use App\Repository\DemandeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DemandeRepository::class)]
#[ApiResource(
    operations: [
        // Lecture réservée aux utilisateurs connectés du CRM
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Get(security: "is_granted('ROLE_USER')"),
        // Création ouverte (formulaire WordPress) — protégée par clé API via un Voter/State plus loin
        new Post(),
    ],
    normalizationContext: ['groups' => ['demande:read']],
    denormalizationContext: ['groups' => ['demande:write']],
)]
class Demande
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['demande:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: ['particulier', 'professionnel'], message: "Type de client invalide")]
    #[Groups(['demande:read', 'demande:write'])]
    private ?string $typeClient = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le nom est obligatoire")]
    #[Groups(['demande:read', 'demande:write'])]
    private ?string $nom = null;

    #[ORM\Column(length: 30, nullable: true)]
    #[Groups(['demande:read', 'demande:write'])]
    private ?string $telephone = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "L'email est obligatoire")]
    #[Assert\Email(message: "Le format de l'email est invalide")]
    #[Groups(['demande:read', 'demande:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: "Le type de demande est obligatoire")]
    #[Groups(['demande:read', 'demande:write'])]
    private ?string $typeDemande = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['demande:read', 'demande:write'])]
    private ?string $typeDemandeSpecifique = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['demande:read', 'demande:write'])]
    private ?string $autresInfos = null;

    #[ORM\Column(length: 20)]
    #[Groups(['demande:read'])]
    private string $statut = 'nouveau';

    #[ORM\Column]
    #[Groups(['demande:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->statut = 'nouveau';
    }

    public function getId(): ?int { return $this->id; }

    public function getTypeClient(): ?string { return $this->typeClient; }
    public function setTypeClient(string $typeClient): static { $this->typeClient = $typeClient; return $this; }

    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }

    public function getTelephone(): ?string { return $this->telephone; }
    public function setTelephone(?string $telephone): static { $this->telephone = $telephone; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    public function getTypeDemande(): ?string { return $this->typeDemande; }
    public function setTypeDemande(string $typeDemande): static { $this->typeDemande = $typeDemande; return $this; }

    public function getTypeDemandeSpecifique(): ?string { return $this->typeDemandeSpecifique; }
    public function setTypeDemandeSpecifique(?string $v): static { $this->typeDemandeSpecifique = $v; return $this; }

    public function getAutresInfos(): ?string { return $this->autresInfos; }
    public function setAutresInfos(?string $autresInfos): static { $this->autresInfos = $autresInfos; return $this; }

    public function getStatut(): string { return $this->statut; }
    public function setStatut(string $statut): static { $this->statut = $statut; return $this; }

    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
}
