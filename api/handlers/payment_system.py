from flask import jsonify

from api import app, models

__author__ = 'Kostel Serhii'


@app.route('/api/admin/dev/payment_systems/allowed/paysys_id', methods=['GET'])
def allowed_paysys_id():
    return jsonify(paysys_id=models.PaymentSystem.allowed_paysys_id())
