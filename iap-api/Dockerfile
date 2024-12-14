# Production stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/iap-api-1.0.1.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]