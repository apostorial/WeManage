package ma.wemanity.wmbackend.entities;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.wemanity.wmbackend.config.BoardSerializer;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Document @Data @NoArgsConstructor @AllArgsConstructor @JsonSerialize(using = BoardSerializer.class)
public class Board {
    @Id
    private String id;
    @NotNull
    private String name;
    private String description;
    @DBRef
    private Set<Column> columns = new HashSet<>();
    @DBRef
    private Member owner;
    @DBRef
    private Set<Member> members = new HashSet<>();

    public void addColumn(Column column) {
        if (!columns.contains(column)) {
            this.columns.add(column);
        }
    }
}
