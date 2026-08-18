const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'api', 'endpoints.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove service imports
const importsToRemove = [
  "import { regionService } from '@/lib/services/regionService';",
  "import { DeptService } from '@/lib/services/deptService';",
  "import { InstitutionService } from '@/lib/services/institutionService';",
  "import { mlopsService } from '@/lib/services/mlopsService';",
  "import { userDataService } from '@/lib/services/userDataService';",
  "import { notificationsService } from '@/lib/services/notificationsService';",
  "import { activityService } from '@/lib/services/activityService';",
  "import { authService } from '@/lib/services/authService';",
  "import { tenantPrivacyService } from '@/lib/services/tenantPrivacyService';"
];

importsToRemove.forEach(imp => {
  content = content.replace(imp + '\n', '');
});

// 2. Remove simple fallbacks
// Regex matches: \s*fallback:\s*[\s\S]*?(?=\n\s*\}\))
content = content.replace(/,\s*fallback:\s*[\s\S]*?(?=\n\s*\}\))/g, '');

// 3. Fix regionApi specific complex functions
// getInstitutionsInState
content = content.replace(/getInstitutionsInState: async \(stateId: string\) => \{[\s\S]*?return apiClient\(\{([\s\S]*?)\}\);\n\s*\}/, 
  "getInstitutionsInState: async (stateId: string) =>\n    apiClient({\n$1})");

// getHouseholdsInState
content = content.replace(/getHouseholdsInState: async \(stateId: string\) => \{[\s\S]*?return apiClient\(\{([\s\S]*?)\}\);\n\s*\}/,
  "getHouseholdsInState: async (stateId: string) =>\n    apiClient({\n$1})");

// registerHousehold
content = content.replace(/registerHousehold: async \([\s\S]*?\) => \{[\s\S]*?return apiClient\(\{([\s\S]*?)\}\);\n\s*\}/,
  "registerHousehold: async (household: {\n    name: string;\n    email: string;\n    stateId: string;\n    districtId: string;\n    address?: string;\n  }) =>\n    apiClient({\n$1})");

// getStateAggregate
content = content.replace(/getStateAggregate: async \(stateId: string\) => \{[\s\S]*?return apiClient\(\{([\s\S]*?)\}\);\n\s*\}/,
  "getStateAggregate: async (stateId: string) =>\n    apiClient({\n$1})");

// Check if any fallbacks are left and remove them again inside the cleaned up ones
content = content.replace(/,\s*fallback:\s*[\s\S]*?(?=\n\s*\}\))/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Refactored endpoints.ts successfully");
