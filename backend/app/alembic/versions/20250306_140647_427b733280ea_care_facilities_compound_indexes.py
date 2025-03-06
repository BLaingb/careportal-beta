"""care facilities compound indexes

Revision ID: 427b733280ea
Revises: 080f5913eb0a
Create Date: 2025-03-06 14:06:47.829108

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '427b733280ea'
down_revision = '080f5913eb0a'
branch_labels = None
depends_on = None

def upgrade():
    # Create compound index on care facilities
    # for queries like:
    # SELECT * FROM care_facilities
    # WHERE has_stationary_care = true
    # AND zip_code = 12345
    op.create_index(
        'ix_care_facility_has_stationary_care_zip_code',
        'carefacility',
        ['has_stationary_care', 'zip_code']
    )
    op.create_index(
        'ix_care_facility_has_day_care_zip_code',
        'carefacility',
        ['has_day_care', 'zip_code']
    )
    op.create_index(
        'ix_care_facility_has_ambulatory_care_zip_code',
        'carefacility',
        ['has_ambulatory_care', 'zip_code']
    )


def downgrade():
    op.drop_index('ix_care_facility_has_stationary_care_zip_code', table_name='carefacility')
    op.drop_index('ix_care_facility_has_day_care_zip_code', table_name='carefacility')
    op.drop_index('ix_care_facility_has_ambulatory_care_zip_code', table_name='carefacility')
