# Requirements:
* Install git:
    * Windows: https://git-scm.com/download/win
    * Mac: https://git-scm.com/download/mac
* Open a Terminal:
    * Windows: install Windows Terminal Preview from App Store
    * Mac: open Terminal app
* Install latest nvm (node version manager, includes node.js) by running:
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
* Clone this repository:
`git clone git@github.com:rw3iss/forex-bot.git`


# Setup and running:
In the terminal, split it into two vertical panes, then run in each:

## React web client:
```
cd web
npm install
npm run dev
```

## node backend server api:
```
cd api
npm install
npm run dev
```

Open your browser to http://localhost:3000 and you should see the TradingView chart.