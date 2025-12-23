# syntax=docker/dockerfile:1

# -------- Build stage --------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn -q -DskipTests clean package

# -------- Runtime stage --------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Render Docker web services expect the app to listen on port 10000
ENV PORT=10000
EXPOSE 10000
COPY --from=build /app/target/*.jar /app/app.jar
CMD ["sh","-c","java -Dserver.port=${PORT} -jar /app/app.jar"]
