package com.verdantiq.gateway.common;

import java.util.List;
import java.util.Map;

public final class MlPayloadFactory {

    private MlPayloadFactory() {
    }

    public static List<Map<String, Object>> defaultCandidates() {
        return List.of(
                candidate("shift-usage", "Shift flexible usage", "energy", "Move flexible usage to lower-demand periods.", -1.5, -0.25, 4, 20),
                candidate("reduce-standby", "Reduce standby consumption", "efficiency", "Turn off idle devices and standby loads.", -0.8, -0.15, 5, 12),
                candidate("optimize-thermostat", "Optimize thermostat schedule", "comfort", "Use an efficient schedule while preserving comfort.", -2.0, -0.40, 3, 25)
        );
    }

    public static Map<String, Object> candidatePayload(int maxActions) {
        return Map.of(
                "weights", Map.of("cost", 1.0, "carbon", 1.0, "comfort", 1.0),
                "max_actions", maxActions,
                "candidates", defaultCandidates()
        );
    }

    public static Map<String, Object> institutionCandidatePayload(int maxActionsPerHousehold) {
        return Map.of(
                "weights", Map.of("cost", 1.0, "carbon", 1.0, "comfort", 1.0),
                "max_actions_per_household", maxActionsPerHousehold,
                "households", Map.of("institution", defaultCandidates())
        );
    }

    private static Map<String, Object> candidate(
            String id,
            String title,
            String category,
            String description,
            double carbonDelta,
            double costDelta,
            int easeScore,
            int ecoPoints
    ) {
        return Map.of(
                "id", id,
                "title", title,
                "category", category,
                "description", description,
                "base_carbon_delta", carbonDelta,
                "base_cost_delta", costDelta,
                "base_ease_score", easeScore,
                "base_eco_points", ecoPoints
        );
    }
}