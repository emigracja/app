package com.example.backend.domain.service;

import com.example.backend.domain.dto.StockDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class StockServiceImpl implements StockService {

    @Override
    public List<StockDto> getAllStocks() {
        List<StockDto> list = new ArrayList<>();
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "CD PROJEKT",
                "CD PROJEKT RED SA",
                "CD PROJEKT to wiodący producent gier komputerowych, odpowiedzialny za takie tytuły jak Wiedźmin oraz Cyberpunk 2077.",
                "produkcja gier komputerowych",
                "Warszawa",
                "PL"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "KGHM",
                "KGHM Polska Miedź SA",
                "KGHM to jeden z największych producentów miedzi na świecie, który prowadzi również działalność w zakresie wydobycia srebra.",
                "wydobycie miedzi i innych metali szlachetnych",
                "Lubin",
                "PL"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "PKN ORLEN",
                "PKN ORLEN SA",
                "PKN ORLEN to jedna z największych firm petrochemicznych w Europie Środkowo-Wschodniej, działająca w sektorze paliwowym, chemicznym i energetycznym.",
                "produkcja i sprzedaż paliw oraz produktów petrochemicznych",
                "Płock",
                "PL"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "Google",
                "Alphabet Inc.",
                "Google to amerykańska firma technologiczna, właściciel jednej z największych wyszukiwarek internetowych, oferująca także usługi chmurowe, reklamy, hardware i software.",
                "technologia i usługi internetowe",
                "Mountain View, USA",
                "US"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "Apple",
                "Apple Inc.",
                "Apple to amerykańska firma technologiczna, znana z produkcji elektroniki użytkowej, oprogramowania oraz usług cyfrowych.",
                "produkcja elektroniki i oprogramowania",
                "Cupertino, USA",
                "US"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "Facebook",
                "Meta Platforms, Inc.",
                "Facebook, obecnie Meta, to amerykańska firma technologiczna, specjalizująca się w usługach społecznościowych, reklamie internetowej oraz rozwijaniu technologii wirtualnej rzeczywistości.",
                "usługi społecznościowe i reklama internetowa",
                "Menlo Park, USA",
                "US"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "Cameco",
                "Cameco Corporation",
                "Cameco to kanadyjska firma zajmująca się wydobyciem i produkcją uranu, dostarczająca surowiec do elektrowni jądrowych na całym świecie.",
                "wydobycie uranu",
                "Saskatoon, Kanada",
                "CA"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "Rio Tinto",
                "Rio Tinto Group",
                "Rio Tinto to międzynarodowa firma zajmująca się wydobyciem i obróbką minerałów, specjalizująca się w produkcji metali i minerałów przemysłowych.",
                "wydobycie minerałów i metali",
                "Londyn, Wielka Brytania",
                "GB"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "Veeva",
                "Veeva Systems Inc.",
                "Veeva Systems to amerykańska firma oferująca oprogramowanie chmurowe i rozwiązania IT dla branży farmaceutycznej i biotechnologicznej.",
                "oprogramowanie chmurowe dla branży farmaceutycznej",
                "Pleasanton, USA",
                "US"
        ));
        list.add(new StockDto(
                UUID.randomUUID().toString(),
                "JSW",
                "Jastrzębska Spółka Węglowa SA",
                "Grupa JSW jest największym producentem wysokiej jakości węgla koksowego typu hard w Unii Europejskiej [...]",
                "wydobywanie węgla kamiennego",
                "Jastrzębie-Zdrój",
                "PL"
        ));
        return list;
    }

}
