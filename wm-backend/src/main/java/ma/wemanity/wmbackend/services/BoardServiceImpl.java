package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.entities.User;
import ma.wemanity.wmbackend.exceptions.BoardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.BoardRepository;
import ma.wemanity.wmbackend.repositories.ColumnRepository;
import ma.wemanity.wmbackend.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service @AllArgsConstructor @Slf4j
public class BoardServiceImpl implements BoardService {
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final ColumnRepository columnRepository;

    @Override
    public Board getBoard(String id) throws ServiceException {
        try {
            Optional<Board> board = boardRepository.findById(id);
            if (board.isEmpty()) {
                throw new BoardNotFoundException("Board not found with id: " + id);
            }
            return board.get();
        } catch (Exception e) {
            throw new ServiceException("Failed to get board", e);
        }
    }

    @Override
    public Board createBoard(String name, String description) throws ServiceException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            OAuth2User principal = (OAuth2User) authentication.getPrincipal();
            String email = principal.getAttribute("email");
            User authenticatedUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ServiceException("Authenticated user not found"));
            Board board = new Board();
            board.setName(name);
            board.setDescription(description);
            board.setOwner(authenticatedUser);
            Board savedBoard = boardRepository.save(board);

            String[] columnNames = {"To Do", "In Progress", "In Review", "Completed"};
            for (String columnName : columnNames) {
                Column column = new Column();
                column.setName(columnName);
                column.setBoard(savedBoard);
                columnRepository.save(column);
                savedBoard.addColumn(column);
                boardRepository.save(savedBoard);
            }

            authenticatedUser.getOwnerOf().add(board);
            userRepository.save(authenticatedUser);

            return savedBoard;
        } catch (Exception e) {
            throw new ServiceException("Failed to create board", e);
        }
    }

    @Override
    public Board updateBoard(String id, String name, String description) throws ServiceException {
        try {
            Optional<Board> optionalBoard = boardRepository.findById(id);
            if (optionalBoard.isEmpty()) {
                throw new BoardNotFoundException("Board not found with id: " + id);
            }
            Board board = optionalBoard.get();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            OAuth2User principal = (OAuth2User) authentication.getPrincipal();
            String email = principal.getAttribute("email");
            User authenticatedUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ServiceException("Authenticated user not found"));

            if (!authenticatedUser.getId().equals(board.getOwner().getId())) {
                throw new AccessDeniedException("You are not authorized to update this board.");
            }

            board.setName(name);
            board.setDescription(description);
            return boardRepository.save(board);
        } catch (Exception e) {
            throw new ServiceException("Failed to update board", e);
        }
    }

    @Override
    public void deleteBoard(String id) throws ServiceException{
        try {
            Optional<Board> optionalBoard = boardRepository.findById(id);
            if (optionalBoard.isEmpty()) {
                throw new BoardNotFoundException("Board not found with id: " + id);
            }
            Board board = optionalBoard.get();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            OAuth2User principal = (OAuth2User) authentication.getPrincipal();
            String email = principal.getAttribute("email");
            User authenticatedUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ServiceException("Authenticated user not found"));

            if (!authenticatedUser.getId().equals(board.getOwner().getId())) {
                throw new AccessDeniedException("You are not authorized to delete this board.");
            }
            boardRepository.deleteById(id);
        } catch (Exception e) {
            throw new ServiceException("Failed to delete board", e);
        }
    }

    @Override
    public List<Board> getBoardsByAuthenticatedUser() throws ServiceException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String email = principal.getAttribute("email");
        User authenticatedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Authenticated user not found"));

        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + authenticatedUser.getId()));
        return boardRepository.findByOwnerId(user.getId());
    }

    @Override
    public Board reorderColumns(String boardId, List<String> columnIds) throws ServiceException {
        try {
            Board board = getBoard(boardId);
            List<Column> reorderedColumns = new ArrayList<>();

            for (String columnId : columnIds) {
                Column column = columnRepository.findById(columnId)
                        .orElseThrow(() -> new ColumnNotFoundException("Column not found with id: " + columnId));
                reorderedColumns.add(column);
            }

            board.setColumns(reorderedColumns);
            return boardRepository.save(board);
        } catch (Exception e) {
            throw new ServiceException("Failed to reorder columns", e);
        }
    }
}
