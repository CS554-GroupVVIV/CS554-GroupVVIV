# CS554A-TeamVVIV-SIT MArketplace

<a name="readme-top"></a>

<br />
<div align="center">
  <a href="">
    <img src="logo.png" alt="Logo" width="600" >
  </a>

  <h3 align="center">This is CS554 Project Repo</h3>

  <p align="center">
    Allowing student, faculty, staff and alumnus from Stevens to purchase their desired products
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#members">Members</li>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#database">Database</a></li>
  </ol>
</details>

<!-- Members -->

## Members

<div align="left">
Daixuan Chen<br/>Luoyi Fu<br/>Jiayin Huang<br/>Jichen Jiang<br/>Tzu-Ming Lu<br/>Chia Hsiang Wu<br/>
</div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">
<!-- <img src="https://github.com/tzuminglu/2FA-with-email/blob/main/example.jpeg" width="320"> -->
</div>
<!-- The objective of this project is to incorporate the Eventbrite API into the development of a web page that enables users to vote on events and provide comments. -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

To develop this project, you will need the following tools:

- [![JavaScript][JavaScript-img]][JavaScript-url]
- [![Express.js][Express.js-img]][Express.js-url]
- [![Express.js][Express.js-img]][Express.js-url]
- [![Express.js][Express.js-img]][Express.js-url]
- [![node.js][node.js-img]][node.js-url]
- [![postman][postman-img]][postman-url]
- [![mongodb][mongodb-img]][mongodb-url]
- [![react][react-img]][react-url]
<!-- - [![mongodb][mongodb-img]][mongodb-url]
- [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US)
- [Mircosoft Authenticator](https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=en_US) -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### How to start the project:

1 - Install docker: https://www.docker.com/get-started/

2 - Make sure the following ports are not occupied: `27017`(MongoDB service), `4000` (backend service), `5713` (frontend service)

3 - Execute the following terminal command in the project root directory:

```bash
docker-compose up --build -d
```

This command will build each service's image in docker, including data seeding process.

You might have to wait a while for everything to be set up in docker.

Then, you can open http://localhost:3000 on browser to start your testing.

4 - Make sure the services are started correctly in docker, enjoy！

## Database

<div align="center">
  <a href="">
    <img src="database.png" alt="Database" width="600" >
  </a>
</div>

<!-- MARKDOWN LINKS & IMAGES -->

[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[JavaScript-img]: https://img.shields.io/badge/logo-javascript-blue?logo=javascript
[TypeScript-img]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[node.js-url]: https://nodejs.org/en
[node.js-img]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[postman-url]: https://www.postman.com/
[postman-img]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white
[mongodb-url]: https://www.mongodb.com/zh-cn
[mongodb-img]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[react-url]: https://react.dev/
[react-img]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
