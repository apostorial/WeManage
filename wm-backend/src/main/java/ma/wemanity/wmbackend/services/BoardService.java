package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.entities.Member;
import ma.wemanity.wmbackend.exceptions.BoardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface BoardService {
    Board createBoard(Board board) throws ServiceException;
    Board updateBoard(String id, String name, String description, UserDetails authenticatedUser) throws BoardNotFoundException, ServiceException;
    void deleteBoard(String id) throws BoardNotFoundException, ServiceException;
    Optional<Board> getBoard(Board board) throws BoardNotFoundException, ServiceException;
//    List<BoardDTO> getBoardsByUserId(Long userId) throws BoardNotFoundException, ServiceException;
}
