from api import db
from api.models import base, enum

__author__ = 'Kostel Serhii'


class PaymentSystem(base.BaseModel):

    __tablename__ = 'payment_systems'

    paysys_id = db.Column(db.Enum(*enum.PAYMENT_SYSTEMS_ID_ENUM, name='enum_payment_system_id'), primary_key=True)
    paysys_name = db.Column(db.String(80), nullable=False)
    paysys_login = db.Column(db.String(255), nullable=False)
    # FIXME: make it secure
    paysys_password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=False)

    def __init__(self, paysys_id, paysys_name, paysys_login, paysys_password, active=False):
        self.paysys_id = paysys_id
        self.paysys_name = paysys_name
        self.paysys_login = paysys_login
        self.paysys_password = paysys_password
        self.active = active

    def __repr__(self):
        return '<PaymentSystem %r>' % self.paysys_name
