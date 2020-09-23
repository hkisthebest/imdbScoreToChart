const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const cliProgress = require('cli-progress');

let episode = 0, lastEpisode = 25;
let lowestScore = Infinity;
let highestScore = 0;
let url = 'https://www.imdb.com/title/tt4593118';
let urlPrefix = 'https://www.imdb.com/';
let datasheet = './datas/StrangerThingsData.csv'
const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
 
// start the progress bar with a total value of 200 and start value of 0
bar.start(lastEpisode, episode);
 

fs.appendFileSync(datasheet, 'episode,score\n');

function fetchData(url){
    if(episode < lastEpisode){
	fetch(url)
	    .then(res => res.text())
	    .then(body => {
		let $ = cheerio.load(body);
		let score = $('span[itemprop=ratingValue]').html();
		//let season = $('.bp_heading').first().text();
		url = urlPrefix + $('div .np_next').attr('href');
		episode++;
		// update the current value in your application..
		bar.update(episode);
		//let regex = /\d+/;
		//season = season.match(regex)[0];
		//console.log(season);
		fetchData(url);
		fs.appendFileSync(datasheet, `${episode},${score}\n`);
	    })
	    .catch(err => {
		throw err;
	    });
    }else{
	bar.stop();
    }

    return;
}

fetchData(url);

