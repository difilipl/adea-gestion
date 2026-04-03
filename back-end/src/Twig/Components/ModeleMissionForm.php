<?php

namespace App\Twig\Components;


use App\Entity\ModeleMission;
use App\Entity\ModeleEtape;
use App\Form\ModeleMissionType;
use Symfony\Component\Form\FormInterface;
use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\Attribute\LiveAction;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\ComponentWithFormTrait;
use Symfony\UX\LiveComponent\DefaultActionTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsLiveComponent]
final class ModeleMissionForm extends AbstractController
{
    // 2. LES TRAITS : On injecte les comportements "Live" et "Formulaire"
    use DefaultActionTrait;
    use ComponentWithFormTrait;

    /**
     * 3. L'ÉTAT (STATE) : La donnée que le composant garde en mémoire.
     * #[LiveProp(writable: true)] permet de modifier l'objet en temps réel
     * depuis le formulaire Twig (Data Binding).
     */
    #[LiveProp(writable: true)]
    public ModeleMission $initialFormData;

    /**
     * 4. LE PONT (FORM BRIDGE) : On dit au composant quel formulaire utiliser.
     * Cette méthode est obligatoire car on utilise 'ComponentWithFormTrait'.
     */
    protected function instantiateForm(): FormInterface
    {

        return $this->createForm(ModeleMissionType::class, $this->initialFormData);
    }

    /**
     * 5. L'ACTION DYNAMIQUE : Le code déclenché par un bouton.
     * L'attribut #[LiveAction] rend cette méthode accessible depuis Twig via Ajax.
     */
    #[LiveAction]
    public function addEtape(): void
    {
        $this->submitForm();
        $this->initialFormData->addModeleEtape(new ModeleEtape());
        $this->resetForm();
    }

}
