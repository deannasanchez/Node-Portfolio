const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

var object

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            type: "checkbox",
            name: "colors",
            message: "What is your favorite color?",
            choices: ["green", "blue", "red", "pink"]
        },
        {
            type: "input",
            name: "github",
            message: "Enter your GitHub Username"
        }
    ]);
}

async function gitHubInfo(username) {
    try {
        const queryUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(queryUrl)
        const user = response.data;
        const stars = await getStars(`${queryUrl}/starred`);
        const github = {
            name: user.name,
            company: user.company,
            blog: user.blog,
            bioImg: user.avatar_url,
            location: user.location,
            link: user.html_url,
            numRepos: user.public_repos,
            stars,
            followers: user.followers,
            email: user.email
        }
        console.log(github);
        return github;
    } catch (err) {
        console.log(err);
    }
 }
 function getStars(url) {
    return axios.get(url).then(response => response.data.map(({ name }) => name).length);
 }

//gitHubInfo("deeannalynn");

function generateHTML(answers) {
    console.log(answers)
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container" style="background-color: ${answers.colors};">
    <h1 class="display-4">Hi! My name is Dee</h1>
    <img src="${github.use.avatar_url}" alt="github avatar" height="100" width="100">
    <h3>Example heading <span class="badge badge-secondary">Github Information</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${github.name}</li>
    </ul>
    <p>Number of Repos: ${github.numRepos}</p>
    <p>Numer of Stars: ${github.stars}</p>
  </div>
</div>
</body>
</html>`;
}

promptUser()
    .then(async function (answers) {
        try {
            const githubbers = await gitHubInfo(answers.github);
            console.log("githubbers", githubbers);
            // console.log("test", githubbers);
           const html = generateHTML(githubbers);

           return writeFileAsync("index.html", html);

        } catch (err) {
            console.log(err)
        }
    })
    .then(function () {
        console.log("Successfully wrote to index.html");
    })
    .catch(function (err) {
        console.log(err);
    });
