## Description

A simple demo of an autonomous agent that researches a given topic, drafts a blog post on the subject and iteratively revises the post before delivering a final version by utilising LangChain, a powerfull framework to construct LLM‑powered apps easily and LangGrpah, a library for building stateful, multi-actor applications with LLMs.

This demo has basic setup and have a single endpoint that takes the topic and email as an input and sends the blog post in the email

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Update Env file with required details
```env
OPENAI_API_KEY="YOUR API KEY HERE"
EMAIL="YOUR EMAIL HERE"
EMAIL_PASSWORD="YOUR PASSWORD HERE"
```

## NOTE:
For receiving the email, need to have a gmail account with less secure app access enabled

## Calling API
There is a single route that generates the Blog Post. You nee to call the "/generateOutline"

```bash
curl --location 'http://localhost:4000/generateOutline' \
--header 'Content-Type: application/json' \
--data-raw '{
    "topic": "Startup Legal Fees: How Much to Budget in 2024",
    "email": "<your_email>"
}'
```
Api will take around 1 minute to finish. Once finished, we will send you the blog post in the email that you sent to the api.

## Swagger URL
```bash
http://localhost:4000/docs#/agent/AppController_generateOutline
```

## Stay in touch

- Author - [Dharmaraj Jadeja](https://github.com/Dj911)
