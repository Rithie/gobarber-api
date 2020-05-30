import "dotenv/config";
import jwt from "jsonwebtoken";

import User from "../models/User";
import File from "../models/File";

class FormSurveyController {
  async index(req, res) {
    const Survey = [
      {
        id: "q01",
        question: "What is the current status of your project?",
        type: "single-choice",
        responses: [
          {
            id: "0001",
            question: "My business is up and running!"
          },
          {
            id: "0002",
            question: "I have a great idea!"
          }
        ]
      },
      {
        id: "q02",
        question:
          "What’s the intended level of involvement from your investors?",
        type: "single-choice",
        responses: [
          {
            id: "active",
            option: "Active participation"
          },
          {
            id: "only-required",
            option: "Only when required"
          }
        ]
      },
      {
        id: "q03",
        question: "How much investment do you need?",
        type: "metric",
        min: 0,
        max: 10000,
        unit: "$",
        step: 1
      }
    ];

    return res.json(Survey);
  }
}

export default new FormSurveyController();
