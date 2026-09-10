import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
LLM = "gemma3:4b-it-q4_K_M"

MAX_CONTEXT_TOKENS = 4096
SUMMARY_TRIGGER = int(MAX_CONTEXT_TOKENS * 0.60)


class ChatLLM:

    def __init__(self):
        self.summary = ""

        self.chat_history = [
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant. Always answer based on the user’s question. "
                    "If the question asks for an explanation of a concept (e.g., 'Explain RAG', "
                    "'Elaborate about vector databases'), provide a medium-length answer of about 10 to 15 lines. "
                    "If the question is straightforward (e.g., 'What is 2+2?', 'Who is CEO of Microsoft?'), "
                    "give a concise, direct answer in 1 to 2 lines."
                )
            }
        ]

    def chat(self, question):

        self.chat_history.append(
            {
                "role": "user",
                "content": question
            }
        )

        payload = {
            "model": LLM,
            "messages": self.build_messages(),
            "stream": False
        }

        response = requests.post(
            OLLAMA_URL,
            json=payload
        )

        response.raise_for_status()

        data = response.json()

        answer = data["message"]["content"]

        prompt_tokens = data.get("prompt_eval_count", 0)

        print(f"\nPrompt tokens: {prompt_tokens}")
        print(f"Summary threshold: {SUMMARY_TRIGGER}")

        self.chat_history.append(
            {
                "role": "assistant",
                "content": answer
            }
        )

        if prompt_tokens >= SUMMARY_TRIGGER:
            self.summarize()

        return answer

    def summarize(self):

        if len(self.chat_history) <= 4:
            return

        messages_to_summarize = self.chat_history[1:-4]

        conversation_text = ""

        for message in messages_to_summarize:
            conversation_text += (
                f"{message['role']}: "
                f"{message['content']}\n"
            )

        # conversation_text = "\n".join(
        #     f"{message['role']}: {message['content']}" 
        #     for message in messages_to_summarize
        # )
        

        prompt = f"""
            Create a concise summary of the conversation below.

            Preserve:
            - important user facts
            - user preferences
            - decisions
            - technical requirements
            - important context needed for future questions

            Do not include unnecessary conversation.

            Previous summary:
            {self.summary}

            Conversation:
            {conversation_text}
        """

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": LLM,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You summarize conversation history "
                            "for another LLM."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": False
            }
        )

        response.raise_for_status()

        data = response.json()

        self.summary = data["message"]["content"]

        recent_messages = self.chat_history[-4:]

        self.chat_history = [
            self.chat_history[0]
        ] + recent_messages


    def build_messages(self):

        messages = []

        messages.append(self.chat_history[0])

        if self.summary:
            messages.append(
                {
                    "role": "system",
                    "content": (
                        "Conversation summary:\n"
                        + self.summary
                    )
                }
            )

        messages.extend(self.chat_history[1:])

        return messages

    def getSummary(self):
        return self.summary

    def getHistory(self):
        return self.chat_history

if __name__ == '__main__':
    chat_llm = ChatLLM()

    while True:
        user_input = input('ask : ')
        if user_input == 'history':
            print('--------------------- History ---------------------------')
            for row in chat_llm.getHistory():
                print(row)

            print('---------------------------------------------------------')
        elif user_input == 'summary':
            print('---------------------- Summary --------------------------')
            print(chat_llm.getSummary())
            print('---------------------------------------------------------')
        else:
            print(chat_llm.chat(user_input))