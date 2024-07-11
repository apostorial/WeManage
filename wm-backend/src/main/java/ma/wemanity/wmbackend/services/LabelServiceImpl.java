package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.*;
import ma.wemanity.wmbackend.exceptions.LabelNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.CardRepository;
import ma.wemanity.wmbackend.repositories.LabelRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service @AllArgsConstructor
public class LabelServiceImpl implements LabelService {
    private final LabelRepository labelRepository;
    private final CardRepository cardRepository;

    @Override
    public Label getLabel(String id) throws ServiceException {
        try {
            Optional<Label> label = labelRepository.findById(id);
            if (label.isEmpty()) {
                throw new LabelNotFoundException("Label not found with id: " + id);
            }
            return label.get();
        } catch (Exception e) {
            throw new ServiceException("Failed to get label", e);
        }
    }

    @Override
    public Label createLabel(String name, String color) throws ServiceException {
        try {
            Label label = new Label();
            label.setName(name);
            if (color == null || color.isEmpty()) {
                color = generateRandomColor();
            }
            label.setColor(color);
            return labelRepository.save(label);
        } catch (Exception e) {
            throw new ServiceException("Error while creating label", e);
        }
    }

    @Override
    public Label updateLabel(String id, String name, String color) throws ServiceException {
        try {
            Optional<Label> optionalLabel = labelRepository.findById(id);
            if (optionalLabel.isEmpty()) {
                throw new LabelNotFoundException("Label not found with id: " + id);
            }
            Label label = optionalLabel.get();

            label.setName(name);
            if (color == null || color.isEmpty()) {
                color = generateRandomColor();
            }
            label.setColor(color);
            return labelRepository.save(label);
        } catch (Exception e) {
            throw new ServiceException("Failed to update label", e);
        }
    }

    @Override
    public void deleteLabel(String id) throws ServiceException {
        try {
            Optional<Label> optionalLabel = labelRepository.findById(id);
            if (optionalLabel.isEmpty()) {
                throw new LabelNotFoundException("Label not found with id: " + id);
            }
            labelRepository.deleteById(id);
        } catch (Exception e) {
            throw new ServiceException("Failed to delete label", e);
        }
    }

    @Override
    public List<Label> getLabelsByCardId(String id) throws ServiceException {
        try {
            Optional<Card> cardOptional = cardRepository.findById(id);
            if (cardOptional.isPresent()) {
                Card card = cardOptional.get();
                return new ArrayList<>(card.getLabels());
            } else {
                throw new ServiceException("Card not found with id: " + id);
            }
        } catch (Exception e) {
            throw new ServiceException("Error while fetching labels for card with id: " + id, e);
        }
    }

    private String generateRandomColor() {
        Random random = new Random();
        int r = random.nextInt(256);
        int g = random.nextInt(256);
        int b = random.nextInt(256);
        return String.format("#%02x%02x%02x", r, g, b);
    }
}
