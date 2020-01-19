const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

inquirer
    .prompt([
        {
            message: "Enter your GitHub username",
            name: "username",
        },

        {
            message: "What is your favorite color?",
            name: "favoriteColor",

        }
    ])
    .then(function ({ username, favoriteColor }) {
        const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl).then(function (res) {
            // console.log(res);
            // console.log(Object.keys(res));     
            console.log(res.data);       


            let profile = {
                followers: res.data.followers,
                following: res.data.following,
                location: res.data.location,
                blog: res.data.blog,
                userProfile: res.data.html_url,
                profileImage: res.data.avatar_url,
                userName: res.data.login,
                stars: res.data.starred_url,
                bio: res.data.bio,
                publicRepos: res.data.public_repos
            }
            makeHTML(profile);
        });

    });

function makeHTML(profile) {
    
    console.log(profile)
}

