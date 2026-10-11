import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      requestingRole = 'user',
      requestingTenantId = 'tenant_default',
      targetTenantId = 'tenant_default',
      isRawPersonalDataRequested = false,
      claims = {},
    } = body;

    const isPlatformAdmin = requestingRole === 'admin' || Boolean(claims?.isPlatformAuthority);
    const isSameTenant = requestingTenantId === targetTenantId;
    const isElevatedRole = ['admin', 'mlops', 'audit', 'region'].includes(requestingRole);

    let allowed = false;
    let reason = '';

    if (isSameTenant) {
      allowed = true;
      reason = 'Intra-tenant telemetry access granted';
    } else if (isPlatformAdmin) {
      allowed = true;
      reason = 'Tier-1 Platform Administration cross-tenant scope granted';
    } else if (isElevatedRole && !isRawPersonalDataRequested) {
      allowed = true;
      reason = 'Aggregated cross-tenant compliance telemetry scope granted';
    } else {
      allowed = false;
      reason = `Role '${requestingRole}' cannot access isolated data for tenant '${targetTenantId}'`;
    }

    const customClaimsCheck = {
      allowed,
      reason,
      requestingRole,
      requestingTenantId,
      targetTenantId,
    };

    const mongoQueryCheck = {
      allowed,
      reason,
      mongoQueryProjection: isSameTenant || isPlatformAdmin ? {} : { pii: 0, personalEmail: 0 },
      mongoAggregationFilter: { tenantId: targetTenantId },
    };

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Explicit Tenant Privacy Denial',
          code: '403_TENANT_PRIVACY_EXCLUSION',
          message: reason,
          customClaimsCheck,
          mongoQueryCheck,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      customClaimsCheck,
      mongoQueryCheck,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
