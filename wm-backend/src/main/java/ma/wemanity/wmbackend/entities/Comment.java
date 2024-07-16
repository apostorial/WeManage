package ma.wemanity.wmbackend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Objects;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Comment {
    @Id
    private String id;
    @NotNull
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @DBRef
    private Card card;
    @DBRef
    private Member author;

    @JsonProperty("card")
    public String getCardForSerialization() {
        return card.getId();
    }

    @JsonProperty("author")
    public String getAuthorForSerialization() {
        return author.getId();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Comment comment = (Comment) o;
        return Objects.equals(id, comment.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
