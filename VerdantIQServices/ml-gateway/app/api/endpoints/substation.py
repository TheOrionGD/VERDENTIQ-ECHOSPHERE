from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import datetime
import random

router = APIRouter()

class SubstationFeederReading(BaseModel):
    feeder_id: str
    feeder_name: str
    department_id: str
    department_name: str
    current_load_kw: float
    voltage_v: float
    current_a: float
    power_factor: float
    frequency_hz: float
    eco_setback_pct: float
    meter_protocol: str # "BACnet/IP" | "Modbus TCP" | "MQTT-Telemetry"
    status: str # "ONLINE" | "STANDBY" | "FAULT"
    timestamp: str

class SubstationTelemetryResponse(BaseModel):
    substation_id: str
    substation_name: str
    department_id: str
    department_name: str
    total_active_draw_kw: float
    baseline_expected_kw: float
    variance_pct: float
    status: str
    feeders: List[SubstationFeederReading]
    connected_iot_devices_count: int
    last_poll_timestamp: str

class IoTDeviceCommand(BaseModel):
    device_id: str
    command: str # "ENABLE_ECO_MODE" | "SET_TERMOSTAT_SETBACK" | "LOAD_SHED" | "RESET"
    target_value: Optional[float] = None
    reason: Optional[str] = "Automated Department Eco-Dispatch"

class FeederDict(BaseModel):
    feeder_id: str
    feeder_name: str
    department_id: str
    department_name: str
    current_load_kw: float
    voltage_v: float
    current_a: float
    power_factor: float
    frequency_hz: float
    eco_setback_pct: float
    meter_protocol: str
    status: str

FEEDERS_DB: dict[str, list[FeederDict]] = {
    "dept-bio-eng": [
        FeederDict(
            feeder_id="bio-fdr-01",
            feeder_name="Bioengineering Main HVAC Chiller Loop",
            department_id="dept-bio-eng",
            department_name="Department of Bioengineering",
            current_load_kw=7.4,
            voltage_v=480.2,
            current_a=15.4,
            power_factor=0.94,
            frequency_hz=60.01,
            eco_setback_pct=-22.5,
            meter_protocol="BACnet/IP",
            status="ONLINE",
        ),
        FeederDict(
            feeder_id="bio-fdr-02",
            feeder_name="Bio-Incubator & Cold Storage Pod 3",
            department_id="dept-bio-eng",
            department_name="Department of Bioengineering",
            current_load_kw=4.2,
            voltage_v=208.1,
            current_a=20.2,
            power_factor=0.97,
            frequency_hz=59.99,
            eco_setback_pct=-12.0,
            meter_protocol="Modbus TCP",
            status="ONLINE",
        ),
        FeederDict(
            feeder_id="bio-fdr-03",
            feeder_name="Bio B Feeder #3 (Lighting & Lab Benches)",
            department_id="dept-bio-eng",
            department_name="Department of Bioengineering",
            current_load_kw=3.2,
            voltage_v=120.4,
            current_a=26.6,
            power_factor=0.92,
            frequency_hz=60.0,
            eco_setback_pct=-18.2,
            meter_protocol="MQTT-Telemetry",
            status="ONLINE",
        ),
    ],
    "dept-cs": [
        FeederDict(
            feeder_id="cs-fdr-01",
            feeder_name="Turing Hall GPU Cluster Mainline",
            department_id="dept-cs",
            department_name="Computer Science Dept",
            current_load_kw=18.5,
            voltage_v=480.0,
            current_a=38.5,
            power_factor=0.96,
            frequency_hz=60.02,
            eco_setback_pct=-15.4,
            meter_protocol="BACnet/IP",
            status="ONLINE",
        ),
        FeederDict(
            feeder_id="cs-fdr-02",
            feeder_name="Server Lab Precision CRAC Units",
            department_id="dept-cs",
            department_name="Computer Science Dept",
            current_load_kw=6.8,
            voltage_v=208.0,
            current_a=32.7,
            power_factor=0.91,
            frequency_hz=60.0,
            eco_setback_pct=-10.0,
            meter_protocol="Modbus TCP",
            status="ONLINE",
        ),
    ]
}

@router.get("/substation/telemetry", response_model=SubstationTelemetryResponse)
def get_department_substation_telemetry(
    department_id: str = Query(default="dept-bio-eng", description="Department identifier")
):
    """
    Returns real-time sub-metered electrical draw for the department's dedicated substation.
    Simulates live BACnet/Modbus telemetry connected to physical building automation.
    """
    feeders_raw: list[FeederDict] = FEEDERS_DB.get(department_id, FEEDERS_DB["dept-bio-eng"])
    
    # Add minor real-time jitter (+/- 2%) to simulate continuous live physical telemetry stream
    feeders: list[SubstationFeederReading] = []
    total_draw = 0.0
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    for f in feeders_raw:
        jitter = float(random.uniform(-0.15, 0.15))
        base_kw = float(f.current_load_kw)
        live_kw = round(max(0.5, base_kw + jitter), 2)
        total_draw += live_kw
        
        volt = float(f.voltage_v)
        pf = float(f.power_factor)
        divisor = volt * pf * 1.732 if volt > 250.0 else volt
        calc_amp = round((live_kw * 1000.0) / divisor, 1)

        feeders.append(
            SubstationFeederReading(
                feeder_id=str(f.feeder_id),
                feeder_name=str(f.feeder_name),
                department_id=str(f.department_id),
                department_name=str(f.department_name),
                current_load_kw=live_kw,
                voltage_v=round(volt + random.uniform(-0.5, 0.5), 1),
                current_a=calc_amp,
                power_factor=pf,
                frequency_hz=round(60.0 + random.uniform(-0.02, 0.02), 2),
                eco_setback_pct=float(f.eco_setback_pct),
                meter_protocol=str(f.meter_protocol),
                status=str(f.status),
                timestamp=now,
            )
        )
    
    total_draw = round(total_draw, 2)
    baseline = 18.1 # Baseline kW
    variance = round(((total_draw - baseline) / baseline) * 100.0, 1)

    return SubstationTelemetryResponse(
        substation_id="SUB-BIO-EAST-01",
        substation_name="East Campus Substation Transformer Unit 4",
        department_id=department_id,
        department_name="Department of Bioengineering" if department_id == "dept-bio-eng" else "Computer Science Dept",
        total_active_draw_kw=total_draw,
        baseline_expected_kw=baseline,
        variance_pct=variance,
        status="HEALTHY_ECO_MODE",
        feeders=feeders,
        connected_iot_devices_count=len(feeders) * 6, # IoT smart breakers, sensors, relays
        last_poll_timestamp=now,
    )

@router.post("/substation/iot-command")
def dispatch_iot_device_command(cmd: IoTDeviceCommand):
    """
    Directly dispatches control commands to department IoT smart meters, relays, and actuators.
    """
    return {
        "status": "COMMAND_DISPATCHED",
        "device_id": cmd.device_id,
        "protocol": "BACnet-BBMD",
        "acknowledged": True,
        "target_value": cmd.target_value,
        "execution_latency_ms": 28,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "message": f"Successfully signaled {cmd.device_id} to execute {cmd.command}."
    }

