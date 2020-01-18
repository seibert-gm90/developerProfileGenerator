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
        const queryUrl = `https://api.github.com/users/${username}/repos?per_page=100/`;



        axios.get(queryUrl).then(function (res) {
            console.log(res.data);
        });
    });