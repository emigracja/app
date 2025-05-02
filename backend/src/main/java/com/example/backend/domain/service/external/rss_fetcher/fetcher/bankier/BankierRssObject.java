package com.example.backend.domain.service.external.rss_fetcher.fetcher.bankier;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.ToString;
import org.jsoup.Jsoup;

import java.util.List;

@Getter
@XmlRootElement(name = "rss")
@XmlAccessorType(XmlAccessType.FIELD)
@ToString
public class BankierRssObject {

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

        public String getBackgroundImage() {
            if (description == null || description.isEmpty()) {
                return "";
            }
            return Jsoup.parse(description).select("img").attr("src");
        }

        public String getParsedDescription() {
            if (description == null || description.isEmpty()) {
                return "";
            }

            return Jsoup.parse(description).text();
        }
    }
}
