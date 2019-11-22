const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/list", getList);
app.get("/product/:id", getProduct);

app.post("/product", addProduct)

function getList(req, res) {
    console.log("Recieve a request for: " + req.url);

    const productList = [
        {id: 1, name: "Lindor Truffle"},
        {id: 2, name: "Hershey's"},
        {id: 3, name: "Score"}
    ];

    res.json(productList);
}

function getProduct(req, res) {
    //const id = req.query.id;
    const id = req.params.id;
    console.log("Getting details for id: " + id);

    const productDetails = {id: id, name: "undefined"};

    res.json(productDetails);
}

function addProduct(req, res) {
    console.log("Adding new product...");

    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const result = {success: true};
    res.json(result);
}

app.listen(port, () => {
    console.log("Listening on port " + port);
});