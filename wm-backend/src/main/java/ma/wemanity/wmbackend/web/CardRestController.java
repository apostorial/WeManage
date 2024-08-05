package ma.wemanity.wmbackend.web;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.exceptions.CardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.CardRepository;
import ma.wemanity.wmbackend.services.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;

@RestController @AllArgsConstructor @RequestMapping("/api/cards")
public class CardRestController {
    private final CardService cardService;
    private final CardRepository cardRepository;
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "WeManage";

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
    public ResponseEntity<?> createCard(
            @RequestParam("columnId") String columnId,
            @RequestParam("name") String name,
            @RequestParam(value = "company", required = false) String company,
            @RequestParam(value = "position", required = false) String position,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "number", required = false) String number,
            @RequestParam(value = "website", required = false) String website,
            @RequestParam(value = "meeting", required = false) String meeting,
            @RequestParam(value = "labelIds", required = false) Set<String> labelIds) {

        try {
            Card card = cardService.createCard(columnId, name, company, position, email, number, website, meeting, labelIds);
            return new ResponseEntity<>(card, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Invalid input: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ServiceException e) {
            return new ResponseEntity<>("Error creating card: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCardAndCreateEvent(
            @PathVariable String id,
            @RequestParam String name,
            @RequestParam String company,
            @RequestParam String position,
            @RequestParam String email,
            @RequestParam String number,
            @RequestParam String website,
            @RequestParam(required = false) String meeting,
            @RequestParam(required = false) Set<String> labelIds,
            @RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient) {
        try {
            Optional<Card> existingCardOptional = cardRepository.findById(id);

            if (existingCardOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Card existingCard = existingCardOptional.get();
            boolean meetingChanged = (existingCard.getMeeting() == null && meeting != null) ||
                    (existingCard.getMeeting() != null && !existingCard.getMeeting().equals(meeting));

            Card updatedCard = cardService.updateCard(id, name, company, position, email, number, website, meeting, labelIds);
            if (meetingChanged) {
                String eventLink = createCalendarEvent(authorizedClient, meeting, id);
                return ResponseEntity.ok(Map.of("card", updatedCard, "eventLink", eventLink));
            } else {
                return ResponseEntity.ok(Map.of("card", updatedCard));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating card: " + e.getMessage());
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

    @PostMapping("/{id}/label/{labelId}")
    public ResponseEntity<Card> addLabelToCard(@PathVariable String id, @PathVariable String labelId) {
        try {
            Card updatedCard = cardService.addLabelToCard(id, labelId);
            return new ResponseEntity<>(updatedCard, HttpStatus.OK);
        } catch (CardNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
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

    @PutMapping("/move/{cardId}/column/{columnId}")
    public ResponseEntity<Card> moveCard(@PathVariable String cardId, @PathVariable String columnId) {
        try {
            Card card = cardService.moveCard(cardId, columnId);
            return new ResponseEntity<>(card, HttpStatus.OK);
        } catch (CardNotFoundException | ColumnNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String createCalendarEvent(OAuth2AuthorizedClient authorizedClient, String time, String cardId)
            throws GeneralSecurityException, IOException, CardNotFoundException {
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null))
                .createScoped(Collections.singleton(CalendarScopes.CALENDAR_EVENTS));

        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);

        Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY, requestInitializer)
                .setApplicationName(APPLICATION_NAME)
                .build();

        Optional<Card> optionalCard = cardRepository.findById(cardId);
        if (optionalCard.isEmpty()) {
            throw new CardNotFoundException("Card not found with id: " + cardId);
        }
        Card card = optionalCard.get();

        Event event = new Event()
                .setSummary("Meeting with " + card.getName())
                .setLocation("")
                .setStart(new EventDateTime().setDateTime(DateTime.parseRfc3339(time)))
                .setEnd(new EventDateTime().setDateTime(DateTime.parseRfc3339(time)));

        card.setMeeting(time);
        cardRepository.save(card);

        Event createdEvent = service.events().insert("primary", event).execute();

        return createdEvent.getHtmlLink();
    }
}
