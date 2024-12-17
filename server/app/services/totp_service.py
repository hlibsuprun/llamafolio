import pyotp


def generate_totp_secret() -> str:
    return pyotp.random_base32()


def get_totp_provisioning_uri(email: str, secret: str, issuer_name: str) -> str:
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=issuer_name)


def verify_totp(otp: str, secret: str) -> bool:
    totp = pyotp.TOTP(secret)
    return totp.verify(otp)
