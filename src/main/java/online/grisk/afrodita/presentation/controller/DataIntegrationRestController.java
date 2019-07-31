package online.grisk.afrodita.presentation.controller;


/*import com.example.filedemo.component.RTHandlerError;
import com.example.filedemo.payload.UploadFileResponse;
import com.example.filedemo.service.FileStorageService;*/

import online.grisk.afrodita.domain.dto.DataIntegrationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;

@RestController
public class DataIntegrationRestController {

    private static final Logger logger = LoggerFactory.getLogger(DataIntegrationRestController.class);

    @Autowired
    private RestTemplate restTemplate;

    /*Autowired
    private FileStorageService fileStorageService;*/

    @PostMapping("/v1/dataintegration")
    public HttpEntity uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("organization") long organization) {

        try {
            MultiValueMap<String, String> fileMap = new LinkedMultiValueMap<>();
            ContentDisposition contentDisposition = ContentDisposition.builder("form-data").name("file").filename(file.getOriginalFilename()).build();

            fileMap.add(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString());

            HttpEntity<byte[]> fileEntity = new HttpEntity<>(file.getBytes(), fileMap);
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            body.add("file", fileEntity);
            body.add("organization", organization);
            body.add("enabled", true);
            body.add("bureau", true);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBasicAuth("artemisa", "GRisk.2019");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String serverUrl = "http://artemisa/dataIntegrations";

            ResponseEntity<String> response = this.restTemplate.postForEntity(serverUrl, requestEntity, String.class);

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

       /* String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/downloadFile/")
                .path(fileName).toUriString();
*/
//        return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize());
        return new HttpEntity(HttpStatus.OK);
    }

    /*@PostMapping("/uploadMultipleFiles")
    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        return Arrays.asList(files).stream().map(file -> uploadFile(file)).collect(Collectors.toList());
    }

    @GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
*/


}

