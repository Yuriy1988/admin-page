from api import db
from api.models import base, PaySysContract

__author__ = 'Kostel Serhii'

_PAYMENT_SYSTEMS_ID_ENUM = ('PAY_PAL', 'BIT_COIN', 'VISA_MASTER')
_PAYMENT_SYSTEMS_NAME = ('PayPal', 'Bitcoin', 'Visa/MasterCard')

_PAYSYS_WITHOUT_CONTRACTS = ('PAY_PAL', )


class PaymentSystem(base.BaseModel):

    __tablename__ = 'payment_systems'

    id = db.Column(db.String(20), primary_key=True)
    paysys_name = db.Column(db.String(80), nullable=False)
    active = db.Column(db.Boolean, default=False)

    def __init__(self, paysys_id, paysys_name, active=False):
        self.id = paysys_id
        self.paysys_name = paysys_name
        self.active = active

    def __repr__(self):
        return '<PaymentSystem %r>' % self.id

    def has_contracts(self):
        return self.id in _PAYSYS_WITHOUT_CONTRACTS or \
               PaySysContract.query.filter_by(paysys_id=self.id).count() >= 1

    def is_allowed_to_use(self):
        """Allowed only if has contract."""
        return self.active and self.has_contracts()

    @classmethod
    def allowed_paysys_id(cls):
        """
        Payment system id, that allowed to use only
        if active=True and login, password specified
        :return set allowed paysys_id
        """
        # FIXME: select with single query
        return set(ps.id for ps in cls.query.all() if ps.is_allowed_to_use())
