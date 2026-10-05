# Multi-stage Docker build for Spring Boot 17 Microservice
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/gateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -Dserver.port=${PORT:-8080} -jar app.jar"]
