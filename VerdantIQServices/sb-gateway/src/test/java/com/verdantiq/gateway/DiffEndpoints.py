import re
import os

contract_endpoints = set()
with open(r"O:\PROJECTS\Ecosphere\VerdantIQCLIENT\docs\API_CONTRACT.md", "r", encoding="utf-8") as f:
    for line in f:
        match = re.search(r"### `(GET|POST|PUT|DELETE|PATCH) (/[^`]+)`", line)
        if match:
            contract_endpoints.add(f"{match.group(1)} {match.group(2)}")

code_endpoints = set()
base_dir = r"O:\PROJECTS\Ecosphere\VerdantIQServices\sb-gateway\src\main\java\com\verdantiq\gateway"
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith("Controller.java"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                base_path = ""
                for line in f:
                    # e.g., @RequestMapping("/api/v1/user")
                    req_match = re.search(r'@RequestMapping\("([^"]+)"\)', line)
                    if req_match:
                        base_path = req_match.group(1)
                    
                    method_match = re.search(r'@(Get|Post|Put|Delete|Patch)Mapping\("([^"]*)"\)', line)
                    if method_match:
                        method = method_match.group(1).upper()
                        path = method_match.group(2)
                        full_path = base_path + path
                        code_endpoints.add(f"{method} {full_path}")

print("Missing in code (in contract but not in code):")
for ep in sorted(contract_endpoints - code_endpoints):
    print(ep)

print("\nMissing in contract (in code but not in contract):")
for ep in sorted(code_endpoints - contract_endpoints):
    print(ep)
