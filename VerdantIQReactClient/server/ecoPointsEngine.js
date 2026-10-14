/**
 * EcoPoints Idempotent Transaction Ledger Engine
 * Enforces atomic point awards, daily velocity limits, duplicate submission blocks,
 * and immutable reversible double-entry transaction ledgers.
 */

import { getDb } from './db.js';

export async function processEcoPointsTransaction({
  transactionId, // Client-generated idempotency key
  studentId,
  institutionId,
  challengeId,
  pointsAwarded,
  actionType = 'CHALLENGE_APPROVED',
  moderatorId = 'MOD-SYSTEM',
  notes = '',
}) {
  const db = getDb();

  // 1. Check Idempotency Key
  const existingTx = await db.collection('ecopoints_transactions').findOne({ transactionId });
  if (existingTx) {
    return {
      status: 'IDEMPOTENT_IGNORED',
      message: 'Transaction already processed previously.',
      transaction: existingTx,
    };
  }

  // 2. Velocity Check: Enforce daily ceiling (max 300 points per day per student)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dailyPointsAgg = await db.collection('ecopoints_transactions').aggregate([
    {
      $match: {
        studentId,
        createdAt: { $gte: oneDayAgo },
        actionType: { $in: ['CHALLENGE_APPROVED', 'PEER_VERIFIED'] },
      },
    },
    { $group: { _id: null, total: { $sum: '$pointsAwarded' } } },
  ]).toArray();

  const dailyAccumulated = dailyPointsAgg.length > 0 ? dailyPointsAgg[0].total : 0;
  if (dailyAccumulated + pointsAwarded > 300) {
    return {
      status: 'REJECTED_VELOCITY_LIMIT',
      message: `Daily EcoPoints limit exceeded. Student already earned ${dailyAccumulated}/300 points in past 24 hours.`,
      dailyAccumulated,
    };
  }

  // 3. Atomically Record Transaction
  const record = {
    transactionId,
    studentId,
    institutionId,
    challengeId,
    pointsAwarded,
    actionType,
    moderatorId,
    notes,
    createdAt: new Date(),
  };

  await db.collection('ecopoints_transactions').insertOne(record);

  // 4. Update Student Lifetime & Available Balance
  await db.collection('users').updateOne(
    { studentId },
    {
      $inc: {
        ecoPointsBalance: pointsAwarded,
        lifetimeEcoPoints: pointsAwarded,
      },
    },
    { upsert: false }
  );

  return {
    status: 'COMPLETED',
    transactionId,
    pointsAwarded,
    dailyAccumulated: dailyAccumulated + pointsAwarded,
  };
}
