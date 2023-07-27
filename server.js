const http = require('http');
const { json } = require('stream/consumers');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => {
  const contentType = req.headers["content-type"];

  if(req.body && contentType === "application/json") {
    console.log(reqBody);

    reqBody = JSON.parse(reqBody)
  }

    // Parse the body of the request as JSON if Content-Type header is
      // application/json
    // Parse the body of the request as x-www-form-urlencoded if Content-Type
      // header is x-www-form-urlencoded
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      // Log the body of the request to the terminal
      console.log(req.body);
    }

    const resBody = {
      "Hello": "World!"
    };

    // Return the `resBody` object as JSON in the body of the response
    const resJson = JSON.stringify(resBody);

    res.statusCOde = 200;
    res.setHeader("Content-Type", "application/json");

    return res.end(resJson)
  });
});

const port = 5000;


server.listen(port, () => console.log('Server is listening on port', port));

fetch("/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({
    hey: "dood"
  })
}).then((res) => res.json()).then((data) => console.log(res.body))
