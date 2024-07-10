package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.exceptions.CardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.CardRepository;
import ma.wemanity.wmbackend.repositories.ColumnRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service @AllArgsConstructor
public class CardServiceImpl implements CardService {
    private final CardRepository cardRepository;
    private final ColumnRepository columnRepository;

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
    public Card updateCard() throws CardNotFoundException, ServiceException {
        return null;
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

            columnRepository.deleteById(id);
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
}
