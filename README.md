# Code Golf Challenge 2015

This is a simple monitoring service.
It can check web services or local daemon services.
Will run on localhost:3000

### To Install

npm install express
npm install request

### To Run

node theinitialfileorsomething.js

### Usage

status webpage can be accessed on the root.

going to /status will give a json object -

{
  "payload": [
    {
      "name": "HealthUnlocked",
      "status": "OK",
      "last_seen": 2691
    },
    {
      "name": "HealthUnlocked Staging",
      "status": "OK",
      "last_seen": 2948
    },
    {
      "name": "My Console Application",
      "status": "ALERT",
      "last_seen": 6138
    }
  ]
}

### TODO

Loads of stuff that will never happen.
The code is messy, but thrown together in a short period of time.