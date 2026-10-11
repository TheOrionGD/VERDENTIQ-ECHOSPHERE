package com.verdantiq.gateway.mlops;

import com.verdantiq.gateway.common.ProxyService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mlops")
@PreAuthorize("hasRole('MLOPS_ADMIN') or hasRole('PLATFORM_ADMIN')")
public class MlopsController {

    @Autowired
    private ProxyService proxyService;

    @GetMapping("/models")
    public ResponseEntity<String> getModels(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/models");
    }

    @GetMapping("/llm-gateway/routing-rules")
    @PreAuthorize("hasRole('MLOPS_ADMIN') or hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<String> getRoutingRules(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/llm-gateway/routing-rules");
    }

    @GetMapping("/milp-weights")
    public ResponseEntity<String> getMilpWeights(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/milp-weights");
    }

    @PutMapping("/milp-weights")
    public ResponseEntity<String> putMilpWeights(@RequestBody String body, HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.PUT, body, "/api/v1/mlops/milp-weights");
    }

    @GetMapping("/alert-rules")
    public ResponseEntity<String> getAlertRules(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/alert-rules");
    }

    @GetMapping("/fastapi-config")
    public ResponseEntity<String> getFastApiConfig(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/fastapi-config");
    }

    @PutMapping("/fastapi-config")
    public ResponseEntity<String> putFastApiConfig(@RequestBody String body, HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.PUT, body, "/api/v1/mlops/fastapi-config");
    }

    @GetMapping("/retrain-schedule")
    public ResponseEntity<String> getRetrainSchedule(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/retrain-schedule");
    }

    @PutMapping("/retrain-schedule")
    public ResponseEntity<String> putRetrainSchedule(@RequestBody String body, HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.PUT, body, "/api/v1/mlops/retrain-schedule");
    }

    @GetMapping("/labeled-batches")
    public ResponseEntity<String> getLabeledBatches(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/labeled-batches");
    }

    @GetMapping("/canary-deployments")
    public ResponseEntity<String> getCanaryDeployments(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/canary-deployments");
    }

    @GetMapping("/pipeline-nodes")
    public ResponseEntity<String> getPipelineNodes(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/pipeline-nodes");
    }

    @GetMapping("/experiments")
    public ResponseEntity<String> getExperiments(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/experiments");
    }

    @GetMapping("/registry-diff")
    public ResponseEntity<String> getRegistryDiff(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/registry-diff");
    }

    @GetMapping("/llm-gateway/config")
    public ResponseEntity<String> getLlmGatewayConfig(HttpServletRequest request) {
        return proxyService.proxyRequest(request, HttpMethod.GET, null, "/api/v1/mlops/llm-gateway/config");
    }
}
