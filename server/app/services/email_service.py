import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings
from app.core.errors import EMAIL_SEND_FAILED


def email_validator(email):
    pattern = (
        r"^(?!\.)(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+"
        r"@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$"
    )

    return re.match(pattern, email) is not None


def send_email(to_email: str, subject: str, body: str):
    from_email = "hlibsuprun@gmail.com"

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(from_email, settings.APP_PASSWORD)
        server.sendmail(from_email, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(e)
        raise Exception(EMAIL_SEND_FAILED)


def send_otp_email(email: str, otp: str):
    subject = "Your OTP Code"
    body = f"Your OTP code is: {otp}"
    send_email(email, subject, body)


def send_password_reset_link(email: str, link: str):
    subject = "Your password reset link"
    body = f"Your password reset link is: {link}"
    send_email(email, subject, body)
