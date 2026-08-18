package com.verdantiq.gateway.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "Households")
public class DigitalTwinHouse {
    @Id
    private String id;
    private String version;
    private Instant timestamp;
    private String note;
    private Integer houseSizeSqFt;
    private Integer occupants;
    private String homeType;
    private List<String> appliances;
    private Double solarCapacityKw;
    private Double batteryCapacityKwh;
    private Boolean evCharger;
    private Boolean heatPump;
    private Double estAnnualEmissionsKg;
    private Double estMonthlySavingsUSD;

    public DigitalTwinHouse() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public Integer getHouseSizeSqFt() { return houseSizeSqFt; }
    public void setHouseSizeSqFt(Integer houseSizeSqFt) { this.houseSizeSqFt = houseSizeSqFt; }
    public Integer getOccupants() { return occupants; }
    public void setOccupants(Integer occupants) { this.occupants = occupants; }
    public String getHomeType() { return homeType; }
    public void setHomeType(String homeType) { this.homeType = homeType; }
    public List<String> getAppliances() { return appliances; }
    public void setAppliances(List<String> appliances) { this.appliances = appliances; }
    public Double getSolarCapacityKw() { return solarCapacityKw; }
    public void setSolarCapacityKw(Double solarCapacityKw) { this.solarCapacityKw = solarCapacityKw; }
    public Double getBatteryCapacityKwh() { return batteryCapacityKwh; }
    public void setBatteryCapacityKwh(Double batteryCapacityKwh) { this.batteryCapacityKwh = batteryCapacityKwh; }
    public Boolean getEvCharger() { return evCharger; }
    public void setEvCharger(Boolean evCharger) { this.evCharger = evCharger; }
    public Boolean getHeatPump() { return heatPump; }
    public void setHeatPump(Boolean heatPump) { this.heatPump = heatPump; }
    public Double getEstAnnualEmissionsKg() { return estAnnualEmissionsKg; }
    public void setEstAnnualEmissionsKg(Double estAnnualEmissionsKg) { this.estAnnualEmissionsKg = estAnnualEmissionsKg; }
    public Double getEstMonthlySavingsUSD() { return estMonthlySavingsUSD; }
    public void setEstMonthlySavingsUSD(Double estMonthlySavingsUSD) { this.estMonthlySavingsUSD = estMonthlySavingsUSD; }
}
