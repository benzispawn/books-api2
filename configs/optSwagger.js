const options = {
    definition: {
        openapi: "3.0.0",
        swagger: "1.0",
        info: {
          title: "Books API with Swagger",
          version: "1.0.0",
          description:
            "This is a simple CRUD API application made with Express and documented with Swagger",
        //   license: {
        //     name: "MIT",
        //     url: "https://spdx.org/licenses/MIT.html",
        //   },
          contact: {
            name: "Raphael Carloni Benzi",
            url: "https://github.com/benzispawn",
            email: "raphael_benzi@hotmail.com",
          },
        },
        servers: [
          {
            url: "http://localhost:3000",
          },
        ],
      },
      apis: ["./routes/*.js"],
}

module.exports = {
    options
}