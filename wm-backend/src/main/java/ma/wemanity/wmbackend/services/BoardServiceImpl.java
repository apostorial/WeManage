package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.entities.Member;
import ma.wemanity.wmbackend.exceptions.BoardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.BoardRepository;
import ma.wemanity.wmbackend.repositories.MemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

@Service @AllArgsConstructor @Slf4j
public class BoardServiceImpl implements BoardService {
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    @Override
    public Board createBoard(Board board) throws ServiceException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();
            User userDetails = (User) principal;
            Member authenticatedUser = memberRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ServiceException("Authenticated user not found"));
            board.setOwner(authenticatedUser);
            return boardRepository.save(board);
        } catch (Exception e) {
            throw new ServiceException("Failed to create board", e);
        }
    }

    @Override
    public Board updateBoard(String id, String name, String description, UserDetails authenticatedUser) throws ServiceException {
        try {
            Optional<Board> optionalExistingBoard = boardRepository.findById(id);
            if (optionalExistingBoard.isEmpty()) {
                throw new BoardNotFoundException("Board not found with id: " + id);
            }
            Board existingBoard = optionalExistingBoard.get();

            if (!authenticatedUser.getUsername().equals(existingBoard.getOwner().getUsername())) {
                throw new AccessDeniedException("You are not authorized to update this board.");
            }

            existingBoard.setName(name);
            existingBoard.setDescription(description);
            return boardRepository.save(existingBoard);
        } catch (Exception e) {
            throw new ServiceException("Failed to update board", e);
        }
    }

    @Override
    public void deleteBoard(String id) throws ServiceException{
        try {
            if (!boardRepository.existsById(id)) {
                throw new BoardNotFoundException("Board not found with id: " + id);
            }
            boardRepository.deleteById(id);
        } catch (Exception e) {
            throw new ServiceException("Failed to delete board", e);
        }
    }

    @Override
    public Optional<Board> getBoard(Board board) throws ServiceException {
        try {
            if (!boardRepository.existsById(board.getId())) {
                throw new BoardNotFoundException("Board not found with id: " + board.getId());
            }
            return boardRepository.findById(board.getId());
        } catch (Exception e) {
            throw new ServiceException("Failed to retrieve board", e);
        }
    }
}
