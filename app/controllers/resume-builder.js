'use strict';
const hbs = require('hbs');
const fs = require('fs');
const puppeteer = require('puppeteer');
require('date-utils');

let dirPath = __dirname + '/../../resume-builder/';
let pubPath = __dirname + '/../../public/';
let serverUrl = 'http://192.168.0.131:3000/';

if (process.env.NODE_ENV == 'stage') {
	serverUrl = 'https://admin-console-stepup.herokuapp.com/';
}

exports.createResume = (req, res) => {	
	const dt = new Date().toFormat('DD_MM_YY_SS');
	const tmppdf =  req.body.firstName + "_" +req.body.lastName + "_" + dt +'.pdf';
	const tempFile = req.body.firstName + "_" +req.body.lastName + "_" + dt +'.html';
	let tempUrl = 'resume1.html';

	console.log("req.body.templateId >>>", req.body.templateId);

	if (req.body.templateId == 2 || req.body.templateId == "2")	{
		tempUrl = 'resume2.html';
	}
	else if (req.body.templateId == 3 || req.body.templateId == "3") {
		tempUrl = 'resume3.html';
	}
	else if (req.body.templateId == 4 || req.body.templateId == "4") {
		tempUrl = 'resume4.html';
	}

	console.log("tempUrl >>>", tempUrl);

	if (req.body.isFresher == "true" || req.body.isFresher == true)	{
		req.body.isFresher = "true";
	} else	{
		req.body.isFresher = "";
	}

	req.body.dob = new Date(req.body.dob).toFormat('DD-MM-YYYY');
	
	fs.readFile(dirPath + tempUrl, 'utf8', function(err, htmlData) {
		const template = hbs.compile(htmlData);
		const compiledHTML = template(req.body || {});

		fs.writeFile(pubPath+tempFile, compiledHTML, (err) => {
			async function create(data) {
				const options = {
					printBackground: true,
					path: pubPath+tmppdf,
					margin : {
			            top: '30px',
			            bottom: '30px'
			        }
				};

				const browser = await puppeteer.launch({
					args: ['--no-sandbox'],
					ignoreDefaultArgs: ['--disable-extensions'],
					headless: true
				});

				const page = await browser.newPage();

				await page.goto(serverUrl+tempFile, { waitUntil: 'networkidle0' });
				await page.waitFor(5000);
				await page.pdf(options);
				await browser.close();

				setTimeout(() => {
					fs.unlinkSync(pubPath+tempFile);
				}, 1000);

				res.json({
					status: true,
					file: serverUrl+tmppdf,
					fileName: tmppdf
				});
			}

			create();
		});
	});
}


exports.downloadResume = (req, res) => {
	fs.unlinkSync(pubPath+req.body.file);
	res.json(true);
}


exports.getTemplate = (req, res) => {
	const resumeD = require('../resume-maker-template.json');
	res.json(resumeD);
}


exports.getRTOdata = (req, res) => {
	const language = require('../RTO/language.json');
	const material = require('../RTO/material.json');
	const question = require('../RTO/question.json');
	const state = require('../RTO/state.json');

	res.json({
		language: language,
		material: material,
		question: question,
		state: state
	});
}


exports.getAppcleanerdata = (req, res) => {
	const resumeD = require('../appcleaner/appcleaner.json');
	res.json(resumeD);
}