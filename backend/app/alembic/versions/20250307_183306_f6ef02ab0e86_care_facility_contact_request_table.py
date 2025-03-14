"""care facility contact request table

Revision ID: f6ef02ab0e86
Revises: f39f8960a313
Create Date: 2025-03-07 18:33:06.342622

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = 'f6ef02ab0e86'
down_revision = 'f39f8960a313'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('carefacilitycontactrequest',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('care_facility_id', sa.Uuid(), nullable=True),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
    sa.Column('email', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
    sa.Column('phone', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
    sa.Column('care_type', sa.String(length=20), nullable=False),
    sa.ForeignKeyConstraint(['care_facility_id'], ['carefacility.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('carefacilitycontactrequest')
    # ### end Alembic commands ###
