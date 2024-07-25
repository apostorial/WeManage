package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.exceptions.BoardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;

import java.util.List;

public interface BoardService {
    Board getBoard(String id) throws ServiceException;
    Board createBoard(String name, String description) throws ServiceException;
    Board updateBoard(String id, String name, String description) throws BoardNotFoundException, ServiceException;
    void deleteBoard(String id) throws BoardNotFoundException, ServiceException;
    List<Board> getBoardsByAuthenticatedUser() throws ServiceException;
    Board reorderColumns(String boardId, List<String> columnIds) throws BoardNotFoundException, ServiceException;
}
