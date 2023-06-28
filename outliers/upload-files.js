const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const Video = require("../models/videoModel");
// Step 1: Import the S3Client object and all necessary SDK commands.
const {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} = require("@aws-sdk/client-s3");

// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
const s3Client = new S3Client({
  endpoint: "https://sfo3.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: "us-east-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
  credentials: {
    accessKeyId: "DO00TX6JWBLNB7TQAHJU", // Access key pair. You can create access key pairs using the control panel or API.
    secretAccessKey: "lvOLCpCAn3h96KDjoTbrLcclrYje0f/irgIhNkVIGvI", // Secret access key defined through an environment variable.
  },
});

// Step 4: Define a function that uploads your object using SDK's PutObjectCommand object and catches any errors.
const uploadImage = async (fileBuffer, fileName, folder) => {
  try {
    const params = {
      Bucket: "newlabel-videos", // The path to the directory you want to upload the object to, starting with your Space name.
      Key: `image/${fileName}`, // Object key, referenced whenever you want to access this file later.
      Body: fileBuffer, // The object's contents. This variable is an object, not a string.
      ACL: "private", // Defines ACL permissions, such as private or public.
      Metadata: {
        // Defines metadata tags.
        "x-amz-meta-my-key": "",
      },
    };
    await s3Client.send(new PutObjectCommand(params));

    const command = {
      Bucket: params.Bucket,
      Key: params.Key,
    };

    const fileUrl = await getSignedUrl(s3Client, new GetObjectCommand(command));

    return fileUrl;
  } catch (err) {
    console.log("Error", err);
  }
};

const uploadVideo = async (fileBuffer, fileName) => {
  try {
    const params = {
      Bucket: "newlabel-videos", // The path to the directory you want to upload the object to, starting with your Space name.
      Key: `video/${fileName}`, // Object key, referenced whenever you want to access this file later.
      Body: fileBuffer, // The object's contents. This variable is an object, not a string.
      ACL: "private", // Defines ACL permissions, such as private or public.
      Metadata: {
        // Defines metadata tags.
        "x-amz-meta-my-key": "",
      },
    };
    await s3Client.send(new PutObjectCommand(params));

    const command = {
      Bucket: params.Bucket,
      Key: params.Key,
    };

    const fileUrl = await getSignedUrl(s3Client, new GetObjectCommand(command));
    const newVideo = new Video({ link: fileUrl });
    return await newVideo
      .save()
      .then((link) => {
        return link._id;
      })
      .catch((err) => {
        // console.log(err);
      });
    // return fileUrl;
  } catch (err) {
    console.log("Error", err);
  }
};

// const uploadVideo = async (filename, folder) => {
//   const file = fs.readFileSync(filename)
//   const fileStream = file.buffer;
//   console.log(file);
//   // Assuming you are using multer or similar middleware for file upload
//   const fileSize = file.size;
//   const bucketName = "newlabel-videos";
//   const objectKey = `${folder}/${file.originalname}`; // Change the objectKey as per your requirements

//   const chunkSize = 10 * 1024 * 1024; // 10MB chunk size

//   const params = {
//     Bucket: bucketName,
//     Key: objectKey,
//   };

//   // Step 1: Initiate the multipart upload
//   const { UploadId } = await s3Client.send(
//     new CreateMultipartUploadCommand(params)
//   );

//   const parts = [];

//   let start = 0;
//   let partNumber = 1;

//   try {
//     while (start < fileSize) {
//       const end = Math.min(start + chunkSize, fileSize);

//       // Step 2: Upload each chunk
//       const uploadParams = {
//         ...params,
//         PartNumber: partNumber,
//         UploadId: UploadId,
//         Body: fileStream.slice(start, end),
//         contentLength: fileStream.slice(start, end).length,
//       };

//       const { ETag } = await s3Client.send(new UploadPartCommand(uploadParams));

//       parts.push({ ETag, PartNumber: partNumber });

//       start = end;
//       partNumber++;
//     }

//     // Step 3: Complete the multipart upload
//     const completeParams = {
//       ...params,
//       UploadId: UploadId,
//       MultipartUpload: {
//         Parts: parts,
//       },
//     };

//     await s3Client.send(new CompleteMultipartUploadCommand(completeParams));
//     const command = new GetObjectCommand(params);
//     const fileUrl = await getSignedUrl(s3Client, command);
// const newVideo = new Video({ link: fileUrl });
// return await newVideo
//   .save()
//   .then((link) => {
//     return link._id;
//   })
//   .catch((err) => {
//     // console.log(err);
//   });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     // res.status(500).json({ error: "Error uploading file" });
//   }
// };

module.exports = { uploadImage, uploadVideo };
