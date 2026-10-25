"""Generate public Firebase web configuration without shell interpolation."""

import json
import os
from pathlib import Path


def generate_config(environ):
    fields = {
        "apiKey": "FIREBASE_API_KEY",
        "authDomain": "FIREBASE_AUTH_DOMAIN",
        "projectId": "FIREBASE_PROJECT_ID",
        "storageBucket": "FIREBASE_STORAGE_BUCKET",
        "messagingSenderId": "FIREBASE_MESSAGING_SENDER_ID",
        "appId": "FIREBASE_APP_ID",
        "measurementId": "FIREBASE_MEASUREMENT_ID",
    }
    config = {field: environ.get(variable, "") for field, variable in fields.items()}
    required = ("apiKey", "authDomain", "projectId", "appId")
    if not any(config.values()):
        return {"enabled": False}
    missing = [fields[field] for field in required if not config[field].strip()]
    if missing:
        raise ValueError("Incomplete Firebase configuration: " + ", ".join(missing))
    return config


if __name__ == "__main__":
    config = generate_config(os.environ)
    target = Path(__file__).resolve().parents[1] / "assets/js/firebase-config.json"
    target.write_text(json.dumps(config, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Firebase comments " + ("disabled" if config.get("enabled") is False else "configured"))
