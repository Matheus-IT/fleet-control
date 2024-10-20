from django.test import TestCase
from api.models import User
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken


class TokenTests(TestCase):
    def setUp(self):
        pass

    def test_should_obtain_access_and_refresh_token(self):
        # given
        user = User.objects.create_user(email="test@test.com", password="12345678")
        payload = {
            "email": "test@test.com",
            "password": "12345678",
        }
        # when
        res = self.client.post(reverse("token_obtain_pair"), payload)
        # then
        response_data = res.json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue("refresh" in response_data)
        self.assertTrue("access" in response_data)

    def test_should_obtain_new_access_using_refresh_token(self):
        # given
        user = User.objects.create_user(email="test@test.com", password="12345678")
        # Create a refresh token for the user directly
        refresh = RefreshToken.for_user(user)

        # Prepare payload with the refresh token
        payload = {"refresh": str(refresh)}
        # when
        res = self.client.post(reverse("token_refresh"), payload)
        # then
        response_data = res.json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue("access" in response_data)
