# Remixjobs

> Unofficial Remixjobs API

## Introduction

[RemixJobs](https://remixjobs.com/) is the best French job board for the Web Industry.

Today, no (un)official API was developed to allow developers to add jobs in their web application

## Stack

* Node.js
* Express 4
* MongoDB
* Postman

## Instructions

Before you do anything, start mongodb on your terminal.
Then, start the scrapping process, by typing "node scrapper.js".
Once it is finished, you can start the API server by typing "node server.js".
TADA ! Now you can try out some of the requests via postman.

>http://localhost:3000/api

### /jobs

* Return all jobs
* Create a new job
* Return information of a job
* Update a job
* Search for specific jobs by entering url parameters

### /jobs/latest

* Return the 20 last jobs in the database

### /companies

* Return all companies

### /companies/:company_name/jobs
* Return all jobs of a the given company

## Licence

[Uncopyrighted](http://zenhabits.net/uncopyright/)
