<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260527062638 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE alerte (id INT AUTO_INCREMENT NOT NULL, message VARCHAR(255) NOT NULL, date_echeance DATETIME NOT NULL, est_lue TINYINT NOT NULL, type VARCHAR(50) NOT NULL, mission_id INT NOT NULL, INDEX IDX_3AE753ABE6CAE90 (mission_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE bibliotheque_doc (id INT AUTO_INCREMENT NOT NULL, nom_modele VARCHAR(255) NOT NULL, chemin_fichier VARCHAR(255) NOT NULL, categorie_id INT NOT NULL, INDEX IDX_C36581A8BCF5E72D (categorie_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE categorie (id INT AUTO_INCREMENT NOT NULL, libelle VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE client (id INT AUTO_INCREMENT NOT NULL, email_principal VARCHAR(255) NOT NULL, telephone VARCHAR(10) NOT NULL, statut VARCHAR(255) NOT NULL, date_creation DATETIME NOT NULL, infos_importantes LONGTEXT DEFAULT NULL, dtype VARCHAR(255) NOT NULL, nom_entreprise VARCHAR(255) DEFAULT NULL, siret VARCHAR(14) DEFAULT NULL, nom VARCHAR(255) DEFAULT NULL, prenom VARCHAR(255) DEFAULT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE contact (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, prenom VARCHAR(255) NOT NULL, poste VARCHAR(255) NOT NULL, telephone_direct VARCHAR(10) NOT NULL, email VARCHAR(255) NOT NULL, entreprise_id INT NOT NULL, INDEX IDX_4C62E638A4AEAFEA (entreprise_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE document (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, chemin_fichier VARCHAR(255) NOT NULL, format VARCHAR(10) NOT NULL, type_mime VARCHAR(255) DEFAULT NULL, taille INT DEFAULT NULL, date_upload DATETIME NOT NULL, categorie_id INT DEFAULT NULL, mission_id INT DEFAULT NULL, etape_id INT DEFAULT NULL, client_id INT DEFAULT NULL, INDEX IDX_D8698A76BCF5E72D (categorie_id), INDEX IDX_D8698A76BE6CAE90 (mission_id), INDEX IDX_D8698A764A8CA2AD (etape_id), INDEX IDX_D8698A7619EB6921 (client_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE email (id INT AUTO_INCREMENT NOT NULL, sujet VARCHAR(255) NOT NULL, contenu LONGTEXT NOT NULL, expediteur VARCHAR(255) NOT NULL, date_reception DATETIME NOT NULL, message_id VARCHAR(255) NOT NULL, client_id INT NOT NULL, INDEX IDX_E7927C7419EB6921 (client_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE etape (id INT AUTO_INCREMENT NOT NULL, date_debut DATE NOT NULL, date_fin_prevue DATE NOT NULL, est_terminee TINYINT NOT NULL, mission_id INT NOT NULL, type_etape_id INT NOT NULL, INDEX IDX_285F75DDBE6CAE90 (mission_id), INDEX IDX_285F75DD87738551 (type_etape_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE mission (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, date_debut DATE NOT NULL, date_fin_prevue DATE DEFAULT NULL, date_fin_reel DATE DEFAULT NULL, statut VARCHAR(50) NOT NULL, client_id INT NOT NULL, modele_mission_id INT DEFAULT NULL, INDEX IDX_9067F23C19EB6921 (client_id), INDEX IDX_9067F23C4D3BB961 (modele_mission_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE modele_etape (id INT AUTO_INCREMENT NOT NULL, ordre INT NOT NULL, duree_jours INT NOT NULL, modele_mission_id INT NOT NULL, type_etape_id INT NOT NULL, INDEX IDX_8D9347C24D3BB961 (modele_mission_id), INDEX IDX_8D9347C287738551 (type_etape_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE modele_mission (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE type_etape (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750 (queue_name, available_at, delivered_at, id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE alerte ADD CONSTRAINT FK_3AE753ABE6CAE90 FOREIGN KEY (mission_id) REFERENCES mission (id)');
        $this->addSql('ALTER TABLE bibliotheque_doc ADD CONSTRAINT FK_C36581A8BCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE contact ADD CONSTRAINT FK_4C62E638A4AEAFEA FOREIGN KEY (entreprise_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE document ADD CONSTRAINT FK_D8698A76BCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE document ADD CONSTRAINT FK_D8698A76BE6CAE90 FOREIGN KEY (mission_id) REFERENCES mission (id)');
        $this->addSql('ALTER TABLE document ADD CONSTRAINT FK_D8698A764A8CA2AD FOREIGN KEY (etape_id) REFERENCES etape (id)');
        $this->addSql('ALTER TABLE document ADD CONSTRAINT FK_D8698A7619EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE email ADD CONSTRAINT FK_E7927C7419EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE etape ADD CONSTRAINT FK_285F75DDBE6CAE90 FOREIGN KEY (mission_id) REFERENCES mission (id)');
        $this->addSql('ALTER TABLE etape ADD CONSTRAINT FK_285F75DD87738551 FOREIGN KEY (type_etape_id) REFERENCES type_etape (id)');
        $this->addSql('ALTER TABLE mission ADD CONSTRAINT FK_9067F23C19EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE mission ADD CONSTRAINT FK_9067F23C4D3BB961 FOREIGN KEY (modele_mission_id) REFERENCES modele_mission (id)');
        $this->addSql('ALTER TABLE modele_etape ADD CONSTRAINT FK_8D9347C24D3BB961 FOREIGN KEY (modele_mission_id) REFERENCES modele_mission (id)');
        $this->addSql('ALTER TABLE modele_etape ADD CONSTRAINT FK_8D9347C287738551 FOREIGN KEY (type_etape_id) REFERENCES type_etape (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE alerte DROP FOREIGN KEY FK_3AE753ABE6CAE90');
        $this->addSql('ALTER TABLE bibliotheque_doc DROP FOREIGN KEY FK_C36581A8BCF5E72D');
        $this->addSql('ALTER TABLE contact DROP FOREIGN KEY FK_4C62E638A4AEAFEA');
        $this->addSql('ALTER TABLE document DROP FOREIGN KEY FK_D8698A76BCF5E72D');
        $this->addSql('ALTER TABLE document DROP FOREIGN KEY FK_D8698A76BE6CAE90');
        $this->addSql('ALTER TABLE document DROP FOREIGN KEY FK_D8698A764A8CA2AD');
        $this->addSql('ALTER TABLE document DROP FOREIGN KEY FK_D8698A7619EB6921');
        $this->addSql('ALTER TABLE email DROP FOREIGN KEY FK_E7927C7419EB6921');
        $this->addSql('ALTER TABLE etape DROP FOREIGN KEY FK_285F75DDBE6CAE90');
        $this->addSql('ALTER TABLE etape DROP FOREIGN KEY FK_285F75DD87738551');
        $this->addSql('ALTER TABLE mission DROP FOREIGN KEY FK_9067F23C19EB6921');
        $this->addSql('ALTER TABLE mission DROP FOREIGN KEY FK_9067F23C4D3BB961');
        $this->addSql('ALTER TABLE modele_etape DROP FOREIGN KEY FK_8D9347C24D3BB961');
        $this->addSql('ALTER TABLE modele_etape DROP FOREIGN KEY FK_8D9347C287738551');
        $this->addSql('DROP TABLE alerte');
        $this->addSql('DROP TABLE bibliotheque_doc');
        $this->addSql('DROP TABLE categorie');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE contact');
        $this->addSql('DROP TABLE document');
        $this->addSql('DROP TABLE email');
        $this->addSql('DROP TABLE etape');
        $this->addSql('DROP TABLE mission');
        $this->addSql('DROP TABLE modele_etape');
        $this->addSql('DROP TABLE modele_mission');
        $this->addSql('DROP TABLE type_etape');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
