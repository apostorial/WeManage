package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.exceptions.BoardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface BoardService {
    Board getBoard(String id) throws ServiceException;
    Board createBoard(Board board) throws ServiceException;
    Board updateBoard(String id, String name, String description, UserDetails authenticatedUser) throws BoardNotFoundException, ServiceException;
    void deleteBoard(String id, UserDetails userDetails) throws BoardNotFoundException, ServiceException;
    List<Board> getBoardsByAuthenticatedUser(Authentication authentication) throws ServiceException;
}
