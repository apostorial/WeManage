package ma.wemanity.wmbackend.web;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.Events;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.exceptions.CardNotFoundException;
import ma.wemanity.wmbackend.repositories.CardRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.*;
import com.google.api.services.calendar.model.Event;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;

@RestController @AllArgsConstructor @RequestMapping("/api/calendar")
public class CalendarRestController {

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String APPLICATION_NAME = "WeManage";
    private final CardRepository cardRepository;

    @GetMapping("/events")
    public ResponseEntity<List<Map<String, Object>>> getCalendarEvents(@RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient)
            throws GeneralSecurityException, IOException {
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null))
                .createScoped(Collections.singleton(CalendarScopes.CALENDAR_READONLY));

        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);

        Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY, requestInitializer)
                .setApplicationName(APPLICATION_NAME)
                .build();

        DateTime now = new DateTime(System.currentTimeMillis());
        Events events = service.events().list("primary")
                .setMaxResults(250)  // Increased for more comprehensive calendar view
                .setTimeMin(now)
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        List<Map<String, Object>> formattedEvents = events.getItems().stream()
                .map(event -> {
                    Map<String, Object> formattedEvent = new HashMap<>();
                    formattedEvent.put("id", event.getId());
                    formattedEvent.put("title", event.getSummary());
                    formattedEvent.put("start", event.getStart().getDateTime() != null
                            ? event.getStart().getDateTime().toStringRfc3339()
                            : event.getStart().getDate().toString());
                    formattedEvent.put("end", event.getEnd().getDateTime() != null
                            ? event.getEnd().getDateTime().toStringRfc3339()
                            : event.getEnd().getDate().toString());
                    formattedEvent.put("allDay", event.getStart().getDateTime() == null);
                    return formattedEvent;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(formattedEvents);
    }

    @PostMapping("/create-event")
    public ResponseEntity<String> createCalendarEvent(@RegisteredOAuth2AuthorizedClient("google") OAuth2AuthorizedClient authorizedClient,
                                                      @RequestParam("name") String name,
                                                      @RequestParam("time") String time,
                                                      @RequestParam("cardId") String cardId)
            throws GeneralSecurityException, IOException, CardNotFoundException {
        String accessToken = authorizedClient.getAccessToken().getTokenValue();

        GoogleCredentials credentials = GoogleCredentials.create(new AccessToken(accessToken, null))
                .createScoped(Collections.singleton(CalendarScopes.CALENDAR_EVENTS));

        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);

        Calendar service = new Calendar.Builder(httpTransport, JSON_FACTORY, requestInitializer)
                .setApplicationName(APPLICATION_NAME)
                .build();

        Event event = new Event()
                .setSummary(name)
                .setLocation("")
                .setStart(new EventDateTime().setDateTime(DateTime.parseRfc3339(time)))
                .setEnd(new EventDateTime().setDateTime(DateTime.parseRfc3339(time)));

        Optional<Card> optionalCard = cardRepository.findById(cardId);
        if (optionalCard.isEmpty()) {
            throw new CardNotFoundException("Card not found with id: " + cardId);
        }
        Card card = optionalCard.get();
        card.setMeeting(time);
        cardRepository.save(card);

        Event createdEvent = service.events().insert("primary", event).execute();

        return ResponseEntity.ok(createdEvent.getHtmlLink());
    }
}