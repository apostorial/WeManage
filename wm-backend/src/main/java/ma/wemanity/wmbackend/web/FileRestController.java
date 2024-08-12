package ma.wemanity.wmbackend.web;

import com.mongodb.client.gridfs.model.GridFSFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import ma.wemanity.wmbackend.entities.Card;
import ma.wemanity.wmbackend.exceptions.ServiceException;
import ma.wemanity.wmbackend.repositories.CardRepository;
import ma.wemanity.wmbackend.services.CardService;
import ma.wemanity.wmbackend.services.FileService;
import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.springframework.core.io.Resource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController @AllArgsConstructor @RequestMapping("/api/files")
public class FileRestController {
    private final FileService fileService;
    private final GridFsTemplate gridFsTemplate;
    private final CardService cardService;
    private final CardRepository cardRepository;

    @PostMapping(value = "/card/{cardId}/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a file for a card", responses = {
            @ApiResponse(responseCode = "200", description = "File uploaded successfully"),
            @ApiResponse(responseCode = "500", description = "Failed to upload file")
    })
    public ResponseEntity<String> uploadFile(@PathVariable String cardId, @RequestParam("file") MultipartFile file) {
        try {
            Card card = cardService.getCard(cardId);

            if (card.getFile() != null) {
                fileService.deleteFile(card.getFile());
            }

            ObjectId fileId = fileService.storeFile(file);

            card.setFile(fileId);
            cardRepository.save(card);

            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        } catch (ServiceException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileId) throws IOException {
        GridFSFile file = fileService.getCardFile(new ObjectId(fileId));
        if (file == null) {
            return ResponseEntity.notFound().build();
        }

        GridFsResource resource = gridFsTemplate.getResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resource.getContentType()))
                .body(IOUtils.toByteArray(resource.getInputStream()));
    }

    @GetMapping("download/card/{cardId}")
    public ResponseEntity<Resource> getCardFile(@PathVariable String cardId) throws IOException {
        try {
            Card card = cardService.getCard(cardId);
            if (card.getFile() == null) {
                return ResponseEntity.notFound().build();
            }

            GridFSFile file = fileService.getFile(card.getFile());
            if (file == null) {
                return ResponseEntity.notFound().build();
            }

            GridFsResource resource = gridFsTemplate.getResource(file);
            assert file.getMetadata() != null;
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(file.getMetadata().get("_contentType").toString()))
                    .contentLength(file.getLength())
                    .body(resource);
        } catch (ServiceException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/card/{cardId}/filename")
    public ResponseEntity<String> getCardFilename(@PathVariable String cardId) {
        try {
            Card card = cardService.getCard(cardId);
            if (card.getFile() == null) {
                return ResponseEntity.notFound().build();
            }

            GridFSFile file = fileService.getFile(card.getFile());
            if (file == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(file.getFilename());
        } catch (ServiceException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
