package ma.wemanity.wmbackend.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;
import java.util.stream.Collectors;

@Document @Data @NoArgsConstructor @AllArgsConstructor
public class Board {
    @Id
    private String id;
    @NotNull
    private String name;
    private String description;
    @DBRef
    private List<Column> columns = new ArrayList<>();
    @DBRef
    private User owner;
    @DBRef
    private Set<User> users = new HashSet<>();

    @JsonProperty("columns")
    public List<String> getColumnsForSerialization() {
        return columns.stream()
                .map(Column::getId)
                .collect(Collectors.toList());
    }

    @JsonProperty("owner")
    public String getOwnerForSerialization() {
        return owner.getId();
    }

    @JsonProperty("members")
    public List<String> getMembersForSerialization() {
        return users.stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    public void addColumn(Column column) {
        if (!columns.contains(column)) {
            this.columns.add(column);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Board board = (Board) o;
        return Objects.equals(id, board.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Board{id='" + id + "', name='" + name + "'}";
    }

}
