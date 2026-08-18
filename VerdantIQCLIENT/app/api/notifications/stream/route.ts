import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Shared set of active SSE client senders in server memory
const clients = new Set<(data: string) => void>();

const STREAM_TEMPLATES = [
  {
    title: 'HVAC Anomaly Detected',
    description: 'Chiller Unit #3 in Life Sciences B exceeded baseline power consumption by 24.8%.',
    severity: 'critical' as const,
    location: 'Life Sciences Building B',
    source: 'ML-Anomaly-Detector-v4',
  },
  {
    title: 'Solar Microgrid Peak Generation',
    description: 'Rooftop Array Alpha generated 142 kW surpassing midday forecast peak.',
    severity: 'success' as const,
    location: 'Engineering Quad',
    source: 'Grid-Telemetry-Feed',
  },
  {
    title: 'Optimal Setpoint Recommendation',
    description: 'AI recommended shifting Zone 4 thermostat +1.5°C during high grid carbon hours.',
    severity: 'info' as const,
    location: 'Administration Wing A',
    source: 'VerdantIQ-Omnibar-Agent',
  },
  {
    title: 'Water Recycling Pressure Alert',
    description: 'Graywater filtration manifold pressure dropped 12 PSI below nominal bounds.',
    severity: 'warning' as const,
    location: 'Central Plant Hydraulics',
    source: 'SCADA-Telemetry-Service',
  },
  {
    title: 'Auditor Verification Signature Logged',
    description: 'Immutable verification proof recorded on carbon registry ledger.',
    severity: 'success' as const,
    location: 'Regional Compliance Office',
    source: 'Audit-Proof-Engine',
  },
  {
    title: 'Model Data Drift Detected',
    description: 'HVAC predictive optimizer reported distribution drift p-value 0.021 on seasonal transition.',
    severity: 'critical' as const,
    location: 'ML Ops Cluster 02',
    source: 'Model-Monitor-Bot',
  },
  {
    title: 'Peak Demand Shaving Active',
    description: 'Battery storage discharging 80 kW to offset campus grid surcharge rate.',
    severity: 'success' as const,
    location: 'Energy Storage Facility 1',
    source: 'BMS-Grid-Controller',
  },
];

function generateAlert() {
  const template = STREAM_TEMPLATES[Math.floor(Math.random() * STREAM_TEMPLATES.length)];
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  return {
    ...template,
    id: `notif-sse-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: `Just now (${timeString})`,
    read: false,
    channel: 'sse-push',
  };
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      const sendEvent = (data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // Stream closed or client disconnected
        }
      };

      // Register client connection
      clients.add(sendEvent);

      // Send initial connection handshake payload
      const handshake = JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString(),
        message: 'Subscribed to live administrative infrastructure alert stream (SSE)',
      });
      sendEvent(handshake);

      // Push periodic live alerts every 10 seconds
      const interval = setInterval(() => {
        const notif = generateAlert();
        sendEvent(JSON.stringify(notif));
      }, 10000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        clients.delete(sendEvent);
        try {
          controller.close();
        } catch {
          // Handle close error silently
        }
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const notification = {
      id: typeof body?.id === 'string' ? body.id : `notif-push-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: typeof body?.title === 'string' && body.title ? body.title : 'Administrative Infrastructure Push Alert',
      description: typeof body?.description === 'string' && body.description ? body.description : 'Live alert broadcasted across all subscriber streams.',
      severity: typeof body?.severity === 'string' ? body.severity : 'warning',
      location: typeof body?.location === 'string' ? body.location : 'Platform Admin Channel',
      source: typeof body?.source === 'string' ? body.source : 'Admin-SSE-Broadcaster',
      timestamp: `Just now (${timeString})`,
      read: false,
      channel: 'sse-push',
      isolationForestScore: typeof body?.isolationForestScore === 'number' ? body.isolationForestScore : 0.88,
    };

    const payload = JSON.stringify(notification);

    // Broadcast to all active clients
    clients.forEach((send) => send(payload));

    return NextResponse.json({
      success: true,
      recipients: clients.size,
      notification,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
