package com.example.backend.domain.service.external.rss_fetcher;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Unmarshaller;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Slf4j
public abstract class RssFetcher<T> {

    protected T fetchRss(String urlString, Class<T> clazz) {
        try {
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(urlString))
                    .GET()
                    .build();

            HttpResponse<InputStream> response = client.send(request, HttpResponse.BodyHandlers.ofInputStream());

            if (response.statusCode() != 200) {
                log.error("Failed to fetch RSS: {}", urlString);
                return null;
            }

            InputStream inputStream = response.body();
            JAXBContext jaxbContext = JAXBContext.newInstance(clazz);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            T result = (T) unmarshaller.unmarshal(inputStream);

            inputStream.close();

            return result;
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return null;
        }
    }
}
