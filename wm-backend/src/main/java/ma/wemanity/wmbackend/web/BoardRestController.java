package ma.wemanity.wmbackend.web;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.services.BoardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController @AllArgsConstructor @Slf4j @RequestMapping("/api/board")
public class BoardRestController {
    private final BoardService boardService;

    @PostMapping("/create")
    public ResponseEntity<Board> createBoard(@RequestBody Board board) {
        try {
            Board createdBoard = boardService.createBoard(board);
            return new ResponseEntity<>(createdBoard, HttpStatus.CREATED);
        } catch (ServiceException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
