package com.verdantiq.gateway.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Enumeration;

@Service
public class ProxyService {

    @Value("${verdantiq.ml-service-url}")
    private String mlServiceUrl;

    @Value("${verdantiq.internal-service-key}")
    private String internalServiceKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> proxyRequest(HttpServletRequest request, HttpMethod method, Object body, String path) {
        String url = mlServiceUrl + path;
        
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.equalsIgnoreCase("Host")) {
                headers.add(headerName, request.getHeader(headerName));
            }
        }
        
        // Attach the internal service key required by FastAPI
        headers.add("X-Internal-Service-Key", internalServiceKey);

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        
        try {
            return restTemplate.exchange(url, method, entity, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(503).body("{\"error\": \"ML Service is unreachable.\"}");
        }
    }
}
