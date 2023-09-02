const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios')
const cliProgress = require('cli-progress');

/**
1.change lastEpisode.
2.set url to the first episode.
3.change datasheet.
*/

let LAST_EPISODE = 56;
let url = 'https://www.imdb.com/title/tt9817604/?ref_=ttep_ep1';
let urlPrefix = 'https://www.imdb.com/';
let datasheet = './datas/SellingSunsetData.csv'
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

bar.start(LAST_EPISODE, 1);

const axiosConfig = {
  method: 'get',
  maxBodyLength: Infinity,
  headers: { 
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
  },
}

fs.appendFileSync(datasheet, 'episode,score\n');

const fetchData = async (episodeCount, episodeURL) => {
  bar.update(episodeCount)
  const res = await axios({
    ...axiosConfig,
    url: episodeURL
  });
  const $ = cheerio.load(res.data);
  const score = $('span.sc-bde20123-1').html();
  fs.appendFileSync(datasheet, `${episodeCount},${score}\n`, res);
  return urlPrefix + $('a[data-testid="hero-subnav-bar-next-episode-button"]').attr('href');
}

const main = async () => {
  let startingEpisode = 1
  while (startingEpisode <= LAST_EPISODE) {
    url = await fetchData(startingEpisode, url)
    startingEpisode += 1
  }
}

main()
  .then(() => {
  bar.stop()
})
