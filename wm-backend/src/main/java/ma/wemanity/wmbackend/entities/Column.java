package ma.wemanity.wmbackend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Column {
    @Id
    private String id;
    @NotNull @Indexed(unique=true)
    private String name;
    private String description;
    @DBRef
    private Board board;
    @DBRef
    private Set<Card> cards = new HashSet<>();

    @JsonProperty("board")
    public String getBoardForSerialization() {
        return id;
    }

    @JsonProperty("cards")
    public List<String> getCardsForSerialization() {
        return cards.stream()
                .map(Card::getId)
                .collect(Collectors.toList());
    }

    public void addCard(Card card) {
        if (!cards.contains(card)) {
            this.cards.add(card);
        }
    }

    public void removeCard(Card card) {
        if (cards.contains(card)) {
            this.cards.remove(card);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Column column = (Column) o;
        return Objects.equals(id, column.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
