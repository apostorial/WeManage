package ma.wemanity.wmbackend.web;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.exceptions.BoardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.services.BoardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @AllArgsConstructor @RequestMapping("/api/boards")
public class BoardRestController {
    private final BoardService boardService;

    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoard(@PathVariable("id") String id) {
        try {
            Board board = boardService.getBoard(id);
            return new ResponseEntity<>(board, HttpStatus.OK);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Board> createBoard(@RequestParam(name = "name") String name,
                                             @RequestParam(name = "description", required = false) String description) {
        try {
            Board createdBoard = boardService.createBoard(name, description);
            return new ResponseEntity<>(createdBoard, HttpStatus.CREATED);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable("id") String id,
                                             @RequestParam(name = "name") String name,
                                             @RequestParam(name = "description", required = false) String description,
                                             Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Board board = boardService.updateBoard(id, name, description, userDetails);
            return new ResponseEntity<>(board, HttpStatus.OK);
        } catch (BoardNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable("id") String id,
                                            Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            boardService.deleteBoard(id, userDetails);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (BoardNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<Board>> listBoards(Authentication authentication) {
        try {
            List<Board> boards = boardService.getBoardsByAuthenticatedUser(authentication);
            return new ResponseEntity<>(boards, HttpStatus.OK);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{boardId}/reorder-columns")
    public ResponseEntity<Board> reorderColumns(@PathVariable String boardId, @RequestBody List<String> columnIds) {
        try {
            Board board = boardService.reorderColumns(boardId, columnIds);
            return new ResponseEntity<>(board, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
