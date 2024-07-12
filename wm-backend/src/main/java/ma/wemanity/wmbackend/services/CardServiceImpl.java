package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.entities.Label;
import ma.wemanity.wmbackend.exceptions.CardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.LabelNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.CardRepository;
import ma.wemanity.wmbackend.repositories.ColumnRepository;
import ma.wemanity.wmbackend.repositories.LabelRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service @AllArgsConstructor @Slf4j
public class CardServiceImpl implements CardService {
    private final CardRepository cardRepository;
    private final ColumnRepository columnRepository;
    private final LabelRepository labelRepository;

    @Override
    public Card getCard(String id) throws ServiceException {
        try {
            Optional<Card> card = cardRepository.findById(id);
            if (card.isEmpty()) {
                throw new CardNotFoundException("Card not found with id: " + id);
            }
            return card.get();
        } catch (Exception e) {
            throw new ServiceException("Failed to get card", e);
        }
    }

    @Override
    public Card createCard(String columnId, String name) throws ServiceException {
        try {
            Optional<Column> optionalColumn = columnRepository.findById(columnId);
            if (optionalColumn.isEmpty()) {
                throw new ColumnNotFoundException("Column not found with id:" + columnId);
            }
            Column column = optionalColumn.get();
            Card card = new Card();
            card.setColumn(column);
            card.setName(name);
            Card savedCard = cardRepository.save(card);
            if (!column.getCards().contains(savedCard)) {
                column.addCard(savedCard);
                columnRepository.save(column);
            }
            return savedCard;
        } catch (Exception e) {
            throw new ServiceException("Error while creating card", e);
        }
    }

    @Override
    public Card updateCard(String id, String name, String company, String position, String email, String number, String website, String columnId, Set<String> labelIds) throws ServiceException {
        try {
            Optional<Card> optionalCard = cardRepository.findById(id);
            if (optionalCard.isEmpty()) {
                throw new CardNotFoundException("Card not found with id: " + id);
            }
            Card card = optionalCard.get();
            Column existingColumn = card.getColumn();
            existingColumn.removeCard(card);
            columnRepository.save(existingColumn);

            card.setName(name);
            card.setCompany(company);
            card.setPosition(position);
            card.setEmail(email);
            card.setNumber(number);
            card.setWebsite(website);

            Column column = columnRepository.findById(columnId)
                    .orElseThrow(() -> new ColumnNotFoundException("Column not found with id: " + columnId));
            card.setColumn(column);
            column.addCard(card);
            columnRepository.save(column);

            for (Label label : card.getLabels()) {
                label.getCards().remove(card);
                labelRepository.save(label);
            }

            if (labelIds != null && !labelIds.isEmpty()) {
                Set<Label> labels = new HashSet<>(labelRepository.findAllById(labelIds));
                for (Label label : labels) {
                    if (label.getCards() == null) {
                        label.setCards(new HashSet<>());
                    }
                    label.getCards().add(card);
                    labelRepository.save(label);
                }
                card.setLabels(labels);
            } else {
                card.setLabels(Collections.emptySet());
            }

            return cardRepository.save(card);
        } catch (Exception e) {
            throw new ServiceException("Failed to update card", e);
        }
    }

    @Override
    public void deleteCard(String id) throws ServiceException {
        try {
            Optional<Card> optionalCard = cardRepository.findById(id);
            if (optionalCard.isEmpty()) {
                throw new CardNotFoundException("Card not found with id: " + id);
            }
            Card card = optionalCard.get();
            Column column = card.getColumn();

            cardRepository.deleteById(id);
            column.getCards().remove(card);
            columnRepository.save(column);
        } catch (Exception e) {
            throw new ServiceException("Failed to delete card", e);
        }
    }

    @Override
    public List<Card> getCardsByColumnId(String id) throws ServiceException {
        try {
            return cardRepository.findByColumnId(id);
        } catch (Exception e) {
            throw new ServiceException("Failed to get cards by columnId", e);
        }
    }

    @Override
    public Card removeLabelFromCard(String id, String labelId) throws ServiceException {
        try {
            Optional<Card> optionalCard = cardRepository.findById(id);
            if (optionalCard.isEmpty()) {
                throw new CardNotFoundException("Card not found with id: " + id);
            }
            Card card = optionalCard.get();

            Optional<Label> optionalLabel = labelRepository.findById(labelId);
            if (optionalLabel.isEmpty()) {
                throw new LabelNotFoundException("Label not found with id: " + labelId);
            }
            Label label = optionalLabel.get();
            label.removeCard(card);
            labelRepository.save(label);
            card.removeLabel(label);
            return cardRepository.save(card);
        } catch (Exception e) {
            throw new ServiceException("Failed to remove label from card", e);
        }
    }
}
