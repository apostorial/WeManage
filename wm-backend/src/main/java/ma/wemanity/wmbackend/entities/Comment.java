package ma.wemanity.wmbackend.entities;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Comment {
    @Id
    private Long id;
    @NotNull
    private String content;
    private LocalDateTime createdAt;
    @DBRef
    private Card card;
    @DBRef
    private Member author;
}
