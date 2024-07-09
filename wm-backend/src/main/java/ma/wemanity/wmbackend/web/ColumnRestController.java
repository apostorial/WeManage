package ma.wemanity.wmbackend.web;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.services.ColumnService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController@AllArgsConstructor @RequestMapping("/api/columns")
public class ColumnRestController {
    private final ColumnService columnService;

    @PostMapping("/create")
    public ResponseEntity<Column> createColumn(@RequestParam("boardId") String boardId,
                                               @RequestParam("name") String name) {
        try {
            Column column = columnService.createColumn(boardId, name);
            return new ResponseEntity<>(column, HttpStatus.CREATED);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Column> updateColumn(@PathVariable("id") String id,
                                               @RequestParam(name = "name") String name,
                                               @RequestParam(name = "description", required = false) String description) {
        try {
            Column column = columnService.updateColumn(id, name, description);
            return new ResponseEntity<>(column, HttpStatus.OK);
        } catch (ColumnNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
