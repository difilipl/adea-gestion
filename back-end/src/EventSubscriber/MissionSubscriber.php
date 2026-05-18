<?php

namespace App\EventSubscriber;

use App\Entity\Etape;
use App\Entity\Mission;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
class MissionSubscriber
{

    public function prePersist(LifecycleEventArgs $args){
        $mission = $args->getObject();

        if( !$mission instanceof Mission || !$mission->getModeleMission() ){
            return;
        }
        $modeleEtapes = $mission->getModeleMission()->getModeleEtapes()->toArray();
        $dateCourante = clone $mission->getDateDebut();
        usort($modeleEtapes, function($a, $b) {
            return $a->getOrdre() - $b->getOrdre();
        });
        foreach($modeleEtapes as $modeleEtape){
            $etape = new Etape();

            $etape->setMission($mission);

            $etape->setDateDebut(clone $dateCourante);

            $dateFin = clone $dateCourante;

            $duree = $modeleEtape->getDureeJours() ?? 0;
            if ($duree > 0) {
                $dateFin->modify("+" . $duree . " days");
            }

            $etape->setDateFinPrevue($dateFin);

            $etape->setTypeEtape($modeleEtape->getTypeEtape());
            $etape->setEstTerminee(false);

            $mission->addEtape($etape);

            $dateCourante = $dateFin;
        }
        if ($mission->getDateFinPrevue() === null && !empty($modeleEtapes)) {
            $mission->setDateFinPrevue(clone $dateCourante);
        }

    }
    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $mission = $args->getObject();

        if (!$mission instanceof Mission || $args->hasChangedField('date_fin_prevue')){
            return;
        }

        if ($args->hasChangedField('date_debut') && $mission->getModeleMission()) {

            $modeleEtapes = $mission->getModeleMission()->getModeleEtapes();
            if ($modeleEtapes->isEmpty()) {
                return;
            }

            $dureeTotale = 0;
            foreach ($modeleEtapes as $modeleEtape) {
                $dureeTotale += $modeleEtape->getDureeJours() ?? 0;
            }

            if ($dureeTotale > 0) {
                $nouvelleDateFin = clone $mission->getDateDebut();
                $nouvelleDateFin->modify('+' . $dureeTotale . ' days');
                $mission->setDateFinPrevue($nouvelleDateFin);
                $args->setNewValue('date_fin_prevue', $nouvelleDateFin);
            }
        }
    }
}
