package com.verdantiq.gateway.auditor;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataFlowNodeRepository extends MongoRepository<DataFlowNode, String> {
}
