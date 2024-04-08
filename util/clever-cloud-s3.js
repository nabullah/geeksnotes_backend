const SDK = require("aws-sdk");
const fs = require("fs");

const BUCKET = "geeks-notes-bucket";
const ENDPOINT = "cellar-c2.services.clever-cloud.com/uploads";

SDK.config.update({
	accessKeyId: "7L348SLOX2591V1L9496",
	secretAccessKey: "qomjj8ZU0gEpClITWLfbexAsAr5IDtcN7EaCUtIw",
});

const uploadCleverCloudS3 = {
	uploadFile: async function (file) {
		return new Promise((resolve, reject) => {
			const s3 = new SDK.S3({ endpoint: ENDPOINT });
			const fileName = file.originalname;
			const filePath = "uploads/cache-s3/" + file.filename;
			const bucketParams = {
				Bucket: BUCKET,
				Key: fileName,
				ACL: "public-read",
				Body: fs.createReadStream(filePath),
				ContentType: file.mimetype,
			};
			
			// Upload the file to S3
			s3.upload(bucketParams, (err, uploadedFile) => {
				if (err) {
					console.log("Error uploading file >>>> :", err);
					reject(err);
				} else {
					fs.unlink(filePath, (unlinkErr) => {
						if (unlinkErr) {
							console.log("Error deleting file from local filesystem:", unlinkErr);
							resolve(uploadedFile.Location);
						} else {
							console.log("File deleted from local filesystem.");
							resolve(uploadedFile.Location);
						}
					});
					console.log("File uploaded successfully. File location:", uploadedFile.Location);
					resolve(uploadedFile.Location);
				}
			});
		});
	},

	getSignedUrl: async function (fileName, callback) {
		const s3 = new SDK.S3({ endpoint: ENDPOINT });
		s3.getSignedUrl("getObject", { Bucket: BUCKET, Key: "uploads" + fileName }, function (err, url) {
			if (url) callback(url);
			if (err) {
			}
		});
	},
};

module.exports = uploadCleverCloudS3;
