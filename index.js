const express = require("express");
const bodyParser = require("body-parser");

const PUBLISHABLE_KEY =
  "pk_test_51LFYsrIto4IK5hDXKgJVS3YFMIihbiuzTwA36ZkihoFoeM7hvTAafDUWvb0nNWZCLzI7ss8w2sCZyhgfbAJVWHrk00DbFyup5Q";
const SECRET_KEY =
  "sk_test_51LFYsrIto4IK5hDXbi8pbXv6WTC2iEdVgkvRgoAO261R19nGtm1XULx0UKCOatAT6fWYT4NNjf92zBhyOHTTf57Z00ukE23pfe";

const stripe = require("stripe")(SECRET_KEY);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("Home", {
    key: PUBLISHABLE_KEY,
  });
});

app.get("/result", (req, res) => {
  res.render("Success");
});

app.post("/payment", (req, res) => {
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Hoang Nhu Thanh",
      address: {
        line1: "227 Nguyen Van Cu",
        postal_code: "70000",
        city: "Ho Chi Minh",
        state: "HCM",
        country: "Vietnam",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 99900,
        description: "iPhone 13 Pro Max 256GB Green",
        currency: "USD",
        customer: customer.id,
      });
    })
    .then(() => {
      res.redirect("/result");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
