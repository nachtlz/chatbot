import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
    console.log(colors.bold.green('Welcome to the Chatbot Program!'));
    console.log(colors.bold.green('You can start chatting with the bot.'));

    // Store conversation history
    const chatHistory = []

    while(true) {
        const userInput = readlineSync.question(colors.yellow('You: '));

        try {
            // Construct messages by iteration over the history
            const messages = chatHistory.map(([role, content]) => ({role, content}));

            // Add latest user input
            messages.push({ role: 'user', content: userInput })

            if(userInput.toLowerCase() === 'exit') {
                console.log(colors.green('Bot: See ya!'));
                return;
            }

            // Call API with user input
            const completion = await openai.chat.completions.create({
                messages: messages,
                model: "gpt-3.5-turbo",
            });

            // Get completion text/content
            const completionText = completion.choices[0].message.content;

            console.log(colors.green('Bot: ') + completionText);

            // Update history with user input and assistant response
            chatHistory.push(['user', userInput]);
            chatHistory.push(['assistant', completionText]);

        } catch (error) {
            console.error(colors.red(error))
        }
    }
}

main();