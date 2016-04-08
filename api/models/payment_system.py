from passlib.apps import custom_app_context as pwd_context

from api import db
from api.models import base

__author__ = 'Kostel Serhii'

_PAYMENT_SYSTEMS_ID_ENUM = ('PAY_PAL', 'BIT_COIN', 'VISA_MASTER')
_PAYMENT_SYSTEMS_NAME = ('PayPal', 'Bitcoin', 'Visa/MasterCard')


class PaymentSystem(base.BaseModel):

    __tablename__ = 'payment_systems'

    id = db.Column(db.String(20), primary_key=True)
    paysys_name = db.Column(db.String(80), nullable=False)
    active = db.Column(db.Boolean, default=False)

    paysys_login = db.Column(db.String(255))
    _paysys_password_hash = db.Column(db.String(255))

    def __init__(self, paysys_id, paysys_name, active=False, paysys_login=None, paysys_password=None):
        self.id = paysys_id
        self.paysys_name = paysys_name
        self.active = active

        self.paysys_login = paysys_login
        if paysys_password is not None:
            self.set_password(paysys_password)

    def __repr__(self):
        return '<PaymentSystem %r>' % self.paysys_id

    def is_allowed_to_use(self):
        return self.active and self.paysys_login is not None and self._paysys_password_hash is not None

    def set_password(self, password):
        self._paysys_password_hash = pwd_context.encrypt(password)

    def check_password(self, password):
        return pwd_context.verify(password, self._paysys_password_hash)

    @classmethod
    def allowed_paysys_id(cls):
        paysys_id_values = db.session.query(cls.id).\
            filter(cls.active == True, cls.paysys_login != None, cls._paysys_password_hash != None).all()
        return set(ps[0] for ps in paysys_id_values)


def init_payment_systems():
    for ps_id, ps_name in zip(_PAYMENT_SYSTEMS_ID_ENUM, _PAYMENT_SYSTEMS_NAME):
        model = PaymentSystem(ps_id, ps_name)
        db.session.add(model)
    db.session.commit()
