<?php

namespace App\Entity;

use App\Enum\StatutMission;
use App\Repository\MissionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: MissionRepository::class)]
#[ApiResource(normalizationContext: ['groups' => ['mission:read']])]
class Mission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['mission:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['mission:read'])]
    private ?string $titre = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['mission:read'])]
    private ?\DateTime $date_debut = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['mission:read'])]
    private ?\DateTime $date_fin_prevue = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['mission:read'])]
    private ?\DateTime $date_fin_reel = null;

    #[ORM\Column(length: 50, enumType: StatutMission::class)]
    #[Groups(['mission:read'])]
    private ?StatutMission $statut = null;

    #[ORM\ManyToOne(inversedBy: 'missions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['mission:read'])]
    private ?Client $client = null;

    #[ORM\ManyToOne]
    #[Groups(['mission:read'])]
    private ?ModeleMission $modele_mission = null;

    /**
     * @var Collection<int, Etape>
     */
    #[ORM\OneToMany(targetEntity: Etape::class, mappedBy: 'mission', orphanRemoval: true, cascade: ['persist'])]
    #[Groups(['mission:read'])]
    private Collection $etapes;

    /**
     * @var Collection<int, Alerte>
     */
    #[ORM\OneToMany(targetEntity: Alerte::class, mappedBy: 'mission', orphanRemoval: true)]
    #[Groups(['mission:read'])]
    private Collection $alertes;

    /**
     * @var Collection<int, Document>
     */
    #[ORM\OneToMany(targetEntity: Document::class, mappedBy: 'mission')]
    #[Groups(['mission:read'])]
    private Collection $documents;

    public function __construct()
    {
        $this->etapes = new ArrayCollection();
        $this->documents = new ArrayCollection();
        $this->alertes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getDateDebut(): ?\DateTime
    {
        return $this->date_debut;
    }

    public function setDateDebut(\DateTime $date_debut): static
    {
        $this->date_debut = $date_debut;

        return $this;
    }

    public function getDateFinPrevue(): ?\DateTime
    {
        return $this->date_fin_prevue;
    }

    public function setDateFinPrevue(\DateTime $date_fin_prevue): static
    {
        $this->date_fin_prevue = $date_fin_prevue;

        return $this;
    }
    public function getDateFinReel(): ?\DateTime
    {
        return $this->date_fin_reel;
    }

    public function setDateFinReel(\DateTime $date_fin_reel): static
    {
        $this->date_fin_reel = $date_fin_reel;

        return $this;
    }

    public function getStatut(): ?StatutMission
    {
        return $this->statut;
    }

    public function setStatut(StatutMission $statut): static
    {
        $this->statut = $statut;

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

    public function getModeleMission(): ?ModeleMission
    {
        return $this->modele_mission;
    }

    public function setModeleMission(?ModeleMission $modele_mission): static
    {
        $this->modele_mission = $modele_mission;

        return $this;
    }

    /**
     * @return Collection<int, Etape>
     */
    public function getEtapes(): Collection
    {
        return $this->etapes;
    }

    public function addEtape(Etape $etape): static
    {
        if (!$this->etapes->contains($etape)) {
            $this->etapes->add($etape);
            $etape->setMission($this);
        }

        return $this;
    }

    public function removeEtape(Etape $etape): static
    {
        if ($this->etapes->removeElement($etape)) {
            // set the owning side to null (unless already changed)
            if ($etape->getMission() === $this) {
                $etape->setMission(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Document>
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    public function addDocument(Document $document): static
    {
        if (!$this->documents->contains($document)) {
            $this->documents->add($document);
            $document->setMission($this);
        }

        return $this;
    }

    public function removeDocument(Document $document): static
    {
        if ($this->documents->removeElement($document)) {
            // set the owning side to null (unless already changed)
            if ($document->getMission() === $this) {
                $document->setMission(null);
            }
        }

        return $this;
    }

    public function getAlertes(): Collection
    {
        return $this->alertes;
    }

    public function addAlerte(Alerte $alerte): static
    {
        if (!$this->alertes->contains($alerte)) {
            $this->alertes->add($alerte);
            $alerte->setMission($this);
        }
        return $this;
    }

    public function removeAlerte(Alerte $alerte): static
    {
        if ($this->alertes->removeElement($alerte)) {
            if ($alerte->getMission() === $this) {
                $alerte->setMission(null);
            }
        }
        return $this;
    }
}
