<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260519054551 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE alerte DROP CONSTRAINT fk_3ae753a19eb6921');
        $this->addSql('DROP INDEX idx_3ae753a19eb6921');
        $this->addSql('ALTER TABLE alerte ADD type VARCHAR(50) NOT NULL');
        $this->addSql('ALTER TABLE alerte RENAME COLUMN client_id TO mission_id');
        $this->addSql('ALTER TABLE alerte ADD CONSTRAINT FK_3AE753ABE6CAE90 FOREIGN KEY (mission_id) REFERENCES mission (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_3AE753ABE6CAE90 ON alerte (mission_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE alerte DROP CONSTRAINT FK_3AE753ABE6CAE90');
        $this->addSql('DROP INDEX IDX_3AE753ABE6CAE90');
        $this->addSql('ALTER TABLE alerte DROP type');
        $this->addSql('ALTER TABLE alerte RENAME COLUMN mission_id TO client_id');
        $this->addSql('ALTER TABLE alerte ADD CONSTRAINT fk_3ae753a19eb6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_3ae753a19eb6921 ON alerte (client_id)');
    }
}
