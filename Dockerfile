# Build stage for the Java application
FROM maven:3.9.5-eclipse-temurin-17 AS build
WORKDIR /app
ENV APAMS_DB_URL=jdbc:mysql//localhost:3306/apamsdb
ENV APAMS_DB_USERNAME=4Root@123
ENV APAMS_DB_PASSWORD=4Apamsdb@123
ENV APAMS_JWT_SECRET=MySecureSecrete
COPY pom.xml /app/
COPY src /app/src/
# Install dependencies and build the application
RUN mvn install package -DskipTests

# Stage 3: MySQL image
FROM mysql:latest AS mysql
# Set MySQL root password (change it to a secure password)
ENV MYSQL_ROOT_PASSWORD=4Root@123
# Create a database for your application
ENV MYSQL_DATABASE=apamsdb
# Set MySQL user and password for the application
ENV MYSQL_USER=apamsdb
ENV MYSQL_PASSWORD=4Apamsdb@123

# Final stage for the application
FROM openjdk:17
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose the port on which the application will run
EXPOSE 8000

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
