package com.example.backend.domain.service.external.rss_fetcher.fetcher.polsat;

import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.ToString;
import org.jsoup.Jsoup;

import java.util.List;

@Getter
@XmlRootElement(name = "rss")
@XmlAccessorType(XmlAccessType.FIELD)
@ToString
public class PolastNewsRssObject {

    @XmlElement(name = "channel")
    private Channel channel;

    @Getter
    @XmlAccessorType(XmlAccessType.FIELD)
    @ToString
    public static class Channel {
        @XmlElement(name = "title")
        private String title;

        @XmlElement(name = "link")
        private String link;

        @XmlElement(name = "description")
        private String description;

        @XmlElement(name = "item")
        private List<Item> items;
    }

    @Getter
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class Item {
        @XmlElement(name = "title")
        private String title;

        @XmlElement(name = "link")
        private String link;

        @XmlElement(name = "description")
        private String description;

        @XmlElement(name = "pubDate")
        private String pubDate;

        @XmlElement(name = "enclosure")
        private Enclosure enclosure;

        @Getter
        @XmlAccessorType(XmlAccessType.FIELD)
        public static class Enclosure {
            @XmlAttribute(name = "url")
            private String url;
        }

        public String getParsedDescription() {
            if (description == null || description.isEmpty()) {
                return "";
            }
            return Jsoup.parse(description).text();
        }
    }
}
