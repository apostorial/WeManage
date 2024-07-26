package ma.wemanity.wmbackend.web;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.services.ColumnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @AllArgsConstructor @RequestMapping("/api/columns")
public class ColumnRestController {
    private final ColumnService columnService;

    @GetMapping("/{id}")
    public ResponseEntity<Column> getColumn(@PathVariable("id") String id) {
        try {
            Column column = columnService.getColumn(id);
            return new ResponseEntity<>(column, HttpStatus.OK);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Column> createColumn(@RequestParam("boardId") String boardId,
                                               @RequestParam("name") String name,
                                               @RequestParam("color") String color) {
        try {
            Column column = columnService.createColumn(boardId, name, color);
            return new ResponseEntity<>(column, HttpStatus.CREATED);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Column> updateColumn(@PathVariable("id") String id,
                                               @RequestParam(name = "name") String name,
                                               @RequestParam(name = "description", required = false) String description,
                                               @RequestParam(name = "color", required = false) String color) {
        try {
            Column column = columnService.updateColumn(id, name, description, color);
            return new ResponseEntity<>(column, HttpStatus.OK);
        } catch (ColumnNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Column> deleteColumn(@PathVariable("id") String id) {
        try {
            columnService.deleteColumn(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ColumnNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/board/{id}")
    public ResponseEntity<List<Column>> getColumnsByBoardId(@PathVariable String id) {
        try {
            List<Column> columns = columnService.getColumnsByBoardId(id);
            return new ResponseEntity<>(columns, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{columnId}/reorder-cards")
    public ResponseEntity<Column> reorderCards(@PathVariable String columnId, @RequestBody List<String> cardIds) {
        try {
            Column column = columnService.reorderCards(columnId, cardIds);
            return new ResponseEntity<>(column, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
