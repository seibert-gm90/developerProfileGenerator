const fs = require("fs");
const util = require("util");
const axios = require("axios");
const inquirer = require("inquirer");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

const writeFileAsync = util.promisify(fs.writeFile);


function userPrompt(){
    return inquirer.prompt([
        {
            message: "Enter your GitHub username",
            name: "username",
        },

        {
            message: "What is your favorite color?",
            name: "color",

        }
    ])
}



async function generateProfile(){
    try {
        const userInput = await userPrompt();

        const ghRes = await axios.get(
            `https://api.github.com/users/${userInput.username}`
            );

            // console.log(queryUrl)
        

        const ghstarsqueryURL = await axios.get(
            `https://api.github.com/users/${userInput.username}/starred`
            );
            
            console.log(ghstarsqueryURL)

        const html = makeHTML(ghRes, userInput, ghstarsqueryURL);

        
    await writeFileAsync(`profile_${userInput.username}.html`, html);
    console.log(`Successfully wrote profile_${userInput.username}.html`);

    // Creation of .pdf file

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    await page.emulateMediaFeatures("screen");
    await page.pdf({
      path: `profile_${userInput.username}.pdf`,
      format: "A4",
      printBackground: true
    });

    console.log(`Successfully wrote profile_${userInput.username}.pdf`);
    await browser.close();
    process.exit();
  } catch (err) {
    console.log(err);
  }
}
    generateProfile()

function makeHTML(ghRes, userInput, ghstarsqueryURL) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Deleloper Profile Generator</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <script src="index.js"></script>
    
    </head>
    
    <body>
        <header>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <div class="card dark">
                            <img src="${ghRes.data.avatar_url}" height="175" />
                            <h1>${ghRes.data.name}</h1>
                            <p class="header-links d-flex justify-content-center flex-wrap">
                                <a href="https://www.google.com/maps/place/${ghRes.data.location}">
                                    ${ghRes.data.location}
                                </a>
                                <a href="${ghRes.data.userProfile}">Gabby's GitHub </a>
                                <a href="${ghRes.data.blog}"></a>
                            </p>
                        </div>
                    </div>
                </div>
        </header>
        <div class="row">
            <div class="col">
                <p>${ghRes.data.bio}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body " id="public-repos">
                        <h5>Repos</h5>
                        <p>${ghRes.data.public_repos}</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-body " id="followers">
                        <h5>Followers</h5>
                        <p>${ghRes.data.followers}</p>
                    </div>
                </div>
            </div>
    
            <div class="row">
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-body " id="gh-stars">
                            <h5>GitHub</h5>
                            <p>${ghstarsqueryURL.data.length}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card">
                        <div class="card-body " id="following">
                            <h5>Following</h5>
                            <p>${ghRes.data.following}</p>
                        </div>
                    </div>
                </div>
            </div>
    
    
    </body>
    
    </html>`
}
        
                                                    
                                                                        
