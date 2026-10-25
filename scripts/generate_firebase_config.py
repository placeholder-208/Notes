"""Generate public Firebase web configuration without shell interpolation."""

import argparse
import json
import os
from pathlib import Path


def generate_config(environ, require_config=False):
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
    if not any(config.values()) and not require_config:
        return {"enabled": False}
    missing = [fields[field] for field in required if not config[field].strip()]
    if missing:
        raise ValueError("Incomplete Firebase configuration: " + ", ".join(missing))
    return {"enabled": True, **config}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output", type=Path,
        default=Path(__file__).resolve().parents[1] / "assets/js/firebase-config.json",
        help="Write configuration directly into the built site when deploying.",
    )
    parser.add_argument(
        "--require-config", action="store_true",
        help="Fail deployment if required Firebase settings are unavailable.",
    )
    args = parser.parse_args()
    try:
        config = generate_config(os.environ, require_config=args.require_config)
    except ValueError as error:
        parser.error(str(error))
    target = args.output
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(config, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Firebase comments " + ("disabled" if config.get("enabled") is False else "configured"))
