import re
import os
import glob

with open("O:/PROJECTS/Ecosphere/VerdantIQCLIENT/docs/API_CONTRACT.md", "r", encoding="utf-8") as f:
    contract = f.read()

endpoints = []
current_scope = "None"
for line in contract.split('\n'):
    if line.startswith("- **Role & Scope**:"):
        current_scope = line.split(":", 1)[1].strip()
    if line.startswith("### ") and any(m in line for m in ["GET ", "POST ", "PUT ", "PATCH ", "DELETE "]):
        match = re.search(r'### `(GET|POST|PUT|PATCH|DELETE) (.*?)`', line)
        if not match:
            match = re.search(r'`(GET|POST|PUT|PATCH|DELETE) (.*?)`', line)
        if match:
            path = match.group(2)
            endpoints.append((match.group(1), path, current_scope))

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
        m = re.search(r'([A-Z][a-zA-Z0-9_]+Service)', service_var.capitalize())
        if m: service_class = m.group(1)
        else: service_class = service_var[0].upper() + service_var[1:]

    if not service_class: return ""

    for jf, content in java_contents.items():
        if os.path.basename(jf) == service_class + ".java":
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if method_name + "(" in line and ("public" in line or "protected" in line):
                    return get_method_body(content, i)
    return ""

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
                if s_var and s_meth:
                    s_body = find_service_method_body(s_var, s_meth, content)
                
                full_logic = body + "\n" + s_body
                
                status = "REAL"
                notes = ""
                
                # Check STUB strictly
                is_stub = False
                if "UnsupportedOperationException" in full_logic or "TODO" in full_logic or "FIXME" in full_logic:
                    is_stub = True
                elif "return null" in full_logic or "return List.of()" in full_logic or "new ArrayList<>()" in full_logic or "Collections.emptyList()" in full_logic:
                    # Ignore dummy repository tricks
                    if "dummyRepository" in full_logic:
                        is_stub = True
                    elif "save(" not in full_logic and "delete(" not in full_logic and "find" not in full_logic:
                        is_stub = True
                elif "dummyRepository" in full_logic:
                    is_stub = True
                elif "return \"\"" in full_logic or "return \"{}" in full_logic:
                    is_stub = True
                
                # if proxyRequest but using dummyRepository, it's stub
                if "proxyRequest" in full_logic and "dummyRepository" in full_logic:
                    is_stub = True
                    
                # if proxyRequest without dummyRepository, it's real
                is_proxy = "proxyRequest" in full_logic
                
                has_repo = "Repository" in full_logic and ("dummy" not in full_logic) and (".find" in full_logic or ".save" in full_logic or ".delete" in full_logic or ".findAll" in full_logic)
                
                if not is_proxy and not has_repo:
                    is_stub = True
                
                if "CURRENT_REGION_STUB" in full_logic:
                    is_stub = True
                
                if "candidates.add(java.util.Map.of(" in full_logic or "new DigitalTwinHouse(" in full_logic or "new StudentDashboardData(" in full_logic or "new InstitutionDashboardMetrics" in full_logic or "new DeptDashboardData" in full_logic:
                    is_stub = True
                    
                if True:
                    if '/verification-queue/{id}/process' in path:
                        print('DEBUG FULL_LOGIC:', repr(full_logic))
                if is_stub:
                    status = "STUB"
                    notes = "Returns hardcoded value or stub"
                
                # Scoping requirements
                requires_scoping = False
                required_checks = []
                scoping = "N/A"
                if "tenant_id" in scope or "tenant" in scope.lower():
                    requires_scoping = True
                    required_checks.append("tenant")
                if "dept_id" in scope or "department" in scope.lower():
                    requires_scoping = True
                    required_checks.append("dept")
                if "household_id" in scope or "household" in scope.lower() or "dorm" in scope.lower() or "resident" in scope.lower() or "student" in scope.lower():
                    requires_scoping = True
                    required_checks.append("user/household")
                if "region_id" in scope or "stateId" in scope:
                    requires_scoping = True
                    required_checks.append("region")
                
                if "platform_admin" in scope or "public" in scope.lower() or "unauthenticated" in scope.lower() or "auditor" in scope.lower() or "mlops_admin" in scope.lower():
                    requires_scoping = False
                
                # Admin paths that are platform_admin usually don't have scoping, but if they explicitly mention tenant_id, they do.
                if "tenant_id" in scope and "platform_admin" in scope:
                    requires_scoping = True
                    required_checks = ["tenant"]
                    
                if requires_scoping:
                    has_tenant = "getCurrentTenantId" in full_logic or "getTenantId" in full_logic or "tenantId" in full_logic
                    has_dept = "getCurrentDeptId" in full_logic or "getDepartmentId" in full_logic or "departmentId" in full_logic
                    has_user = "getCurrentUserId" in full_logic or "getUid" in full_logic or "getHouseholdId" in full_logic
                    has_region = "getCurrentRegionId" in full_logic or "stateId" in full_logic or "getRegionId" in full_logic
                    
                    ok = True
                    missing = []
                    for req in required_checks:
                        if req == "tenant" and not has_tenant: ok = False; missing.append("tenant")
                        if req == "dept" and not has_dept: ok = False; missing.append("dept")
                        if req == "user/household" and not has_user: ok = False; missing.append("user/household")
                        if req == "region" and not has_region and "stateId" not in path: ok = False; missing.append("region")
                        
                    if ok:
                        scoping = "Y"
                    else:
                        scoping = "N"
                        if status == "REAL":
                            status = "PARTIAL"
                            notes = "Missing scoping check: " + ", ".join(missing)
                
                # Check for @PreAuthorize
                # In Spring Boot, role scoping is checked by @PreAuthorize
                if "role ===" in scope or "role =" in scope or "Role & Scope" in scope:
                    if "unauthenticated" not in scope.lower() and "public" not in scope.lower():
                        # We should verify if controller method or class has @PreAuthorize
                        preauth_found = False
                        # Class level
                        for cl in lines[0:30]:
                            if "@PreAuthorize" in cl:
                                preauth_found = True
                        # Method level
                        for cl in lines[max(0, i-5):i+2]:
                            if "@PreAuthorize" in cl:
                                preauth_found = True
                        if not preauth_found:
                            if status == "REAL":
                                status = "PARTIAL"
                                notes = "Missing @PreAuthorize role check."
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

with open("O:/PROJECTS/Ecosphere/VerdantIQServices/sb-gateway/honest_report.md", "w", encoding="utf-8") as out_f:
    out_f.write("| # | Endpoint | Method | Controller:Line (or NOT FOUND) | Status (REAL/STUB/PARTIAL/MISSING) | Scoping enforced (Y/N/N-A) | Notes |\n")
    out_f.write("|---|---|---|---|---|---|---|\n")
    for r in results:
        parts = r["endpoint"].split(" ", 1)
        out_f.write(f"| {r['id']} | `{parts[1]}` | {parts[0]} | {r['controller']} | {r['status']} | {r['scoping']} | {r['notes']} |\n")

    out_f.write("\n")
    out_f.write(f"Total endpoints checked: {len(results)}\n")
    out_f.write(f"REAL: {len([r for r in results if r['status'] == 'REAL'])}\n")
    out_f.write(f"STUB: {len([r for r in results if r['status'] == 'STUB'])}\n")
    out_f.write(f"PARTIAL: {len([r for r in results if r['status'] == 'PARTIAL'])}\n")
    out_f.write(f"MISSING: {len([r for r in results if r['status'] == 'MISSING'])}\n")
    scoping_issues = [r['endpoint'] for r in results if r['scoping'] == 'N']
    out_f.write(f"Scoping enforced = N or N/A-when-it-shouldn't-be: {len(scoping_issues)}\n")
    for issue in scoping_issues:
        out_f.write(f"- {issue}\n")
