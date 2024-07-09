package ma.wemanity.wmbackend.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.entities.Column;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class BoardSerializer extends JsonSerializer<Board> {
    @Override
    public void serialize(Board board, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("id", board.getId());
        jsonGenerator.writeStringField("name", board.getName());
        jsonGenerator.writeStringField("description", board.getDescription());
        jsonGenerator.writeStringField("owner", String.valueOf(board.getOwner()));
        List<String> columnIds = board.getColumns().stream()
                .map(Column::getId)
                .collect(Collectors.toList());
        jsonGenerator.writeObjectField("columns", columnIds);

        jsonGenerator.writeEndObject();
    }
}
