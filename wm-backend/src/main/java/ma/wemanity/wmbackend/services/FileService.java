package ma.wemanity.wmbackend.services;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {
    ObjectId storeFile(MultipartFile file) throws IOException;
    GridFSFile getFile(ObjectId id);
    GridFSFile getCardFile(ObjectId fileId);
    void deleteFile(ObjectId id);
}
