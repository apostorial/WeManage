package ma.wemanity.wmbackend.services;

import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service @AllArgsConstructor
public class FileServiceImpl implements FileService {
    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;

    @Override
    public ObjectId storeFile(MultipartFile file) throws IOException {
        return gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType()
        );
    }

    @Override
    public GridFSFile getFile(ObjectId id) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
    }

    @Override
    public GridFSFile getCardFile(ObjectId fileId) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(fileId)));
    }

    @Override
    public void deleteFile(ObjectId id) {
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(id)));
    }

    @Override
    public byte[] getFileData(GridFSFile file) throws IOException {
        GridFsResource resource = gridFsOperations.getResource(file);
        try (InputStream inputStream = resource.getInputStream()) {
            return inputStream.readAllBytes();
        }
    }
}
