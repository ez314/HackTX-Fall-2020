# HackTX-Fall-2020
AI Scavenger Hunt

Devpost: https://devpost.com/software/cory-s-coriander-s-covid-combatant

## Inspiration
Online icebreaker activities have become more dull, unoriginal, and frustrating than ever before. We present *AI Scavenger Hunt*, a fun game that will build bonds between people, whether they're strangers or long-time friends. 

## What it does
AI Scavenger Hunt is a fully automated platform for playing virtual scavenger hunts. Players joining a lobby are automatically split off into teams. Once the game begins, they will each have 10 minutes to upload as many images as they can from a bank of 20 words, by taking pictures of things around the house. Unlike a traditional virtual scavenger hunt, where a moderator needs to accept or deny scavenger hunt entires, our game is graded by Google's [Vision AI](https://cloud.google.com/vision)!

## How we built it
The frontend of this project is built entirely out of HTML, CSS, and JS, and the backend is built with JS and Typescript on Node and Firestore. All components that handle gameplay are server-less! 

When a players joins a lobby, a request is sent to an endpoint hosted in Cloud Functions. The player is automatically placed then into that room, which will be created it if it doesn't already exist. Then, when the "play" button is pressed, the game begins for all players. 

Submissions are sent to another endpoint for grading by Vision AI. If a photo is accepted, everyone's scoreboard will also automatically update! 

## Challenges we ran into
We developed the front end using mobile device simulation in Chrome, but it turns out that actual mobile devices handle button presses and screen activity differently. For example, the upload button wouldn't trigger on mobile devices, and the webpage timer got paused when taking pictures on iOS devices. However, we were able to get these features to work by going through the documentation, finding the source of the errors, and designing fixes for them. 

## Accomplishments that we're proud of
This is a first hackathon for most of us, and we're proud of creating a fully-functional, working product! We had a lot of fun creating and playing AI Scavenger Hunt. 

## What we learned
We learned a lot about mobile-focused web development and using APIs to handle backend/frontend interactions. We also learned about the image-labelling capabilities of Google Vision AI.

## What's next for AI Scavenger Hunt?
A next step for us would be bringing this to two new platforms: native mobile apps and Discord. We especially feel like this product would be a great Discord bot feature, and players will already be using it to communicate with each other. 
