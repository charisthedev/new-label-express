// Step 1: Import the S3Client object and all necessary SDK commands.
const { PutObjectCommand, S3Client, GetObjectCommand } =  require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')


// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
const s3Client = new S3Client({
    endpoint: "https://sfo3.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: "us-east-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
      accessKeyId: "DO00TX6JWBLNB7TQAHJU", // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: "lvOLCpCAn3h96KDjoTbrLcclrYje0f/irgIhNkVIGvI" // Secret access key defined through an environment variable.
    }
});


// Step 4: Define a function that uploads your object using SDK's PutObjectCommand object and catches any errors.
const uploadObject = async (fileBuffer, fileName, folder) => {
  try {
    const params = {
      Bucket: "newlabel-videos", // The path to the directory you want to upload the object to, starting with your Space name.
      Key: `${folder}/${fileName}`, // Object key, referenced whenever you want to access this file later.
      Body: fileBuffer, // The object's contents. This variable is an object, not a string.
      ACL: "private", // Defines ACL permissions, such as private or public.
      Metadata: { // Defines metadata tags.
        "x-amz-meta-my-key": ""
      }
    };
    await s3Client.send(new PutObjectCommand(params));

    const command = {
      Bucket: params.Bucket,
      Key: params.Key,
    };

    const fileUrl = await getSignedUrl(s3Client, new GetObjectCommand(command))

    return fileUrl
  } catch (err) {
    console.log("Error", err);
  }
};


module.exports = uploadObject
