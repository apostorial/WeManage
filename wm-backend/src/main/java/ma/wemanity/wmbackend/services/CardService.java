package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.exceptions.CardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;

import java.util.List;
import java.util.Set;

public interface CardService {
    Card getCard(String id) throws ServiceException;
    Card createCard(String columnId, String name) throws ServiceException;
    Card updateCard(String id, String name, String company, String position, String email, String number, String website, Set<String> labelIds) throws CardNotFoundException, ServiceException;
    void deleteCard(String id) throws CardNotFoundException, ServiceException;
    List<Card> getCardsByColumnId(String id) throws ServiceException;
    Card addLabelToCard(String id, String labelId) throws CardNotFoundException, ServiceException;
    Card removeLabelFromCard(String id, String labelId) throws CardNotFoundException, ServiceException;
    Card moveCard(String id, String columnId) throws CardNotFoundException, ColumnNotFoundException, ServiceException;
}
