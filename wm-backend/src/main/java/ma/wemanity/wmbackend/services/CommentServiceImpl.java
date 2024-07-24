package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.*;
import ma.wemanity.wmbackend.exceptions.*;
import ma.wemanity.wmbackend.repositories.CardRepository;
import ma.wemanity.wmbackend.repositories.CommentRepository;
import ma.wemanity.wmbackend.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service @AllArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CardRepository cardRepository;

    @Override
    public Comment getComment(String id) throws ServiceException {
        try {
            Optional<Comment> comment = commentRepository.findById(id);
            if (comment.isEmpty()) {
                throw new CommentNotFoundException("Comment not found with id: " + id);
            }
            return comment.get();
        } catch (Exception e) {
            throw new ServiceException("Failed to get comment", e);
        }
    }

    @Override
    public Comment createComment(String cardId, String content) throws ServiceException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();
            org.springframework.security.core.userdetails.User userDetails = (org.springframework.security.core.userdetails.User) principal;
            User authenticatedUser = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ServiceException("Authenticated user not found"));

            Optional<Card> optionalCard = cardRepository.findById(cardId);
            if (optionalCard.isEmpty()) {
                throw new CardNotFoundException("Card not found with id:" + cardId);
            }
            Card card = optionalCard.get();
            Comment comment = new Comment();
            comment.setCard(card);
            comment.setContent(content);
            comment.setAuthor(authenticatedUser);
            comment.setCreatedAt(LocalDateTime.now());
            comment.setUpdatedAt(LocalDateTime.now());
            Comment savedComment = commentRepository.save(comment);
            if (!card.getComments().contains(savedComment)) {
                card.addComment(savedComment);
                cardRepository.save(card);
            }
            return savedComment;
        } catch (Exception e) {
            throw new ServiceException("Failed to create comment", e);
        }
    }

    @Override
    public Comment updateComment(String id, String content) throws ServiceException {
        try {
            Optional<Comment> optionalComment = commentRepository.findById(id);
            if (optionalComment.isEmpty()) {
                throw new CommentNotFoundException("Comment not found with id: " + id);
            }
            Comment comment = optionalComment.get();
            comment.setUpdatedAt(LocalDateTime.now());
            comment.setContent(content);
            return commentRepository.save(comment);
        } catch (Exception e) {
            throw new ServiceException("Failed to update comment", e);
        }
    }

    @Override
    public void deleteComment(String id, UserDetails authenticatedUser) throws ServiceException {
        try {
            Optional<Comment> optionalComment = commentRepository.findById(id);
            if (optionalComment.isEmpty()) {
                throw new CommentNotFoundException("Comment not found with id: " + id);
            }
            Comment comment = optionalComment.get();
            Card card = comment.getCard();

            if (!authenticatedUser.getUsername().equals(comment.getAuthor().getUsername())) {
                throw new AccessDeniedException("You are not authorized to delete this comment.");
            }

            commentRepository.deleteById(id);
            card.getComments().remove(comment);
            cardRepository.save(card);
        } catch (Exception e) {
            throw new ServiceException("Failed to delete comment", e);
        }
    }

    @Override
    public List<Comment> getCommentsbyCardId(String id) throws ServiceException {
        try {
            return commentRepository.findByCardId(id);
        } catch (Exception e) {
            throw new ServiceException("Failed to get comments by cardId", e);
        }
    }
}
