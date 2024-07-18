package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;

import java.util.List;

public interface ColumnService {
    Column getColumn (String id) throws ServiceException;
    Column createColumn(String boardId, String name) throws ServiceException;
    Column updateColumn(String id, String name, String description) throws ColumnNotFoundException, ServiceException;
    void deleteColumn(String id) throws ColumnNotFoundException, ServiceException;
    List<Column> getColumnsByBoardId(String id) throws ServiceException;
    Column reorderCards(String columnId, List<String> cardIds) throws ColumnNotFoundException, ServiceException;
}
