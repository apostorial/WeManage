package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Comment;
import ma.wemanity.wmbackend.exceptions.CommentNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;

import java.util.List;

public interface CommentService {
    Comment getComment(String id) throws ServiceException;
    Comment createComment(String id, String content) throws ServiceException;
    Comment updateComment(String id, String content) throws CommentNotFoundException, ServiceException;
    void deleteComment(String id) throws CommentNotFoundException, ServiceException;
    List<Comment> getCommentsbyCardId(String id) throws ServiceException;
}
