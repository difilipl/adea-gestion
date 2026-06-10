<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260608045420 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE utilisateur (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
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
        $this->addSql('DROP TABLE utilisateur');
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
    }
}
