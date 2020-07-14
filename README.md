# Project Setup

## 1. Clone project and install dependencies

```shell
cd <YOUR_WORKING_DIRECTORY>
git clone https://github.com/abutalhadanish/supplyr-web.git
cd supplyr-web

npm install
```

## 3. Add a file `.env.local` to the root directory of your project and add the following content (you can change the API url as per your setup):
```
REACT_APP_API_URL="http://127.0.0.1:8000"
```

## 2. Start the web server
```shell
npm start
```