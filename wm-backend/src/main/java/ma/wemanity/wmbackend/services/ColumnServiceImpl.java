package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.wemanity.wmbackend.entities.Board;
import ma.wemanity.wmbackend.entities.Column;
import ma.wemanity.wmbackend.exceptions.BoardNotFoundException;
import ma.wemanity.wmbackend.exceptions.ColumnNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.BoardRepository;
import ma.wemanity.wmbackend.repositories.ColumnRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service @AllArgsConstructor @Slf4j
public class ColumnServiceImpl implements ColumnService {
    private final ColumnRepository columnRepository;
    private final BoardRepository boardRepository;

    @Override
    public Column createColumn(String boardId, String name) throws ServiceException {
        try {
            Optional<Board> optionalBoard = boardRepository.findById(boardId);
            if (optionalBoard.isEmpty()) {
                throw new BoardNotFoundException("Board not found with id:" + boardId);
            }
            Board board = optionalBoard.get();
            Column column = new Column();
            column.setBoard(board);
            column.setName(name);
            Column savedColumn = columnRepository.save(column);
            if (!board.getColumns().contains(savedColumn)) {
                board.addColumn(savedColumn);
                boardRepository.save(board);
            }
            return savedColumn;
        } catch (Exception e) {
            throw new ServiceException("Error while creating column", e);
        }
    }

    @Override
    public Column updateColumn(String id, String name, String description) throws ServiceException {
        try {
            Optional<Column> optionalColumn = columnRepository.findById(id);
            if (optionalColumn.isEmpty()) {
                throw new ColumnNotFoundException("Column not found with id: " + id);
            }
            Column column = optionalColumn.get();

            column.setName(name);
            column.setDescription(description);
            return columnRepository.save(column);
        } catch (Exception e) {
            throw new ServiceException("Failed to update column", e);
        }
    }

    @Override
    public void deleteColumn(String id) throws ServiceException {
        try {
            Optional<Column> optionalColumn = columnRepository.findById(id);
            if (optionalColumn.isEmpty()) {
                throw new ColumnNotFoundException("Column not found with id: " + id);
            }
            Column column = optionalColumn.get();
            Board board = column.getBoard();

            columnRepository.deleteById(id);
            board.getColumns().remove(column);
            boardRepository.save(board);
        } catch (Exception e) {
            throw new ServiceException("Failed to delete column", e);
        }
    }

    @Override
    public List<Column> getColumnsByBoard(Board board) throws ServiceException {
        return List.of();
    }
}
