import datetime

def format_iso_now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def get_current_day_str() -> str:
    return datetime.datetime.now().strftime("%A, %d %B %Y")
