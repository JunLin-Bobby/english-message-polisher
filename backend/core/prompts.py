#System Basic Prompt and Restrictions
# backend/core/prompts.py
POLISH_BASE_PROMPT = """You are a professional English copywriter.
Your task is to polish the following text to have a '{tone}' tone.

{context_section}

Text to polish:
{text}
"""

EMAIL_CONTEXT_TEMPLATE = "This text is intended for an email."
EMAIL_RECIPIENT_TEMPLATE = " The recipient is: {recipient}."
EMAIL_SUBJECT_TEMPLATE = " The subject line is: {subject}."