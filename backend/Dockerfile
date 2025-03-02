FROM gradle:8.5-jdk21 AS build

WORKDIR /app

COPY ./build.gradle ./settings.gradle ./src ./

COPY . ./

RUN gradle clean

RUN gradle build

FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]

