# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim


COPY pom.xml .
# Set working directory
WORKDIR /app




# Copy the JAR file
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar



# Expose the port your application runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 