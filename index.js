import axios from 'axios';
const OPEN_AI_URL = 'https://api.openai.com/v1/images/generations';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
import terminalKit from 'terminal-kit';
const { terminal } = terminalKit;
const LOCAL_IMAGE_PATH = 'image.png'; // Local file path to save the image
import fs from 'fs';

const asyncFs = fs.promises;
import Table from 'cli-table';

import terminalImage from 'terminal-image';
const promptText = `A realistic and natural photo of a girl on a hill or mountain top watching the sunrise with her friend. In studio gibli style`
console.log(promptText.length)
async function run() {
  const img = await axios.post(
    OPEN_AI_URL,
    {
      prompt: promptText,
      n : 2
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    }
  );

   const imgUrl = img.data.data;
    const imageBufferArr =[];
  console.log(imgUrl);
  const table = new Table({head: ['img1', 'img2']});
    for(const url of imgUrl){
        const response = await axios.get(url.url, { responseType: 'arraybuffer' });
        //imageBufferArr.push(Buffer.from(response.data, 'binary'));
        imageBufferArr.push( await terminalImage.buffer(response.data, {width:'50%', height: '50%'}));

    }
    table.push(imageBufferArr);
    console.log(table.toString());
    const combinedImageBuffer = Buffer.concat(imageBufferArr);

    //console.log(await terminalImage.buffer(combinedImageBuffer, {width:'50%', height: '50%'}));


}

run()
  .then(res => console.log(res))
  .catch(err => console.log(err));
