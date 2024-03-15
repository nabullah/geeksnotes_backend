const SDK = require("aws-sdk");
const fs = require("fs");

const BUCKET = "geeks-notes-bucket";
const ENDPOINT = "cellar-c2.services.clever-cloud.com/uploads";

SDK.config.update({
	accessKeyId: "7L348SLOX2591V1L9496",
	secretAccessKey: "qomjj8ZU0gEpClITWLfbexAsAr5IDtcN7EaCUtIw",
});

const uploadCleverCloudS3 = {
	uploadFile: async function (file, callback) {
		const s3 = new SDK.S3({ endpoint: ENDPOINT });
		const fileName = file.originalname;
		const bucketParams = {
			Bucket: BUCKET,
			Key: fileName,
			ACL: "public-read",
			Body: fs.createReadStream("uploads/" + file.filename),
			ContentType: file.mimetype,
		};
		// Upload the file to S3
		s3.upload(bucketParams, async (err, file) => {
			if (err) {
				console.log("Error uploading file >>>> :", err);
			} else {
				console.log("File uploaded successfully. File location:", file.Location);
				callback(file.Location);
			}
		});
	},

	getSignedUrl: async function (fileName, callback) {
		const s3 = new SDK.S3({ endpoint: ENDPOINT });
		s3.getSignedUrl("getObject", { Bucket: BUCKET, Key: "uploads" + fileName }, function (err, url) {
			if (err) {
			}
			if (url) callback(url);
		});
	},
};

module.exports = uploadCleverCloudS3;
