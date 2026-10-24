import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET /api/audit/requests
 * Authoritative endpoint for IRB compliance and research data access requests.
 * Reads directly from the `auditrequests` collection in MongoDB.
 */
export async function GET(req: NextRequest) {
  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable. MongoDB connection failed.' },
        { status: 503 }
      );
    }

    const col = db.collection('auditrequests');
    const requests = await col.find({}).sort({ requestedAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length,
      retrievedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve audit requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/audit/requests
 * Submit a genuine Institutional Review Board (IRB) research access petition.
 * Persists immediately to MongoDB with schema validation.
 */
export async function POST(req: NextRequest) {
  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable. MongoDB connection failed.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { title, targetDepartment, scopeStandard, auditorEmail, tenantId } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Request title or research description is mandatory.' },
        { status: 400 }
      );
    }

    if (!scopeStandard || typeof scopeStandard !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Compliance standard / scope standard (e.g. ISO 50001, GRI 302) is mandatory.' },
        { status: 400 }
      );
    }

    const newRequest = {
      id: `aud-req-${Date.now().toString().slice(-6)}`,
      tenantId: tenantId || 'tenant_institution_org',
      targetDepartment: targetDepartment || 'Environmental Science & Research',
      scopeStandard: scopeStandard.trim(),
      title: title.trim(),
      status: 'IN_REVIEW',
      auditorEmail: auditorEmail || 'auditor@esg-verify.org',
      requestedAt: new Date().toISOString(),
      resolvedAt: null,
    };

    const col = db.collection('auditrequests');
    const result = await col.insertOne(newRequest);

    return NextResponse.json(
      {
        success: true,
        data: newRequest,
        insertedId: result.insertedId,
        message: 'IRB Protocol Access Request successfully registered and persisted.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to persist audit request' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/audit/requests
 * Update request status (e.g., COMPLETED, REJECTED, IN_REVIEW).
 */
export async function PATCH(req: NextRequest) {
  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database service unavailable. MongoDB connection failed.' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Both request id and target status are required.' },
        { status: 400 }
      );
    }

    const col = db.collection('auditrequests');
    const updatePayload: Record<string, any> = { status };
    if (status === 'COMPLETED' || status === 'REJECTED') {
      updatePayload.resolvedAt = new Date().toISOString();
    }

    const result = await col.updateOne({ id }, { $set: updatePayload });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: `Audit request with id '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Audit request ${id} updated to status ${status}.`,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update audit request' },
      { status: 500 }
    );
  }
}
