#!/usr/bin/env python3
"""Tarot Card of the Day menu bar plugin for SwiftBar."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path


REPO = Path(__file__).resolve().parents[2]
DECK_FILE = Path(__file__).resolve().parent / "deck.json"


def hash32(text: str) -> int:
    value = 0x811C9DC5
    for char in text:
        value ^= ord(char)
        value = (value * 0x01000193) & 0xFFFFFFFF
    value ^= value >> 16
    value = (value * 0x85EBCA6B) & 0xFFFFFFFF
    value ^= value >> 13
    value = (value * 0xC2B2AE35) & 0xFFFFFFFF
    value ^= value >> 16
    return value & 0xFFFFFFFF


def clean(text: object) -> str:
    return " ".join(str(text).replace("|", "¦").split())


def quoted(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> None:
    cards = json.loads(DECK_FILE.read_text(encoding="utf-8"))
    day_key = date.today().isoformat()
    card = cards[hash32("reva.tarot:" + day_key) % len(cards)]
    reversed_card = bool(hash32("reversed:" + day_key) & 1)
    orientation = "Reversed" if reversed_card else "Upright"
    keywords = card["reversed" if reversed_card else "upright"]
    reading = card["reversedText" if reversed_card else "uprightText"]
    arcana = f"Major Arcana · {card['numeral']}" if card["major"] else f"Minor Arcana · {card['suitName']} · {card['element']}"
    name = clean(card["name"])
    print(f"🃏 {name}{' ↓' if reversed_card else ' ↑'} | tooltip={quoted(name + ' — ' + orientation + ' · ' + clean(keywords))}")
    print("---")
    print(f"{name} · {orientation}")
    print(arcana)
    print(f"Keywords: {clean(keywords)}")
    print(clean(reading))
    print("---")
    image_path = REPO / "cards" / card["image"]
    if image_path.is_file():
        print(f"View card image | href={image_path.as_uri()}")


if __name__ == "__main__":
    main()
