import re
import os
import glob

# 1. Parse API_CONTRACT.md
with open("O:/PROJECTS/Ecosphere/VerdantIQCLIENT/docs/API_CONTRACT.md", "r") as f:
    contract = f.read()

endpoints = []
current_scope = "None"
for line in contract.split('\n'):
    if line.startswith("- **Role & Scope**:"):
        current_scope = line.split(":", 1)[1].strip()
    if line.startswith("### ") and any(m in line for m in ["GET", "POST", "PUT", "PATCH", "DELETE"]):
        match = re.search(r'### `(GET|POST|PUT|PATCH|DELETE) (.*?)`', line)
        if not match:
            match = re.search(r'`(GET|POST|PUT|PATCH|DELETE) (.*?)`', line)
        if match:
            # Check if there is an id in path
            path = match.group(2)
            endpoints.append((match.group(1), path, current_scope))

# 2. Read all java files
java_files = glob.glob("O:/PROJECTS/Ecosphere/VerdantIQServices/sb-gateway/src/main/java/**/*.java", recursive=True)
java_contents = {}
for jf in java_files:
    with open(jf, "r", encoding="utf-8") as f:
        java_contents[jf] = f.read()

def get_method_body(content, method_start_idx):
    lines = content.split('\n')
    body_lines = []
    open_brackets = 0
    started = False
    for j in range(method_start_idx, len(lines)):
        body_lines.append(lines[j])
        open_brackets += lines[j].count('{')
        open_brackets -= lines[j].count('}')
        if '{' in lines[j]:
            started = True
        if started and open_brackets <= 0:
            break
    return "\n".join(body_lines)

def find_service_call(body):
    m = re.search(r'([a-zA-Z0-9_]+Service)\.([a-zA-Z0-9_]+)\(', body)
    if m:
        return m.group(1), m.group(2)
    return None, None

def find_service_method_body(service_var, method_name, controller_content):
    m = re.search(r'([A-Z][a-zA-Z0-9_]+Service)\s+' + service_var, controller_content)
    service_class = None
    if m:
        service_class = m.group(1)
    else:
        m = re.search(r'([A-Z][a-zA-Z0-9_]+Service)\s+' + service_var, controller_content)
        if not m:
            m = re.search(r'([A-Z][a-zA-Z0-9_]+Service)', service_var.capitalize())
            if m: service_class = m.group(1)
            else: service_class = service_var[0].upper() + service_var[1:]

    if not service_class: return ""

    for jf, content in java_contents.items():
        if os.path.basename(jf) == service_class + ".java":
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if method_name + "(" in line and ("public" in line or "protected" in line):
                    return get_method_body(content, i), content
    return "", ""

rows = []
results = []
for idx, (method, path, scope) in enumerate(endpoints):
    base_path = path.split('?')[0]
    
    found = False
    for filepath, content in java_contents.items():
        if "Controller" not in filepath: continue
        if found: break
        lines = content.split('\n')
        class_mapping = ""
        for i, line in enumerate(lines):
            if "@RequestMapping" in line and "class " in "\n".join(lines[i:i+5]):
                m = re.search(r'@RequestMapping\(\s*["\'](.*?)["\']\s*\)', line)
                if m: class_mapping = m.group(1)
                break
        
        for i, line in enumerate(lines):
            mapping_str = f"@{method.capitalize()}Mapping"
            matched_mapping = False
            method_path = class_mapping
            if mapping_str in line:
                m = re.search(rf'{mapping_str}\(\s*["\'](.*?)["\']\s*\)', line)
                if m:
                    mp = m.group(1)
                    if method_path.endswith('/') and mp.startswith('/'): method_path += mp[1:]
                    else: method_path += mp
                matched_mapping = True
            elif "@RequestMapping" in line and "RequestMethod." + method in line:
                m = re.search(r'value\s*=\s*["\'](.*?)["\']', line)
                if not m: m = re.search(r'@RequestMapping\(\s*["\'](.*?)["\']', line)
                if m:
                    mp = m.group(1)
                    if method_path.endswith('/') and mp.startswith('/'): method_path += mp[1:]
                    else: method_path += mp
                matched_mapping = True
                
            if matched_mapping and (method_path == base_path or method_path.replace("{id}", "{id}") == base_path.replace("{id}", "{id}") or re.sub(r'\{.*?\}', '{id}', method_path) == re.sub(r'\{.*?\}', '{id}', base_path)):
                body = get_method_body(content, i)
                s_var, s_meth = find_service_call(body)
                s_body = ""
                s_content = ""
                if s_var and s_meth:
                    s_body, s_content = find_service_method_body(s_var, s_meth, content)
                
                full_logic = body + "\n" + s_body
                
                status = "REAL"
                notes = ""
                scoping = "N"
                
                if "UnsupportedOperationException" in full_logic or "TODO" in full_logic or "FIXME" in full_logic:
                    status = "STUB"
                elif "proxyRequest" in full_logic:
                    status = "REAL"
                elif "Repository" in full_logic and (".find" in full_logic or ".save" in full_logic or ".delete" in full_logic):
                    status = "REAL"
                elif "return null" in full_logic or "return List.of()" in full_logic or "new ArrayList<>()" in full_logic or "Collections.emptyList()" in full_logic:
                    if "Repository" not in full_logic:
                        status = "STUB"
                else:
                    if s_body == "" and s_var:
                        status = "STUB" 
                    elif len(s_body.split('\n')) < 5 and "return" in s_body and ("new " in s_body or "List.of(" in s_body):
                        status = "STUB"
                        
                if "CURRENT_REGION_STUB" in full_logic:
                    status = "STUB"
                
                requires_scoping = False
                required_checks = []
                if "tenant_id" in scope or "tenant" in scope.lower():
                    requires_scoping = True
                    required_checks.append("tenant")
                if "dept_id" in scope or "department" in scope.lower():
                    requires_scoping = True
                    required_checks.append("dept")
                if "household_id" in scope or "household" in scope.lower() or "dorm" in scope.lower() or "resident" in scope.lower() or "student" in scope.lower():
                    requires_scoping = True
                    required_checks.append("household/user")
                if "region_id" in scope or "stateId" in scope:
                    requires_scoping = True
                    required_checks.append("region")
                
                if "platform_admin" in scope or "public" in scope.lower() or "unauthenticated" in scope.lower() or "auditor" in scope.lower() or "mlops_admin" in scope.lower():
                    requires_scoping = False
                    
                if not requires_scoping:
                    scoping = "N/A"
                else:
                    has_tenant = "getCurrentTenantId" in full_logic or "getTenantId" in full_logic
                    has_dept = "getCurrentDeptId" in full_logic or "getDepartmentId" in full_logic
                    has_user = "getCurrentUserId" in full_logic or "getUid" in full_logic
                    has_region = "getCurrentRegionId" in full_logic or "stateId" in full_logic
                    
                    ok = True
                    missing = []
                    for req in required_checks:
                        if req == "tenant" and not has_tenant: ok = False; missing.append("tenant_id")
                        if req == "dept" and not has_dept: ok = False; missing.append("dept_id")
                        if req == "household/user" and not has_user: ok = False; missing.append("user_id")
                        if req == "region" and not has_region and "stateId" not in path: ok = False; missing.append("region_id")
                        
                    if ok:
                        scoping = "Y"
                    else:
                        scoping = "N"
                        if status == "REAL":
                            status = "PARTIAL"
                            notes = "Missing scoping check: " + ", ".join(missing)
                            
                if status == "REAL" and ("candidates.add(java.util.Map.of(" in full_logic or "new DigitalTwinHouse(" in full_logic or "new StudentDashboardData(" in full_logic):
                    if "Repository" not in full_logic:
                        status = "STUB"
                        notes = "Returns hardcoded value"
                        
                if status == "STUB" and not notes:
                    notes = "Returns stubbed/mocked data"
                
                if "role ===" in scope or "role =" in scope:
                    preauth_found = False
                    for check_line in lines[max(0, i-5):i+2]:
                        if "@PreAuthorize" in check_line:
                            preauth_found = True
                    if not preauth_found:
                         if status == "REAL":
                             status = "PARTIAL"
                             notes += " Missing role check."
                             scoping = "N"

                results.append({
                    "id": idx + 1,
                    "endpoint": f"{method} {path}",
                    "controller": f"{os.path.basename(filepath)}:{i+1}",
                    "status": status,
                    "scoping": scoping,
                    "notes": notes.strip()
                })
                found = True
                break

    if not found:
        results.append({
            "id": idx + 1,
            "endpoint": f"{method} {path}",
            "controller": "NOT FOUND",
            "status": "MISSING",
            "scoping": "N/A",
            "notes": ""
        })

with open("report.md", "w", encoding="utf-8") as out_f:
    out_f.write("| # | Endpoint | Method | Controller:Line (or NOT FOUND) | Status (REAL/STUB/PARTIAL/MISSING) | Scoping enforced (Y/N/N-A) | Notes |\n")
    out_f.write("|---|---|---|---|---|---|---|\n")
    for r in results:
        parts = r["endpoint"].split(" ", 1)
        out_f.write(f"| {r['id']} | `{parts[1]}` | {parts[0]} | {r['controller']} | {r['status']} | {r['scoping']} | {r['notes']} |\n")

    out_f.write("\n--- Summary ---\n")
    out_f.write(f"Total endpoints checked: {len(results)}\n")
    out_f.write(f"REAL: {len([r for r in results if r['status'] == 'REAL'])}\n")
    out_f.write(f"STUB: {len([r for r in results if r['status'] == 'STUB'])}\n")
    out_f.write(f"PARTIAL: {len([r for r in results if r['status'] == 'PARTIAL'])}\n")
    out_f.write(f"MISSING: {len([r for r in results if r['status'] == 'MISSING'])}\n")
    scoping_issues = [r['endpoint'] for r in results if r['scoping'] == 'N']
    out_f.write(f"Scoping enforced = N or N/A-when-it-shouldn't-be: {len(scoping_issues)}\n")
    for issue in scoping_issues:
        out_f.write(f"- {issue}\n")

