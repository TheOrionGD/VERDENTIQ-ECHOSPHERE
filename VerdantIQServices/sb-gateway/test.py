import generate_report
with open('src/main/java/com/verdantiq/gateway/dept/DeptController.java') as f: content = f.read()
lines = content.split('\n')
for i, line in enumerate(lines):
    if '@PostMapping("/verification-queue/{id}/process")' in line:
        body = generate_report.get_method_body(content, i)
        print('BODY:')
        print(body)
        print('SERVICE CALL:')
        print(generate_report.find_service_call(body))
