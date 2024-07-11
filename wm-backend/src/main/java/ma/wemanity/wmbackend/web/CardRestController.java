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
import java.util.Set;

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
    public ResponseEntity<Card> updateCard(@PathVariable("id") String id,
                                           @RequestParam(name = "name", required = false) String name,
                                           @RequestParam(name = "company", required = false) String company,
                                           @RequestParam(name = "position", required = false) String position,
                                           @RequestParam(name = "email", required = false) String email,
                                           @RequestParam(name = "number", required = false) String number,
                                           @RequestParam(name = "website", required = false) String website,
                                           @RequestParam(name = "columnId", required = false) String columnId,
                                           @RequestParam(name = "labelIds", required = false) Set<String> labelIds) {
        try {
            Card card = cardService.updateCard(id, name, company, position, email, number, website, columnId, labelIds);
            return new ResponseEntity<>(card, HttpStatus.OK);
        } catch (CardNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @DeleteMapping("/{id}/label/{labelId}")
    public ResponseEntity<Card> removeLabelFromCard(@PathVariable String id, @PathVariable String labelId) {
        try {
            Card updatedCard = cardService.removeLabelFromCard(id, labelId);
            return new ResponseEntity<>(updatedCard, HttpStatus.OK);
        } catch (CardNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
