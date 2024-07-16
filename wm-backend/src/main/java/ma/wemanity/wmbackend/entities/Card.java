package ma.wemanity.wmbackend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Card {
    @Id
    private String id;
    @NotNull
    private String name;
    private String company;
    private String position;
    private String email;
    private String number;
    private String website;
    @DBRef
    private Set<Comment> comments = new HashSet<>();
    @DBRef
    private Column column;
    @DBRef
    private Set<Label> labels = new HashSet<>();

    @JsonProperty("comments")
    public List<String> getCommentsForSerialization() {
        return comments.stream()
                .map(Comment::getId)
                .collect(Collectors.toList());
    }

    @JsonProperty("column")
    public String getColumnForSerialization() {
        return column.getId();
    }

    @JsonProperty("labels")
    public List<String> getLabelsForSerialization() {
        return labels.stream()
                .map(Label::getId)
                .collect(Collectors.toList());
    }

    public void addComment(Comment comment) {
        if (!comments.contains(comment)) {
            this.comments.add(comment);
        }
    }

    public void removeLabel(Label label) {
        if (labels.contains(label)) {
            this.labels.remove(label);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Card card = (Card) o;
        return Objects.equals(id, card.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
