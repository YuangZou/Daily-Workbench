#!/usr/bin/env python3
"""Build the browser data bundle for the AI hardware dashboard."""

from __future__ import annotations

import argparse
import csv
import gzip
import json
import statistics
from collections import defaultdict
from pathlib import Path


GPU_NAMES = ("H100", "H200", "B200", "A100")


def read_fred(path: Path, series: dict[str, str], start: str = "2024-01-01") -> list[dict]:
    rows = []
    with path.open(newline="") as handle:
        for row in csv.DictReader(handle):
            date = row["observation_date"]
            if date < start:
                continue
            item = {"date": date}
            for source, target in series.items():
                value = row.get(source, "")
                item[target] = float(value) if value else None
            rows.append(item)
    return rows


def read_gpu(paths: list[Path]) -> dict:
    by_gpu = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for path in paths:
        with gzip.open(path, "rt", newline="") as handle:
            for row in csv.DictReader(handle):
                gpu = row.get("gpu_name", "").upper()
                if gpu not in GPU_NAMES:
                    continue
                if row.get("pricing_type") != "on_demand" or row.get("currency") != "USD":
                    continue
                try:
                    value = float(row.get("price_per_gpu_hour") or "")
                except ValueError:
                    continue
                if 0 < value < 100:
                    by_gpu[gpu][row["snapshot_date"]][row["source"]].append(value)

    result = {"latestDate": "", "rows": []}
    for gpu in GPU_NAMES:
        latest = max(by_gpu[gpu])
        result["latestDate"] = max(result["latestDate"], latest)
        source_medians = [statistics.median(values) for values in by_gpu[gpu][latest].values()]
        quartiles = statistics.quantiles(source_medians, n=4, method="inclusive")
        result["rows"].append({
            "gpu": gpu,
            "median": round(statistics.median(source_medians), 3),
            "p25": round(quartiles[0], 3),
            "p75": round(quartiles[2], 3),
            "min": round(min(source_medians), 3),
            "max": round(max(source_medians), 3),
            "sources": len(source_medians),
        })
    return result


def read_lmarena(path: Path) -> dict:
    payload = json.loads(path.read_text())
    rows = [entry["row"] for entry in payload["rows"]]

    def compact(row: dict) -> dict:
        return {
            "rank": int(row["rank"]),
            "model": row["model_name"],
            "organization": row["organization"],
            "license": row["license"],
            "rating": round(row["rating"], 1),
            "lower": round(row["rating_lower"], 1),
            "upper": round(row["rating_upper"], 1),
            "votes": int(row["vote_count"]),
        }

    overall = [compact(row) for row in rows[:12]]
    open_models = [compact(row) for row in rows if row["license"] != "Proprietary"][:8]
    return {
        "publishDate": rows[0]["leaderboard_publish_date"],
        "overall": overall,
        "open": open_models,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--hardware", type=Path, required=True)
    parser.add_argument("--activity", type=Path, required=True)
    parser.add_argument("--arena", type=Path, required=True)
    parser.add_argument("--gpu", type=Path, action="append", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    data = {
        "ppi": read_fred(args.hardware, {
            "PCU334413334413": "semiconductor",
            "PCU3341123341121": "storage",
            "PCU334111334111": "computer",
        }),
        "activity": read_fred(args.activity, {
            "IPG3344S": "production",
            "CAPUTLG3344S": "capacity",
        }),
        "gpu": read_gpu(args.gpu),
        "arena": read_lmarena(args.arena),
        "modelPriceMilestones": [
            {"date": "2023-03-14", "model": "GPT-4", "input": 30, "output": 60},
            {"date": "2024-05-13", "model": "GPT-4o", "input": 5, "output": 15},
            {"date": "2025-04-14", "model": "GPT-4.1", "input": 2, "output": 8},
            {"date": "2025-08-07", "model": "GPT-5", "input": 1.25, "output": 10},
        ],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        "window.AI_HARDWARE_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    )


if __name__ == "__main__":
    main()
