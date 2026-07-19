#!/usr/bin/env python3
"""Generate per-locale .po files from the POT plus a translations table."""
import json
import re
import sys

POT = sys.argv[1]
TABLE = sys.argv[2]
OUTDIR = sys.argv[3]
# Text domain, derived from the POT filename (e.g. nuxx-spoiler.pot).
DOMAIN = POT.rsplit("/", 1)[-1].removesuffix(".pot")

with open(TABLE, encoding="utf-8") as fh:
    table = json.load(fh)

with open(POT, encoding="utf-8") as fh:
    pot = fh.read()

# Split into entries on blank lines; first entry is the header.
entries = pot.strip().split("\n\n")
header, body_entries = entries[0], entries[1:]


def unquote(block):
    """Join the C-style quoted string pieces of a msgid/msgstr value."""
    parts = re.findall(r'"((?:[^"\\]|\\.)*)"', block)
    joined = "".join(parts)
    return (
        joined.replace("\\n", "\n")
        .replace("\\t", "\t")
        .replace('\\"', '"')
        .replace("\\\\", "\\")
    )


def quote(value):
    escaped = (
        value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
    )
    return f'"{escaped}"'


for locale, strings in table.items():
    plural = strings["_plural"]
    out = [
        "# Machine translation generated with AI assistance; not yet reviewed",
        "# by a native speaker. Improvements welcome.",
        'msgid ""',
        'msgstr ""',
        f'"Project-Id-Version: Spoiler\\n"',
        f'"Language: {locale}\\n"',
        '"MIME-Version: 1.0\\n"',
        '"Content-Type: text/plain; charset=UTF-8\\n"',
        '"Content-Transfer-Encoding: 8bit\\n"',
        f'"Plural-Forms: {plural}\\n"',
        '"X-Generator: AI machine translation\\n"',
        "",
    ]
    for entry in body_entries:
        m = re.search(
            r'^msgid ((?:"(?:[^"\\]|\\.)*"\s*)+?)(?=msgstr)', entry, re.M | re.S
        )
        if not m:
            continue
        msgid = unquote(m.group(1))
        translation = strings.get(msgid, "")
        # Keep comments/references/context, replace the empty msgstr.
        new_entry = re.sub(
            r'msgstr ""\s*$', "msgstr " + quote(translation), entry.strip()
        )
        out.append(new_entry)
        out.append("")
    path = f"{OUTDIR}/{DOMAIN}-{locale}.po"
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out).strip() + "\n")
    total = len(body_entries)
    translated = sum(
        1
        for entry in body_entries
        if (m := re.search(r'^msgid ((?:"(?:[^"\\]|\\.)*"\s*)+?)(?=msgstr)', entry, re.M | re.S))
        and strings.get(unquote(m.group(1)))
    )
    print(f"{locale}: {translated}/{total} strings translated -> {path}")
