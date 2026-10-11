import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

// Memory cache fallback store if MongoDB URI is not provided
let memoryInstitutionsStore: any[] = [
  {
    id: 'inst-01',
    name: 'Pacific State University System',
    code: 'PSU',
    domain: 'institution.org',
    domainDNS: 'institution.org',
    regionDistrict: 'District 1 (Bay Area North)',
    studentCount: 24500,
    deptCount: 18,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inst-02',
    name: 'Pacific State University',
    code: 'PSU-EDU',
    domain: 'pacific.edu',
    domainDNS: 'pacific.edu',
    regionDistrict: 'District 1 (Bay Area North)',
    studentCount: 18200,
    deptCount: 14,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inst-03',
    name: 'Stanford University',
    code: 'STANFORD',
    domain: 'stanford.edu',
    domainDNS: 'stanford.edu',
    regionDistrict: 'District 2 (Silicon Corridor)',
    studentCount: 17000,
    deptCount: 20,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inst-04',
    name: 'Massachusetts Institute of Technology',
    code: 'MIT',
    domain: 'mit.edu',
    domainDNS: 'mit.edu',
    regionDistrict: 'District 3 (Northwest Coastal)',
    studentCount: 11800,
    deptCount: 16,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inst-05',
    name: 'UC Berkeley',
    code: 'UCB',
    domain: 'berkeley.edu',
    domainDNS: 'berkeley.edu',
    regionDistrict: 'District 1 (Bay Area North)',
    studentCount: 45000,
    deptCount: 25,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inst-06',
    name: 'Harvard University',
    code: 'HARVARD',
    domain: 'harvard.edu',
    domainDNS: 'harvard.edu',
    regionDistrict: 'District 3 (Northwest Coastal)',
    studentCount: 23000,
    deptCount: 22,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    const db = await getMongoDb();
    if (db) {
      const col = db.collection('institutions');
      let institutions = await col.find({}).toArray();

      if (institutions.length === 0) {
        // Seed if empty
        await col.insertMany(memoryInstitutionsStore);
        institutions = await col.find({}).toArray();
      }

      if (domain) {
        const dLower = domain.toLowerCase();
        const matched = institutions.filter(inst => {
          const instDomain = (inst.domainDNS || inst.domain || '').toLowerCase();
          return dLower === instDomain || dLower.endsWith('.' + instDomain) || instDomain.endsWith('.' + dLower);
        });
        return NextResponse.json({ success: true, count: matched.length, institutions: matched });
      }

      return NextResponse.json({ success: true, count: institutions.length, institutions });
    }

    // Fallback store
    if (domain) {
      const dLower = domain.toLowerCase();
      const matched = memoryInstitutionsStore.filter(inst => {
        const instDomain = (inst.domainDNS || inst.domain || '').toLowerCase();
        return dLower === instDomain || dLower.endsWith('.' + instDomain) || instDomain.endsWith('.' + dLower);
      });
      return NextResponse.json({ success: true, count: matched.length, institutions: matched, source: 'memory' });
    }

    return NextResponse.json({ success: true, count: memoryInstitutionsStore.length, institutions: memoryInstitutionsStore, source: 'memory' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error querying institutions database' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, code, domain, domainDNS, regionDistrict, studentCount, deptCount } = body;

    if (!name || (!domain && !domainDNS)) {
      return NextResponse.json({ error: 'Institution Name and Domain DNS are required' }, { status: 400 });
    }

    const dnsValue = (domainDNS || domain).toLowerCase().trim();
    const newInst = {
      id: body.id || `inst-${Date.now().toString().substring(7)}`,
      name,
      code: code || name.substring(0, 4).toUpperCase(),
      domain: dnsValue,
      domainDNS: dnsValue,
      regionDistrict: regionDistrict || 'District 1',
      studentCount: Number(studentCount) || 1000,
      deptCount: Number(deptCount) || 5,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getMongoDb();
    if (db) {
      const col = db.collection('institutions');
      await col.updateOne(
        { domainDNS: dnsValue },
        { $set: newInst },
        { upsert: true }
      );
      return NextResponse.json({ success: true, institution: newInst, source: 'mongodb' });
    }

    // Save to memory store
    const existingIdx = memoryInstitutionsStore.findIndex(i => i.domainDNS === dnsValue || i.domain === dnsValue);
    if (existingIdx !== -1) {
      memoryInstitutionsStore[existingIdx] = newInst;
    } else {
      memoryInstitutionsStore.push(newInst);
    }

    return NextResponse.json({ success: true, institution: newInst, source: 'memory' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error saving institution to database' }, { status: 500 });
  }
}
