import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role = 'user', name, password } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const accountDomain = emailLower.split('@')[1];
    const isInstitutionalRole = role === 'institution' || role === 'student' || role === 'dept';

    const db = await getMongoDb();
    let matchedInstitution: any = null;

    // 1. Query registered institutions from database to verify Institutional Domain DNS match
    if (db) {
      const instCol = db.collection('institutions');
      const allInstitutions = await instCol.find({}).toArray();

      matchedInstitution = allInstitutions.find((inst: any) => {
        const instDns = (inst.domainDNS || inst.domain || '').toLowerCase().trim();
        if (!instDns) return false;
        return (
          accountDomain === instDns ||
          accountDomain.endsWith('.' + instDns) ||
          instDns.endsWith('.' + accountDomain)
        );
      });
    } else {
      // Memory fallback lookup
      const defaultDnsList = [
        { name: 'Pacific State University System', dns: 'institution.org', id: 'inst-01' },
        { name: 'Pacific State University', dns: 'pacific.edu', id: 'inst-02' },
        { name: 'Stanford University', dns: 'stanford.edu', id: 'inst-03' },
        { name: 'MIT', dns: 'mit.edu', id: 'inst-04' },
        { name: 'UC Berkeley', dns: 'berkeley.edu', id: 'inst-05' },
        { name: 'Harvard University', dns: 'harvard.edu', id: 'inst-06' },
      ];
      matchedInstitution = defaultDnsList.find(inst =>
        accountDomain === inst.dns || accountDomain.endsWith('.' + inst.dns) || inst.dns.endsWith('.' + accountDomain)
      );
    }

    // 2. Enforce Institutional Domain DNS Matching rule
    if (isInstitutionalRole) {
      if (!matchedInstitution) {
        return NextResponse.json(
          {
            error: `Institutional Domain Mismatch: The domain '@${accountDomain}' is not registered under any institution's domain DNS in the database. Please check your institutional email or register the institution DNS first.`,
            accountDomain,
            domainCheckFailed: true,
          },
          { status: 400 }
        );
      }
    }

    // 3. User Database Record
    const userId = `usr_${Math.random().toString(36).substring(2, 9)}`;
    const userProfile = {
      id: userId,
      email: emailLower,
      name: name || emailLower.split('@')[0],
      role,
      tenantId: matchedInstitution ? `tenant_${matchedInstitution.id}` : 'tenant_verdantiq_core',
      institution: matchedInstitution ? matchedInstitution.name : undefined,
      institutionId: matchedInstitution ? matchedInstitution.id : undefined,
      isVerifiedStudent: role === 'student' && Boolean(matchedInstitution),
      isVerified: true,
      updatedAt: new Date().toISOString(),
    };

    if (db) {
      const userCol = db.collection('users');
      await userCol.updateOne(
        { email: emailLower },
        {
          $set: userProfile,
          $setOnInsert: { createdAt: new Date().toISOString() },
        },
        { upsert: true }
      );

      const dbUser = await userCol.findOne({ email: emailLower });
      return NextResponse.json({
        success: true,
        user: dbUser,
        matchedInstitution: matchedInstitution ? matchedInstitution.name : null,
      });
    }

    return NextResponse.json({
      success: true,
      user: { ...userProfile, createdAt: new Date().toISOString() },
      matchedInstitution: matchedInstitution ? matchedInstitution.name : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login verification error' }, { status: 500 });
  }
}
