# Custom ChatGPT
This project is based on integrating Google's STT (Speech-to-Text) and TTS (Text-to-Speech) with ChatGPT, creating a seamless conversational experience.

## Screenshots

<img width="1435" alt="Capture d’écran 2024-02-29 à 19 56 47" src="https://github.com/alexisbonk/Custom-ChatGPT/assets/69346752/30d91fb0-c8a4-4d59-a0b0-3607a99f2669">

<img width="1435" alt="Capture d’écran 2024-02-29 à 19 57 36" src="https://github.com/alexisbonk/Custom-ChatGPT/assets/69346752/62aab8ff-8ffb-45f4-b4b9-d1e8f92d9a55">


## Installation

1. Clone the repo

   ```sh
    git clone https://github.com/alexisbonk/Custom-ChatGPT.git
   ```

2.  Install all packages
    ```sh
    npm install
    ```


3.  Add .env file and add the following:
    ```.env
    REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY
    REACT_APP_OPENAI_API_KEY=YOUR_API_KEY
    ```
    
4.  Then have fun!
    ```sh
    npm start
    ```

## Features

Here are the features already available:

- **Loop button**: Allows GPT to converse with itself. ✔️
- **Version**: Enables changing the GPT version (GPT-4 Turbo, GPT-4, or GPT-3.5 Turbo). ✔️
- **Voices**: Allows changing the voice for TTS (See [Google docs](https://cloud.google.com/text-to-speech/docs/voices)) ✔️
- **Custom prompt**: Enables manually entering a custom prompt at any time. ✔️
- **Mood**: Sets the AI's mood (funny, sad, angry, or in love). ✔️

## Nice to have

- Emojis that pop up during GPT's responses.
- Capability to interpret code input/output.
- Any other feature you can think of!


## Author

- Alexis Knob - [Website](https://www.bonko.fr/)
- Julien Meziere - [Github](https://github.com/JulienMeziere)
