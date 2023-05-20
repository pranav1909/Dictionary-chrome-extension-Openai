import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

const app = express();
app.use(express.json());
dotenv.config();

app.use(cors({
    origin: '*'
}));

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/ask", async (req, res) => {
    const word = req.body.word;

    let api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        if (word == null) {
            throw new Error("Uh oh, no prompt was provided");
        }

        //free dictionary api
        var pos = null;
        var meaning = null;
        axios.get(api).then((response) => {
            pos = response.data[0].meanings[0].partOfSpeech;
            console.log(pos);
            meaning = response.data[0].meanings[0].definitions[0].definition;
            console.log(meaning);
        })

        //openai api
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `give 3 easy sentences which contains ${word}` }],
        });
        const completion = response.data.choices[0].message;
        console.log(completion.content);

        return res.status(200).json({
            success: true,
            word: word,
            pos: pos,
            meaning: meaning,
            message: completion.content,
        });
    } catch (error) {
        console.log(error.message);
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}!!`));