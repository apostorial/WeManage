package ma.wemanity.wmbackend.services;

import ma.wemanity.wmbackend.entities.Label;
import ma.wemanity.wmbackend.exceptions.LabelNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;

import java.util.List;

public interface LabelService {
    Label getLabel(String id) throws ServiceException;
    Label createLabel(String name, String color) throws ServiceException;
    Label updateLabel(String id, String name, String color) throws LabelNotFoundException, ServiceException;
    void deleteLabel(String id) throws LabelNotFoundException, ServiceException;
    List<Label> getLabelsByCardId(String id) throws ServiceException;
    List<Label> getLabelsByAuthenticatedUser() throws ServiceException;
}
