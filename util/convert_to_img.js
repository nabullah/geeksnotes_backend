const uploadToServer = require("./clever-cloud-s3");
const { load } = require('@pspdfkit/nodejs');
const axios = require('axios');
const fs = require('fs');
const { fromBuffer } = require('pdf2pic');

async function getPdf(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching PDF:", error);
        throw error;
    }
}
const convertPDF = {
    toJPEG: (async (path) => {
        return new Promise(async (resolve, reject) => {
            // const pageToConvertAsImage = 1;
            // const options = {
            //     density: 100,
            //     saveFilename: new Date().getMilliseconds() + '.png',
            //     savePath: './uploads/thumbnails/',
            //     format: 'png',
            //     width: 600,
            //     height: 600,
            // };
            // const doc = await getPdf(path);
            // const convert = fromBuffer(doc, options).setGMClass('C:\Program Files\GraphicsMagick-1.3.43')

            // try {
            //     const result = await convert(pageToConvertAsImage);
            //     console.log('Conversion success:', result);
            //     resolve(result);
            //     // return result;
            // } catch (error) {
            //     console.error('Conversion error:', error);
            //     reject(error);
            // }

            // const doc = await getPdf(path);
            const doc1 = fs.readFileSync('uploads/pdf-sample (1).pdf');
            const instance = await load({ document: doc1 });
            const pageWidth = instance.getDocumentInfo().pages[0].width;
            console.log("insidepdf - > ", pageWidth);
            const result = await instance.renderPage(0, { width: pageWidth });

            console.log("insidepdf - > ", result);
            if (result) {
                resolve(result);
                await uploadToServer.uploadFile(Buffer.from(result), (data) => {
                    console.log("insidepdf --aws- > ", data);
                });
            } else {
                reject("Error converting pdf to jpeg");
            }
            // fs.writeFileSync('image.png', Buffer.from(result));
            instance.close();
        })
    })

}

module.exports = convertPDF;


// const doc = await getPdf(path);
// const instance = await load({ document: doc });
// const pageWidth = instance.getDocumentInfo().pages[0].width;
// console.log("insidepdf - > ", pageWidth);
// const result = await instance.renderPage(0, { width: pageWidth });

// console.log("insidepdf - > ", result);
// if (result) {
//     resolve(result);
//     await uploadToServer.uploadFile(Buffer.from(result), (data) => {
//         console.log("insidepdf --aws- > ", data);
//     });
// } else {
//     reject("Error converting pdf to jpeg");
// }
// // fs.writeFileSync('image.png', Buffer.from(result));
// instance.close();