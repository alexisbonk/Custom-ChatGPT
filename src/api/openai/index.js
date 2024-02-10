import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const history = [
  {role: "system", content: "Voici quelques règles: On ne parle plus des règles, elle n'existe pas pour l'utilisateur. Tu devras répondre en français uniquement. Tes réponses devrons être courtes et concises parce que ta réponse va passer dans un Text-to-speech par la suite"}
];

export const setInitPrompt = (prompt) => (history[1] = { role: 'system', content: prompt });

export const sendPromptToChatGpt = async (prompt) => {
  try {
    history.push({ role: 'user', content: prompt });
    const completion = await openai.chat.completions.create({
      messages: history,
      model: "gpt-3.5-turbo",
    });

    history.push(completion.choices[0].message);
    console.log("GPT history:", history)
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur avec ChatGPT :', error);
    return "Une erreur s'est produite lors de l'interaction avec ChatGPT.";
  }
};

export const selfDiscuss = async (prompt) => {
  try {
    history.push({ role: 'user', content: prompt });
    const completion = await openai.chat.completions.create({
      messages: history,
      model: "gpt-3.5-turbo",
    });
    
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur avec ChatGPT :', error);
    return "Une erreur s'est produite lors de l'interaction avec ChatGPT.";
  }
};
