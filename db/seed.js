const mongoose = require("mongoose");
const Point = require("../models/point");

mongoose
  .connect("mongodb://localhost:27017/karaoke", { useNewUrlParser: true })
  .then(() => {
    Point.insertMany([
      { name: "озеро Аслыкуль", latitude: "54.314412", longitude:"54.577675" },
      { name: "озеро Кандрыкуль", latitude: "54.500379", longitude:"54.067324" },
      { name: "река Нугуш", latitude: "54.589686", longitude:"53.916479" },
    ]);
  })
