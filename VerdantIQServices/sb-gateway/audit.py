import re
import os
import glob

# 1. Parse API_CONTRACT.md
with open("O:/PROJECTS/Ecosphere/VerdantIQCLIENT/docs/API_CONTRACT.md", "r") as f:
    contract = f.read()

endpoints = []
for line in contract.split('\n'):
    if line.startswith("### ") and any(m in line for m in ["GET", "POST", "PUT", "PATCH", "DELETE"]):
        # Example: ### `GET /api/v1/auth/me`
        # Some have extra stuff like `GET /api/v1/activity` (`activityApi.getActivityLogs`)
        match = re.search(r'### `(GET|POST|PUT|PATCH|DELETE) (.*?)`', line)
        if match:
            endpoints.append((match.group(1), match.group(2)))

# 2. Find all controllers
controllers = glob.glob("O:/PROJECTS/Ecosphere/VerdantIQServices/sb-gateway/src/main/java/**/*.java", recursive=True)

# 3. Read all controllers
controller_files = {}
for c in controllers:
    with open(c, "r", encoding="utf-8") as f:
        controller_files[c] = f.read()

# 4. Find mappings
import json

results = []

for method, path in endpoints:
    # Remove query params from path for matching
    base_path = path.split('?')[0]
    
    found = False
    for filepath, content in controller_files.items():
        if found: break
        lines = content.split('\n')
        # simple check for class level @RequestMapping
        class_mapping = ""
        for i, line in enumerate(lines):
            if "@RequestMapping" in line and "class " in "\n".join(lines[i:i+5]):
                m = re.search(r'@RequestMapping\(\s*["\'](.*?)["\']\s*\)', line)
                if m:
                    class_mapping = m.group(1)
                    break
        
        for i, line in enumerate(lines):
            # look for method mapping
            # e.g. @GetMapping("/dashboard") or @GetMapping
            mapping_str = f"@{method.capitalize()}Mapping"
            if mapping_str in line:
                m = re.search(rf'{mapping_str}\(\s*["\'](.*?)["\']\s*\)', line)
                method_path = class_mapping
                if m:
                    if method_path.endswith('/') and m.group(1).startswith('/'):
                        method_path += m.group(1)[1:]
                    else:
                        method_path += m.group(1)
                
                # Check if matches base_path
                # e.g. /api/v1/auth/send-otp
                if method_path == base_path or method_path == base_path.replace("{id}", "{id}"): # handle path variables if any
                    # Extract method body
                    # naive bracket matching
                    body_lines = []
                    open_brackets = 0
                    started = False
                    for j in range(i, len(lines)):
                        body_lines.append(lines[j])
                        open_brackets += lines[j].count('{')
                        open_brackets -= lines[j].count('}')
                        if '{' in lines[j]:
                            started = True
                        if started and open_brackets <= 0:
                            break
                    
                    results.append({
                        "endpoint": f"{method} {path}",
                        "method": method,
                        "path": path,
                        "controller": os.path.basename(filepath),
                        "line": i + 1,
                        "body": "\n".join(body_lines),
                        "status": "FOUND"
                    })
                    found = True
                    break
            # Check @RequestMapping(value="...", method=RequestMethod.GET)
            elif "@RequestMapping" in line and "RequestMethod." + method in line:
                m = re.search(r'value\s*=\s*["\'](.*?)["\']', line)
                if not m:
                    m = re.search(r'@RequestMapping\(\s*["\'](.*?)["\']', line)
                method_path = class_mapping
                if m:
                    if method_path.endswith('/') and m.group(1).startswith('/'):
                        method_path += m.group(1)[1:]
                    else:
                        method_path += m.group(1)
                
                if method_path == base_path:
                    # naive bracket matching
                    body_lines = []
                    open_brackets = 0
                    started = False
                    for j in range(i, len(lines)):
                        body_lines.append(lines[j])
                        open_brackets += lines[j].count('{')
                        open_brackets -= lines[j].count('}')
                        if '{' in lines[j]:
                            started = True
                        if started and open_brackets <= 0:
                            break
                    results.append({
                        "endpoint": f"{method} {path}",
                        "method": method,
                        "path": path,
                        "controller": os.path.basename(filepath),
                        "line": i + 1,
                        "body": "\n".join(body_lines),
                        "status": "FOUND"
                    })
                    found = True
                    break

    if not found:
        results.append({
            "endpoint": f"{method} {path}",
            "method": method,
            "path": path,
            "status": "NOT FOUND"
        })

with open("O:/PROJECTS/Ecosphere/VerdantIQServices/sb-gateway/audit_results.json", "w") as f:
    json.dump(results, f, indent=2)
