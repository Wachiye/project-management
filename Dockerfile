# Build stage for the Java application
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml /app/
COPY src /app/src/
# Install dependencies and build the application
RUN mvn install package -DskipTests

# Final stage for the application
FROM openjdk:17
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose the port on which the application will run
EXPOSE 8000

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
