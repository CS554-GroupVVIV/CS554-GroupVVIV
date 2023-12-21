# CS554A-TeamVVIV-SIT MArketplace

<a name="readme-top"></a>

<br />
<div align="center">

  ![Imgur Image](https://i.imgur.com/SIZZorG.png)

  <h5 align="center">
  Enabling students, faculty, staff, and alumni from Stevens to buy their preferred products.
  <br />
  </h5>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#members">Members</li>
    <li>
      <a href="#about-the-project">About The Project</a>      
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#start">Start</a></li>
      </ul>
    </li>
    <li><a href="#built-with">Built With</a></li>
    <!-- <li><a href="#database">Database Schema</a></li> -->
  </ol>
</details>

<!-- Members -->

## Members

<div align="left">
Daixuan Chen<br/>Luoyi Fu<br/>Jichen Jiang<br/>Tzu-Ming Lu<br/>Chia Hsiang Wu<br/>
</div>

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="left">
  Stevens provides an exceptional academic environment and offers numerous support systems to ensure students achieve their utmost potential. However, the school primarily facilitates the purchase of used books, resulting in limited product diversity. Additionally, its proximity to the metropolitan area often leads to newer products being more costly compared to other locations. We propose a solution to address this challenge: a platform exclusive to Stevens' students, staff, and alumni with valid email accounts. Our platform prioritizes safety, security, efficiency, and quality, aiming to minimize purchase-related complications for both sellers and buyers compared to existing alternatives.
</div>

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project.

### Installation :

1 - Install docker: https://www.docker.com/get-started/

2 - Make sure the following ports are not occupied: `27017`(MongoDB service), `4000` (Graphql service), `5713` (frontend service), `6379 & 8001` (redis), `4001` (socket)

3 - Execute the following terminal command in the project root directory:

```bash
docker-compose up --build -d
```

This command will build each service's image in docker, including data seeding process.

You might have to wait a while for everything to be set up in docker.

Then, you can open http://localhost:5173 on browser to start using the website.

4 - Make sure the services are started correctly in docker.

### Start :

1 - Access the Home page to browse products without the need to log in.

<div align="center">

  ![Image Imgur](https://i.imgur.com/LB5ksF4.gif)

</div>

2 - Register a user using a Stevens' email address to access additional functionalities

<div align="center">

  ![Image Imgur](https://i.imgur.com/hCrPISW.gif)

</div>

3 - Adding a new post to offer products for sale (Error)

<div align="center">

  ![Image Imgur](https://i.imgur.com/LB5ksF4.gif)

</div>

4 - Submitting a new request to buy specific products

<div align="center">

  ![Image Imgur](https://i.imgur.com/eXO6Zqu.gif)

</div>

5 - Adding products to the favorites list

<div align="center">

  ![Image Imgur](https://i.imgur.com/7TB1quf.gif)

</div>

6 - Communicate with the seller or buyer using the chat system

<div align="center">

  ![Image Imgur](https://i.imgur.com/QcbF7Tc.gif)

</div>

7 - View information on the user profile page

<div align="center">

  ![Image Imgur](https://i.imgur.com/HJDd2qe.gif)

</div>

<p align="right"><a href="#readme-top">back to top</a></p>

## Built With

<h3>Course Tech</h3>

- [![JavaScript][JavaScript-img]][JavaScript-url]
- [![node.js][node.js-img]][node.js-url]
- [![mongodb][mongodb-img]][mongodb-url]
- [![redis][redis-img]][redis-url]
- [![redux][redux-img]][redux-url]
- [![graphql][graphql-img]][graphql-url]

<h3>Independent Tech</h3>

- [![docker][docker-img]][docker-url]
- [![aws][aws-img]][aws-url]

<p align="right"><a href="#readme-top">back to top</a></p>


<!-- MARKDOWN LINKS & IMAGES -->

[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[JavaScript-img]: https://img.shields.io/badge/logo-javascript-blue?logo=javascript
[node.js-url]: https://nodejs.org/en
[node.js-img]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[mongodb-url]: https://www.mongodb.com/zh-cn
[mongodb-img]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[react-url]: https://react.dev/
[react-img]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[redis-url]: https://redis.io/
[redis-img]: https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white
[redux-url]: https://redux.js.org/
[redux-img]: https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[graphql-url]: https://graphql.org/
[graphql-img]: https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql
[docker-url]: https://www.docker.com/
[docker-img]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[aws-url]: https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjo1baCvp-DAxUJvokEHWMyCuMQFnoECAYQAQ&url=https%3A%2F%2Faws.amazon.com%2Fs3%2F&usg=AOvVaw3NS_rqXKJpiZug3wHxUGKs&opi=89978449
[aws-img]: https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white
