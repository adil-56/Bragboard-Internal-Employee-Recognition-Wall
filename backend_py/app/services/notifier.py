import logging
from typing import Optional

# Setup a dedicated logger for notifications to make it stand out in the terminal
logger = logging.getLogger("notifiers")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('\n[🚀 SLACK NOTIFICATION VIRTUAL DISPATCHER]\n%(message)s\n')
ch.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(ch)

class NotificationService:
    @staticmethod
    def send_shoutout_alert(sender_email: str, receiver_email: Optional[str], message: str, points: int):
        """
        Simulates sending a webhook to Slack/Teams.
        In a real scenario, this would use requests.post(url, data=payload)
        """
        target = f"@{receiver_email.split('@')[0]}" if receiver_email else "the #general channel"
        sender_name = sender_email.split('@')[0].capitalize()
        
        payload = f"""====================================================
🔔 NEW SHOUTOUT ALERT!
🎯 To: {target}
👤 From: {sender_name}
✨ Points Awarded: {points}
💬 Message: "{message}"
===================================================="""
        logger.info(payload)
