# smallvideostreaming

## Overall description

We are trying to create a basic, small and easy to customize system to upload videos and manage users -and maybe live streaming- so that it is easier for anyone to develop and customize a system with such characteristics

The way we are thinking this project logic structure is:

* The system can contain many institutions that offer some kind of content to be consumed by the end users
* An institution can have many videos related (with different categories/tags)
* A "regular user" can register to consume a specific category of video or maybe to a specific video (e.g. subscribe to a live event) - we still have to plan a generic way to do this
* The admin user is the one who updates the videos for a specific institution so that we do not need to manage multiple permissions levels for the same components but should be easy to customize, though

## Project Scope

* Create library. Videos hosted in SOME place (can be directly into a filesystem or external services, such as AWS)
* Stream a video file that is part of a library
* Validate that user has enough privileges to stream a file (avoid URL injection)
* Register users (admin should exist on database and then, he/she can create authors, and student can register directly to the site)
* User management (admin can grant privileges by change user's group)
* When admin user registers an author, a random password is generated (review some GUID library) and a token is created so that when the author user clicks on the link on the email sent, his/her account will be checked as "validated" and then is forced to change the password
* Management screens (CRUD for institutes and videos)
* Screens for all the users (update password/personal-info)

## To be considered in scope

* Live video streaming

## Totally out of scope

* Video streaming optimization (for both static file and live)
* Payment gateways. This should be considered to be implemented for specific cases


### Technologies to be used

* Backend: NodeJS
* Frontend: Polymer
