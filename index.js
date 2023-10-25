#! /usr/bin/env node
import axios from 'axios';
const OPEN_AI_URL = 'https://api.openai.com/v1/images/generations';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
import ora from 'ora';
import chalk from 'chalk';

import terminalImage from 'terminal-image';
// const promptText = `A realistic and natural photo of a girl on a hill or mountain top watching the sunrise with her friend. In studio gibli style`;
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
const args = yargs(hideBin(process.argv)).parse()

yargs(hideBin(process.argv))

async function sendRequestToOpenAI({ promptText }) {
  return axios.post(
    OPEN_AI_URL,
    {
      prompt: promptText,
      n: 1
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    }
  );
}
async function run() {
  if(!args.p){
    throw new Error('Please provide a prompt');
  }

  const spinner = ora({text:`${chalk.blue('Generating image(s)...')}`, spinner: 'runner'}).start();
  const img = await sendRequestToOpenAI({ promptText: args.p });
  spinner.succeed('Your image is now ready');
  const imgUrl = img.data.data;
  for (const url of imgUrl) {
    const response = await axios.get(url.url, { responseType: 'arraybuffer' });
    console.log(await terminalImage.buffer(response.data, { width: '50%', height: '50%' }));
  }
}

run()
  .then(res => console.log(res))
  .catch(err => console.log(err));
