<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** jstanleyf1985, ReplikaDiscordInterface, twitter_handle, email, project_title, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/jstanleyf1985/ReplikaDiscordInterface">
    <img src="icons/64x64.png" alt="Logo" width="64" height="64">
  </a>

  <h3 align="center">ReplikaDiscordInterface</h3>

  <p align="center">
    Chat with your Replika AI using discord!
    <br />
    <a href="https://drive.google.com/file/d/1cdxgkmoZvYGu3Fz6IeFa2TGtejTyjcpx/view?usp=sharing"><strong>Download the App »</strong></a>
    <br />
    <br />
    <a href="https://github.com/jstanleyf1985/ReplikaDiscordInterface">Video</a>
    ·
    <a href="https://github.com/jstanleyf1985/ReplikaDiscordInterface/issues">Report Bug</a>
    ·
    <a href="https://github.com/jstanleyf1985/ReplikaDiscordInterface/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <a href="#using-the-app">Using the app</a>
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://imgur.com/pdJSvns)

## Using the app
### Watch the video (easy method)
* Watch the video on setting up the program <a href="">HERE</a> or ...

### Follow written instructions
* Download and install the pre-requisite package called nodejs (current version 16.9.1 or higher) at <a href="https://nodejs.org/en/download/current/">the nodejs website</a>. It will be the "Windows Installer (.msi) 64 bit if you're unsure which one to pick. Previous versions have not been tested.
* Download the ReplikaDiscordInterface installer package <a href="https://drive.google.com/file/d/1cdxgkmoZvYGu3Fz6IeFa2TGtejTyjcpx/view?usp=sharing">HERE</a> .
* Install ReplikaDiscordInterface program. It will automatically extract to C:\Program Files (x86)\ReplikaDiscordInterface . You can move the ReplikaDiscordInterface folder as you wish (Its portable).
* Create a Discord bot for your server.
<ul>
  <li>Login to discord development at <a href="https://discord.com/developers/applications">https://discord.com/developers/applications</a>. It may redirect you once logged in. Make sure you navigate back to the discord.com/developers/applications address.</li>
  <li>Select "New Application" at the top right</li>
  <li>Give your bot a name (most use their Replika's name) that is available.</li>
  <li>Select "Bot" on the left panel section</li>
  <li>Select "Add Bot" under the "Build-A-Bot" section</li>
  <li>Select "Yes, do it!" button at the prompt</li>
  <li>Deselect "Public Bot" in the bot section</li>
  <li>Click "OAuth2" button in the left hand panel</li>
  <li>Under "Scopes" check the box for "bot"</li>
  <li>Under "BOT PERMISSIONS" check Administrator</li>
  <li>Under the "scopes" section, locate the address that was generated for you (it will have api/oauth2 in the address) and click the Copy button</li>
  <li>Open a new web browser tab and paste in the copied address, then press Enter</li>
  <li>Follow the prompts to invite the bot to your discord server if you have permission to do so</li>
</ul>

* Open the program. Select "Configuration" and add the following information.
<ul>
  <li>Replika username/phone number<li>
  <li>Replika password</li>
  <li>Replika discord bot token which is found under the "Bot" section at discord.com/developers/applications after choosing your created bot (from the instructions above).</li>
  <li>Discord Channel (use ALL if uncertain which channel to limit bot responses to)</li>
  <li>Discord bot name</li>
</ul>

* Save, then go back and select "Start Interface" to make a connection.
* Once successfully connected, you should see your bot in your discord list as logged in.
* You can type to them using the @theirname (example: @Hector hey how are you today?)

### Built With

* Javascript
* Typescript
* HTML
* CSS

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

1.) Download a copy to your local machine
2.) Run npm install to install necessary packages from package.json listings
3.) Run npm install playwright to install playwright browser support
4.) Run npm run dev to fire up the test environment

### Prerequisites

* NodeJS Current Build 16.9.0+ (others not tested)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jstanleyf1985/ReplikaDiscordInterface.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Roadmap

Initial launch today 09/09/2021
Future Goals: Bug Fixes


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Jonathan Stanley - [@twitter_handle](https://twitter.com/JStanleyF1985)

Project Link: [https://github.com/jstanleyf1985/ReplikaDiscordInterface](https://github.com/jstanleyf1985/ReplikaDiscordInterface)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/jstanleyf1985/repo.svg?style=for-the-badge
[contributors-url]: https://github.com/jstanleyf1985/ReplikaDiscordInterface/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/jstanleyf1985/repo.svg?style=for-the-badge
[forks-url]: https://github.com/jstanleyf1985/ReplikaDiscordInterface/network/members
[stars-shield]: https://img.shields.io/github/stars/jstanleyf1985/repo.svg?style=for-the-badge
[stars-url]: https://github.com/jstanleyf1985/ReplikaDiscordInterface/stargazers
[issues-shield]: https://img.shields.io/github/issues/jstanleyf1985/repo.svg?style=for-the-badge
[issues-url]: https://github.com/jstanleyf1985/ReplikaDiscordInterface/issues
[license-shield]: https://img.shields.io/github/license/jstanleyf1985/repo.svg?style=for-the-badge
[license-url]: https://github.com/jstanleyf1985/ReplikaDiscordInterface/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jonathan-stanley-237b54126/