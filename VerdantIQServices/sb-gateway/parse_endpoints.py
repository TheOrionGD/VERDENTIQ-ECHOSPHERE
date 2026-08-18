import re
import json

with open("O:/PROJECTS/Ecosphere/VerdantIQCLIENT/docs/API_CONTRACT.md", "r") as f:
    contract = f.read()

endpoints = []
for line in contract.split('\n'):
    if "`GET " in line or "`POST " in line or "`PUT " in line or "`PATCH " in line or "`DELETE " in line:
        # Avoid things that are just internal payloads or similar
        m = re.search(r'`(GET|POST|PUT|PATCH|DELETE)\s+(/.*?)`', line)
        if m:
            method, path = m.group(1), m.group(2)
            if not any(e[0] == method and e[1] == path for e in endpoints):
                endpoints.append((method, path))

with open("endpoints.json", "w") as f:
    json.dump(endpoints, f, indent=2)
print("Count:", len(endpoints))
