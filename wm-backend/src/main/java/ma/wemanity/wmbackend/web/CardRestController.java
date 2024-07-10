package ma.wemanity.wmbackend.web;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.exceptions.CardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.services.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @AllArgsConstructor @RequestMapping("/api/cards")
public class CardRestController {
    private final CardService cardService;

    @GetMapping("/{id}")
    public ResponseEntity<Card> getCard(@PathVariable("id") String id) {
        try {
            Card card = cardService.getCard(id);
            return new ResponseEntity<>(card, HttpStatus.OK);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Card> createCard(@RequestParam("columnId") String columnId,
                                               @RequestParam("name") String name) {
        try {
            Card card = cardService.createCard(columnId, name);
            return new ResponseEntity<>(card, HttpStatus.CREATED);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Card> updateCard(@PathVariable String id) {
        return null;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Card> deleteCard(@PathVariable("id") String id) {
        try {
            cardService.deleteCard(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (CardNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/column/{id}")
        public ResponseEntity<List<Card>> getCardsByColumnId(@PathVariable String id) {
        try {
            List<Card> cards = cardService.getCardsByColumnId(id);
            return new ResponseEntity<>(cards, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
