import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb } from '@/lib/mongodb';

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  email: string;
  department: string;
  subCohort: string;
  year: number; // 2025 | 2026
  month?: string; // 'Jan', 'Feb', 'Mar', ... 'Dec'
  ecoPoints: number;
  co2OffsetKg: number;
  verifiedActionsCount: number;
  streakDays: number;
  primarySDG: { number: number; name: string; icon: string };
  certificateEligible: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : 2026;
    const month = searchParams.get('month') || 'ALL';
    const department = searchParams.get('department') || 'ALL';

    let data: LeaderboardEntry[] = [];

    // Query live MongoDB collection if connected
    const db = await getMongoDb();
    if (db) {
      const col = db.collection('student_ecopoints_leaderboard');
      const query: any = {};
      if (year) query.year = year;
      if (month && month !== 'ALL') query.month = month;
      if (department && department !== 'ALL') query.department = department;

      const dbRecords = await col.find(query).sort({ ecoPoints: -1 }).toArray();
      if (dbRecords.length > 0) {
        data = dbRecords.map((r, idx) => ({
          rank: idx + 1,
          studentId: r.studentId,
          name: r.name,
          email: r.email,
          department: r.department,
          subCohort: r.subCohort,
          year: r.year,
          month: r.month,
          ecoPoints: r.ecoPoints,
          co2OffsetKg: r.co2OffsetKg,
          verifiedActionsCount: r.verifiedActionsCount,
          streakDays: r.streakDays,
          primarySDG: r.primarySDG,
          certificateEligible: r.certificateEligible !== false,
        }));
      }
    }

    // Sort descending by ecoPoints and recalculate ranks
    data.sort((a, b) => b.ecoPoints - a.ecoPoints);
    const rankedData = data.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    return NextResponse.json({
      success: true,
      filters: { year, month, department },
      totalCount: rankedData.length,
      leaderboard: rankedData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
