import * as vision from '@google-cloud/vision';

const funct = (name: string) => {
    console.log(`hello ${name}`);
    return 1;
}

//console.log(funct("CORY"));


async function quickstart() {
    // Imports the Google Cloud client library
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient({
        projectId: 'hacktx-293504',
        keyFilename: './resources/hackTX-530b5ef44e8b.json',
    });
  
    try {
        // Performs label detection on the image file
        //const [result] = await client.labelDetection('./resources/shutterstock_788608396.0.jpg');
        const [result] = await client.labelDetection('https://media.discordapp.net/attachments/769391905863237655/769430797064208384/your_name_background.jpg');
        const labels = result.labelAnnotations;
        //console.log('Labels:');
        console.log(JSON.stringify(labels, null, 2));



        //labels?.forEach(label => console.log(label.description));
    }
    catch (e) {
        console.log(e);
    }
}

quickstart();