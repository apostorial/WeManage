package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.entities.Label;
import ma.wemanity.wmbackend.exceptions.CardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;

import java.util.List;
import java.util.Set;

public interface CardService {
    Card getCard(String id) throws ServiceException;
    Card createCard(String columnId, String name) throws ServiceException;
    Card updateCard() throws CardNotFoundException, ServiceException;
    void deleteCard(String id) throws CardNotFoundException, ServiceException;
    List<Card> getCardsByColumnId(String id) throws ServiceException;
}
