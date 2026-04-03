<?php

namespace App\Form;

use App\Entity\ModeleEtape;
use App\Entity\ModeleMission;
use App\Entity\TypeEtape;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ModeleEtapeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('ordre')
            ->add('duree_jours')
            ->add('type_etape', EntityType::class, [
                'class' => TypeEtape::class,
                'choice_label' => 'nom',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => ModeleEtape::class,
        ]);
    }
}
