from api.tests import base

__author__ = 'Kostel Serhii'


class TestEmails(base.BaseTestCase):

    def test_emails_group_empty(self):
        status, body = self.get('/emails/groups/merchant', auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [])

        status, body = self.get('/emails/groups/managers', auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [])

    def test_emails_group(self):
        admin_emails = {self.get_admin()['email']}
        merchant_emails = set('merchant%d@test.com' % mi for mi in range(5))
        manager_emails = set('manager%d@test.com' % mi for mi in range(5))

        for mer_mail, man_mail in zip(merchant_emails, manager_emails):
            merchant_dict = self.get_merchant()
            merchant_dict['user']['email'] = mer_mail
            merchant = self.create_merchant(merchant_dict, mer_mail, mer_mail)

            manager_dict = self.get_manager()
            manager_dict['user']['email'] = man_mail
            manager = self.create_manager(manager_dict, merchant.id, man_mail)

        groups = ('admin', 'merchant', 'manager')
        emails = (admin_emails, merchant_emails, manager_emails)
        for group_name, group_emails in zip(groups, emails):
            status, body = self.get('/emails/groups/%s' % group_name, auth='system')
            self.assertEqual(status, 200)
            self.assertSetEqual(set(body['emails']), group_emails)

    def test_emails_group_wrong_group(self):
        status, body = self.get('/emails/groups/wrong', auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [])

    def test_emails_user(self):
        merchant = self.create_merchant(self.get_merchant())

        status, body = self.get('/emails/users/%s' % merchant.user.id, auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [merchant.user.email])

    def test_emails_user_not_found(self):
        status, body = self.get('/emails/users/1213', auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [])

    def test_emails_store_merchants(self):
        merchant = self.create_merchant(self.get_merchant())
        store = self.create_store(self.get_store(), merchant.id)

        status, body = self.get('/emails/stores/%s/merchants' % store.id, auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [merchant.user.email])

    def test_emails_store_merchants_not_found(self):
        status, body = self.get('/emails/stores/1215/merchants', auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [])

    def test_emails_store_managers(self):
        merchant = self.create_merchant(self.get_merchant())
        manager = self.create_manager(self.get_manager(), merchant.id)
        store = self.create_store(self.get_store(), merchant.id)

        status, body = self.get('/emails/stores/%s/managers' % store.id, auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [])

        # add manager to store
        status, body = self.post('/managers/%s/stores/%s' % (manager.id, store.id), body={})
        self.assertEqual(status, 200)

        status, body = self.get('/emails/stores/%s/managers' % store.id, auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [manager.user.email])

    def test_emails_store_managers_not_found(self):
        status, body = self.get('/emails/stores/1215/managers', auth='system')
        self.assertEqual(status, 200)
        self.assertListEqual(body['emails'], [])
