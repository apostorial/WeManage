package ma.wemanity.wmbackend.web;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Label;
import ma.wemanity.wmbackend.exceptions.LabelNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.services.LabelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @AllArgsConstructor @RequestMapping("/api/labels")
public class LabelRestController {
    private final LabelService labelService;

    @GetMapping("/{id}")
    public ResponseEntity<Label> getLabel(@PathVariable("id") String id) {
        try {
            Label label = labelService.getLabel(id);
            return new ResponseEntity<>(label, HttpStatus.OK);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Label> createLabel(@RequestParam(name = "name") String name,
                                           @RequestParam(name = "color", required = false) String color) {
        try {
            Label label = labelService.createLabel(name, color);
            return new ResponseEntity<>(label, HttpStatus.CREATED);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Label> updateLabel(@PathVariable("id") String id,
                                           @RequestParam(name = "name") String name,
                                           @RequestParam(name = "color", required = false) String color) {
        try {
            Label label = labelService.updateLabel(id, name, color);
            return new ResponseEntity<>(label, HttpStatus.OK);
        } catch (LabelNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Label> deleteLabel(@PathVariable("id") String id) {
        try {
            labelService.deleteLabel(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (LabelNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/card/{id}")
    public ResponseEntity<List<Label>> getLabelsByCardId(@PathVariable String id) {
        try {
            List<Label> labels = labelService.getLabelsByCardId(id);
            return new ResponseEntity<>(labels, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
