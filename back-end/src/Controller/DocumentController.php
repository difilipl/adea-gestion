<?php

namespace App\Controller;

use App\Entity\Document;
use App\Entity\Client;
use App\Entity\Mission;
use App\Entity\Etape;
use App\Entity\Categorie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class DocumentController extends AbstractController
{
    #[Route('/api/documents/upload', name: 'document_upload', methods: ['POST'])]
    public function upload(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $fichier = $request->files->get('fichier');

        if (!$fichier) {
            return new JsonResponse(['error' => 'Aucun fichier reçu'], 400);
        }

        if ($fichier->getSize() > 50 * 1024 * 1024) {
            return new JsonResponse(['error' => 'Fichier trop volumineux (50 Mo max)'], 400);
        }

        $clientId    = $request->request->get('client_id');
        $missionId   = $request->request->get('mission_id');
        $etapeId     = $request->request->get('etape_id');
        $categorieId = $request->request->get('categorie_id');
        $nom         = $request->request->get('nom');

        $nomOriginal = $fichier->getClientOriginalName();
        $extension   = $fichier->guessExtension() ?? pathinfo($nomOriginal, PATHINFO_EXTENSION);
        $nomFichier  = uniqid('doc_') . '.' . $extension;
        $dossier     = $this->getParameter('upload_directory');

        $mimeType = $fichier->getMimeType() ?? 'application/octet-stream';
        $taille = $fichier->getSize();

        $fichier->move($dossier, $nomFichier);

        $document = new Document();
        $document->setNom($nom ?? $nomOriginal);
        $document->setCheminFichier('uploads/' . $nomFichier);
        $document->setFormat($extension);
        $document->setTypeMime($mimeType);
        $document->setTaille($taille);

        $document->setDateUpload(new \DateTimeImmutable());

        if ($categorieId) {
            $categorie = $em->getRepository(Categorie::class)->find($categorieId);
            if ($categorie) {
                $document->setCategorie($categorie);
            }
        }

        if ($clientId) {
            $client = $em->getRepository(Client::class)->find($clientId);
            if ($client) $document->setClient($client);
        }

        if ($missionId) {
            $mission = $em->getRepository(Mission::class)->find($missionId);
            if ($mission) $document->setMission($mission);
        }

        if ($etapeId) {
            $etape = $em->getRepository(Etape::class)->find($etapeId);
            if ($etape) $document->setEtape($etape);
        }

        $em->persist($document);
        $em->flush();


        return new JsonResponse([
            'id'          => $document->getId(),
            'nom'         => $document->getNom(),
            'chemin'      => $document->getCheminFichier(),
            'type_mime'   => $document->getTypeMime(),
            'taille'      => $document->getTaille(),
            'date_upload' => $document->getDateUpload()->format('d/m/Y H:i'),
            'message'     => 'Document uploadé avec succès'
        ], 201);
    }

    #[Route('/api/documents/{id}', name: 'document_delete', methods: ['DELETE'])]
    public function delete(Document $document, EntityManagerInterface $em): JsonResponse
    {
        $cheminComplet = $this->getParameter('kernel.project_dir') . '/public/' . $document->getCheminFichier();
        if (file_exists($cheminComplet)) {
            unlink($cheminComplet);
        }

        $em->remove($document);
        $em->flush();

        return new JsonResponse(['message' => 'Document supprimé'], 200);
    }

    #[Route('/api/documents', name: 'document_list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $clientId  = $request->query->get('client_id');
        $missionId = $request->query->get('mission_id');
        $etapeId   = $request->query->get('etape_id');

        $repo = $em->getRepository(Document::class);

        if ($clientId) {
            $documents = $repo->findBy(['client' => $clientId]);
        } elseif ($missionId) {
            $documents = $repo->findBy(['mission' => $missionId]);
        } elseif ($etapeId) {
            $documents = $repo->findBy(['etape' => $etapeId]);
        } else {
            return new JsonResponse(['error' => 'Paramètre manquant : client_id, mission_id ou etape_id requis'], 400);
        }

        $data = array_map(fn($doc) => [
            'id'          => $doc->getId(),
            'nom'         => $doc->getNom(),
            'chemin'      => $doc->getCheminFichier(),
            'type_mime'   => $doc->getTypeMime(),
            'taille'      => $doc->getTaille(),
            'date_upload' => $doc->getDateUpload()?->format('d/m/Y H:i'),
        ], $documents);

        return new JsonResponse($data, 200);
    }
}
