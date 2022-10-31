#### Please, see the full readme and the front-end <a href="https://github.com/ViniciusHack/football-games-list">here</a>

##  💻 Getting started
### Requirements
- <a href="https://nodejs.org/en/">NodeJS</a>
- <a href="https://classic.yarnpkg.com/lang/en/docs/install/">yarn</a> (optional)

**Follow the steps below**
```bash
# Clone the project and access the folder
$ git clone https://github.com/ViniciusHack/football-api/ && cd football-api

# Install the dependencies
$ npm install
# or
$ yarn

# Start your Postgres and put its url in a .env file with the key DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/docker_container?schema=public"

# Create tables
$ npx prisma migrate dev
# or
$ yarn prisma migrate dev

# Start the server
$ npm run dev
# or
$ yarn dev
```

## 🔧 Technologies
- Typescript
- NodeJS
- Express
- Prisma
- Node Schedule
- Axios
- Date FNS
---

Made with 💜 &nbsp;by Vinícius Hack 👋 &nbsp;
