import { RoleType } from '@/lib/services/authService';

export const EDUCATIONAL_DOMAIN_SUFFIXES = [
  '.edu',
  '.ac.uk',
  '.edu.in',
  '.edu.au',
  '.edu.cn',
  '.edu.sg',
  '.edu.ca',
  '.edu.gh',
  '.edu.ng',
  '.sch.uk',
];

export const EDUCATIONAL_EXPLICIT_DOMAINS = [
  'institution.org',
  'edu.institution.org',
  'admin.institution.org',
  'dept.institution.org',
  'pacific.edu',
  'stanford.edu',
  'mit.edu',
  'berkeley.edu',
  'harvard.edu',
  'ox.ac.uk',
  'cam.ac.uk',
];

export const GENERAL_DOMAIN_PROVIDERS = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'yahoo.com',
  'icloud.com',
];

export interface DomainValidationResult {
  isValid: boolean;
  isEducational: boolean;
  domain: string;
  errorMessage?: string;
}

/**
  * Checks if an email belongs to an educational domain.
  */
export function isEducationalEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.toLowerCase().split('@')[1] || '';
  
  if (EDUCATIONAL_EXPLICIT_DOMAINS.some((d) => domain === d || domain.endsWith('.' + d))) {
    return true;
  }
  
  return EDUCATIONAL_DOMAIN_SUFFIXES.some((suffix) => domain.endsWith(suffix));
}

/**
 * Infer user role automatically based on email ID and domain patterns.
 */
export function inferRoleFromEmail(email: string): RoleType {
  if (!email || !email.includes('@')) return 'user';
  const eLower = email.toLowerCase().trim();
  const [localPart, domain = ''] = eLower.split('@');

  // Explicit institution admin match
  if (
    eLower.includes('admin.institution.org') ||
    eLower.includes('ssterling') ||
    localPart.includes('institution')
  ) {
    return 'institution';
  }

  // Department moderator / teacher match
  if (
    eLower.includes('dept.institution.org') ||
    eLower.includes('athorne') ||
    localPart.includes('dept') ||
    localPart.includes('faculty') ||
    localPart.includes('prof') ||
    localPart.includes('teacher')
  ) {
    return 'dept';
  }

  // System admin match
  if (
    eLower.includes('a.okafor') ||
    eLower.includes('verdantiq.io') ||
    localPart.includes('sysadmin') ||
    localPart === 'admin'
  ) {
    return 'admin';
  }

  // MLOps match
  if (eLower.includes('mlops') || localPart.includes('mlops')) {
    return 'mlops';
  }

  // Auditor match
  if (eLower.includes('audit') || localPart.includes('audit')) {
    return 'audit';
  }

  // Regional Governance Board match
  if (
    eLower.includes('tn.gov.in') ||
    eLower.includes('sundaram') ||
    localPart.includes('region') ||
    localPart.includes('district')
  ) {
    return 'region';
  }

  // Student match
  if (
    eLower.includes('mchen') ||
    localPart.includes('student') ||
    localPart.includes('s20') ||
    localPart.includes('s24') ||
    domain.startsWith('edu.') ||
    domain.endsWith('.edu') ||
    domain.endsWith('.ac.uk') ||
    domain.endsWith('.edu.in') ||
    domain.includes('institution.org')
  ) {
    return 'student';
  }

  // Default standard household user
  return 'user';
}

/**
  * Validates email domain restrictions based on user role requirements.
  * - Student & Institution roles REQUIRE a linked educational domain (.edu, .ac.uk, institution.org, etc.)
  * - Other roles (user, dept, region, admin, mlops, audit) allow Google, Outlook, or official organizational domains.
  */
export function validateRoleDomain(email: string, role: RoleType): DomainValidationResult {
  if (!email || !email.includes('@')) {
    return {
      isValid: false,
      isEducational: false,
      domain: '',
      errorMessage: 'Please enter a valid email address.',
    };
  }

  const domain = email.toLowerCase().split('@')[1] || '';
  const isEducational = isEducationalEmail(email);

  if (role === 'student' || role === 'institution') {
    if (!isEducational) {
      return {
        isValid: false,
        isEducational: false,
        domain,
        errorMessage: `Access Restricted: The ${role === 'student' ? 'Student' : 'Institution Admin'} role requires a verified educational domain account (.edu, .ac.uk, institution.org, etc.).`,
      };
    }
  }

  return {
    isValid: true,
    isEducational,
    domain,
  };
}
