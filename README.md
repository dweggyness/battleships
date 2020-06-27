# Battleships

A battleships clone following the 2002 Hasbro version which has 5 ships, of sizes 5,4,3,3,2 respectively. Players have the option of playing against a BOT, or playing against a friend by sharing a link/game code.

Created as practice for making a full-stack app. Mobile friendly! ( kinda )

## App

**DEMO** : **https://waterbound-fighting-vessels.herokuapp.com/**

![screenshot of game page](https://i.imgur.com/Iv8G9ih.jpg)

## Stack
- **ERN**
- Express & Node.js for the backend
- React for frontend

## Other tech used 
- Socket.io for communication between player and server ( to send & receive player moves )  
- React DND for drag & drop placement of player ships on client side.  
- @emotion for styling

## Challenges faced / comments
- Losing interest in the project after completing the backend. I wanted to give up on this project as I no longer felt for it, but I forced myself to complete it either way ( though that reflects in the quality of the finished product ) 
- Finding out that certain aspects were more challenging than expected : e.g drag & drop feature of placing ships. React-DND was certainly not plug and play, and I had to spend some time learning it. More planning should have been done so I won't be so surprised by this.
- Having planned out the API beforehand, the client side communication was relatively easy to implement as I already thought of how it will be used, the parameters and expected return values when I was building the backend.  
- The BOT feature would have been easy to add if the AI was done on the back-end ( as I could reuse the game handling logic for the front end ), but I decided against that as I want to be able to demo the game without having to deploy the server with it. I ended up creating the BOT AI on the front end, having to rewrite some game handling logic. This is one of the rare times I chose functionality over ease to program, also another failure on my planning side ( originally planned to have the AI on the backend ).  
- Difficulties in making code readable/maintainable. The code 'works', but I might have some difficulty coming back to this codebase in the future. I tried but failed at making my functions single-responsibility, and left out comments with the reason: 'i'll add them when I'm done with the project', but I should have documented as I went.  
- Code health was oftentimes neglected in favor of 'get it to work', and I would tell myself that 'I'll cleanup after the project was done'. This is a bad mindset to have, and I should have further detailed the steps I'll be taking beforehand. e.g : folder structure, where certain data resides, how a certain event will be triggered. This led to some 'spaghetti code' as I had to rewire some badly planned components to work a certain way.
- Overall lesson : more detail needed when planning out a project.

## License
[MIT](https://choosealicense.com/licenses/mit/)
