<?php

namespace App\Entity;

use App\Enum\TypeClient;
use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;
#[ORM\InheritanceType('SINGLE_TABLE')]
#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['client:read']])]
#[ORM\DiscriminatorColumn(name: 'dtype', type: 'string')]
#[ORM\DiscriminatorMap([
    'client' => Client::class,
    'pro' => Pro::class,
    'particulier' => Particulier::class
])]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['client:read', 'mission:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\Email(message: "Le format de l'email est invalide")]
    #[Groups(['client:read'])]
    private ?string $email_principal = null;

    #[ORM\Column(length: 10)]
    #[Groups(['client:read'])]
    private ?string $telephone = null;

    #[ORM\Column(length: 255)]
    #[Groups(['client:read'])]
    private ?TypeClient $statut = null;

    #[ORM\Column]
    #[Groups(['client:read'])]
    private ?\DateTimeImmutable $date_creation = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $infos_importantes = null;

    /**
     * @var Collection<int, Mission>
     */
    #[ORM\OneToMany(targetEntity: Mission::class, mappedBy: 'client', orphanRemoval: true)]
    private Collection $missions;

    /**
     * @var Collection<int, Email>
     */
    #[ORM\OneToMany(targetEntity: Email::class, mappedBy: 'client', orphanRemoval: true)]
    private Collection $emails;


    public function __construct()
    {
        $this->missions = new ArrayCollection();
        $this->emails = new ArrayCollection();
        $this->date_creation = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmailPrincipal(): ?string
    {
        return $this->email_principal;
    }

    public function setEmailPrincipal(string $email_principal): static
    {
        $this->email_principal = $email_principal;

        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): static
    {
        $this->telephone = $telephone;

        return $this;
    }

    public function getStatut(): ?TypeClient
    {
        return $this->statut;
    }

    public function setStatut(TypeClient $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

    public function getDateCreation(): ?\DateTimeImmutable
    {
        return $this->date_creation;
    }

    public function setDateCreation(\DateTimeImmutable $date_creation): static
    {
        $this->date_creation = $date_creation;

        return $this;
    }

    public function getInfosImportantes(): ?string
    {
        return $this->infos_importantes;
    }

    public function setInfosImportantes(?string $infos_importantes): static
    {
        $this->infos_importantes = $infos_importantes;

        return $this;
    }

    /**
     * @return Collection<int, Mission>
     */
    public function getMissions(): Collection
    {
        return $this->missions;
    }

    public function addMission(Mission $mission): static
    {
        if (!$this->missions->contains($mission)) {
            $this->missions->add($mission);
            $mission->setClient($this);
        }

        return $this;
    }

    public function removeMission(Mission $mission): static
    {
        if ($this->missions->removeElement($mission)) {
            // set the owning side to null (unless already changed)
            if ($mission->getClient() === $this) {
                $mission->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Email>
     */
    public function getEmails(): Collection
    {
        return $this->emails;
    }

    public function addEmail(Email $email): static
    {
        if (!$this->emails->contains($email)) {
            $this->emails->add($email);
            $email->setClient($this);
        }

        return $this;
    }

    public function removeEmail(Email $email): static
    {
        if ($this->emails->removeElement($email)) {
            // set the owning side to null (unless already changed)
            if ($email->getClient() === $this) {
                $email->setClient(null);
            }
        }

        return $this;
    }
}
