"""care facilities seed image url

Revision ID: f39f8960a313
Revises: c0e527e36f67
Create Date: 2025-03-06 21:35:03.125996

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'f39f8960a313'
down_revision = 'c0e527e36f67'
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
        UPDATE carefacility
        SET image_url = 'https://placehold.co/600x400'
        WHERE image_url IS NULL
        """
    )


def downgrade():
    op.execute(
        """
        UPDATE carefacility
        SET image_url = NULL
        WHERE image_url IS NOT NULL
        """
    )
