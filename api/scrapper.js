// STATEMENT OF REQUIRED LIBRARIES
var request = require('request');
var cheerio = require('cheerio');

// STATEMENT OF VARIABLES
var category = new Array('Design', 'Développement', 'Seo', 'Projets', 'Marketing', 'Réseau', 'Autre');
var jobTitle = "";
var company = "";
var localisation = "";
var jobCategory = "";
var description = "";
var contract = "";
var releaseDate = "";
var tags = new Array();

// SCRAPPING ALGORITHM OF REMIXJOBS

// FIRST LOOP : READING OF THE CATEGORIES
for (var i = 0; i < category.length; i++) {
	// CORRECTION OF ACCENTS IN THE URL
	var URLcategory = category[i].replace('é','%C3%A9');
	// SECOND LOOP : READING OF THE DIFFERENT PAGES
	for (var j = 1; j < 10; j++) {
		// URL CONSTRUCTION
		var link = 'http://remixjobs.com/?in=' + URLcategory + '&page=' + j.toString();
		// ACCESS QUERY
		request(link,function(err, response, body){
			if(!err){
				// SCRAPPING WITH CHEERIO (JQuery)
				var $ = cheerio.load(body);
				jobs = $('div.job-infos');

				// RETRIEVAL OF EACH JOB'S ELEMENTS
				jobs.each(function(i, job) {
					jobTitle = $(job).children('.job-title').children('.job-link').text();
					// STORAGE OF THE URL OF DESCRIPTION FOR FURTHER READING
					var URLdescription = 'http://remixjobs.com' + $(job).children('.job-title').children('.job-link').attr('href');
					company = $(job).children('.job-details').children('.job-details-left').children('.company').text();
					localisation = $(job).children('.job-details').children('.job-details-left').children('.workplace').text();
					jobcategory = category[0];
					contract = $(job).children('.job-title').next().text();
					releaseDate = $(job).children('.job-details').children('.job-details-right').text();
					// STORAGE IN AN ARRAY OF ALL TAGS
					tags = new Array();
					var listTags = $(job).children('.job-tags').children().each(function(j, tag){
						tags.push($(tag).text().replace(/\n/g,'').replace(/ /g,''));
					});
					// STORAGE OF THE CURRENT JOB IN AN OBJECT
					var itemJob = new Object();
					itemJob =
					{
						title : jobTitle,
						company : company,
						localization : localisation,
						category : jobcategory,
						description: description,
						contract : contract.replace(/\n/g,'').replace(/ /g,''),
						date : releaseDate,
						tags : tags
					};

					// ACCESS OF CURRENT JOB'S DESCRIPTION
					request(URLdescription,function(err, response, body){
						if(!err){
							var $ = cheerio.load(body);
							var desc = $('div.job-description');
							var description = "";
							// THERE IS LOTS OF DIV BLOCK CONTAINING THE DESCRITPION
							// SO WE STORE IT IN A VARIABLE
							var texts = $(desc).children().each(function(k, text) {
								description += $(text).text(); 
							});
							// PUT THE DESCRIPTION IN THE OBJECT ITEMJOB
							itemJob.description = description;

							// QUERY TO FILL THE DATABASE
							request({
									url: 'http://localhost:3000/api/jobs',
									method: 'POST',
									json : itemJob
								});
						}
						else {
							console.log("ERROR : " + err);
						}
					});
					
				});
			}
			else{
				console.log("ERROR : " + err);
				// BREAK HERE IF THE THE PAGE NUMBER DOESN'T EXIST
				break;
			}
		})
	};
};



