"""care facilities seed

Revision ID: 7f76c2701ea6
Revises: 427b733280ea
Create Date: 2025-03-06 14:42:11.999716

"""
from uuid import uuid4

from alembic import op


# revision identifiers, used by Alembic.
revision = '7f76c2701ea6'
down_revision = '427b733280ea'
branch_labels = None
depends_on = None


def upgrade():
    uuids = [uuid4() for _ in range(5)]
    op.execute(
        f"""
        INSERT INTO carefacility (id, name, address, zip_code, has_stationary_care, has_day_care, has_ambulatory_care, from_zip_code, to_zip_code, available_capacity, slug)
        VALUES ('{uuids[0]}', 'Facility A', '123 Main St', 12000, True, False, False, 10000, 14999, False, 'facility-a'),
               ('{uuids[1]}', 'Facility B', '456 Oak Ave', 17000, True, False, False, 15000, 19999, True, 'facility-b'),
               ('{uuids[2]}', 'Facility C', '789 Pine Blvd', 22000, False, False, True, 20000, 24999, False, 'facility-c'),
               ('{uuids[3]}', 'Facility D', '101 Maple St', 27000, False, False, True, 25000, 29999, True, 'facility-d'),
               ('{uuids[4]}', 'Facility E', '222 Cedar Ave', 18000, True, False, True, 10000, 24999, True, 'facility-e')
        """
    )


def downgrade():
    op.execute(
        """
        DELETE FROM care_facilities
        """
    )
