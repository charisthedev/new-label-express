// Step 1: Import the S3Client object and all necessary SDK commands.
const { PutObjectCommand, S3Client } =  require('@aws-sdk/client-s3');


// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
const s3Client = new S3Client({
    endpoint: "https://newlabel-videos.sfo3.digitaloceanspaces.com", // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: "us-east-1", // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
      accessKeyId: "DO00LBXV7PU828893VN7", // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: process.env.SPACES_SECRET // Secret access key defined through an environment variable.
    }
});


// Step 4: Define a function that uploads your object using SDK's PutObjectCommand object and catches any errors.
const uploadObject = async (fileBuffer, fileName) => {
  try {
    const params = {
      Bucket: "newlabel-videos", // The path to the directory you want to upload the object to, starting with your Space name.
      Key: `videos/${fileName}`, // Object key, referenced whenever you want to access this file later.
      Body: fileBuffer, // The object's contents. This variable is an object, not a string.
      ACL: "private", // Defines ACL permissions, such as private or public.
      Metadata: { // Defines metadata tags.
        "x-amz-meta-my-key": "your-value"
      }
    };
    return await s3Client.send(new PutObjectCommand(params));
  } catch (err) {
    console.log("Error", err);
  }
};


module.exports = uploadObject
