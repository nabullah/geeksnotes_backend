const uploadToServer = require("./clever-cloud-s3");
const axios = require("axios");
const fs = require("fs");
const { fromBuffer } = require("pdf2pic");

async function getPdfFromURL(url) {
	try {
		const response = await axios.get(url, {
			responseType: "arraybuffer",
		});
		return response.data;
	} catch (error) {
		// console.error("\x1b[33m%s\x1b[0m","Error fetching PDF:", error);
		throw error;
	}
}

const convertPDF = {
	toJPEG: async (path) => {
		return new Promise(async (resolve, reject) => {
			const pageToConvertAsImage = 1;
			const options = {
				density: 300,
				// saveFilename: Date.now().toString(),
				saveFilename: path.substring(path.lastIndexOf("/") + 1, path.length),
				savePath: "./uploads/cache-s3/",
				format: "png",
				width: 600,
				height: 800,
			};
			let doc;
			let path2 = path.includes("https");
			if (path2) {
				doc = await getPdfFromURL(path);
			} else {
				doc = await getPdfFromURL("https://" + path);
			}
			const convert = fromBuffer(doc, options);

			try {
				const result = await convert(pageToConvertAsImage);
				const convertedFile = {
					originalname: result.name,
					mimetype: result.name.substring(result.name.lastIndexOf("."), result.name.length),
					filename: result.name,
				};

				const thumbnail = await uploadToServer.uploadFile(convertedFile);
				console.log("\x1b[36m%s\x1b[0m", "Thumbnail uploaded successfully:", thumbnail);
				resolve(thumbnail);
			} catch (error) {
				console.error("\x1b[33m%s\x1b[0m", "Conversion error:", error);
				// reject(error);
				resolve(null);
			}
		});
	},
};

module.exports = convertPDF;
