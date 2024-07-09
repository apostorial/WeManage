package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;

import java.util.List;

public interface ColumnService {
    Column createColumn(String boardId, String name) throws ServiceException;
    Column updateColumn(String id, String name, String description) throws ColumnNotFoundException, ServiceException;
    void deleteBoard(String id) throws ColumnNotFoundException, ServiceException;
    List<Column> getColumnsByBoard(Board board) throws ServiceException;
}
