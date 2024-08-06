package ma.wemanity.wmbackend.services;

import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.*;
import ma.wemanity.wmbackend.exceptions.LabelNotFoundException;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.CardRepository;
import ma.wemanity.wmbackend.repositories.LabelRepository;
import ma.wemanity.wmbackend.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service @AllArgsConstructor
public class LabelServiceImpl implements LabelService {
    private final LabelRepository labelRepository;
    private final CardRepository cardRepository;
    private final UserRepository userRepository;

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
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            OAuth2User principal = (OAuth2User) authentication.getPrincipal();
            String email = principal.getAttribute("email");
            User authenticatedUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ServiceException("Authenticated user not found"));

            Label label = new Label();
            label.setName(name);
            label.setColor(color);
            label.setOwner(authenticatedUser);
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

    @Override
    public List<Label> getLabelsByAuthenticatedUser() throws ServiceException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String email = principal.getAttribute("email");
        User authenticatedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ServiceException("Authenticated user not found"));

        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + authenticatedUser.getId()));
        return labelRepository.findByOwnerId(user.getId());
    }
}
