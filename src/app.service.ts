import { Injectable } from '@nestjs/common';
import { config } from 'dotenv'
import { END, MessageGraph } from '@langchain/langgraph'
import { ChatOpenAI } from "@langchain/openai"
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { CONVERT_SYSTEM_TEMPLATE, DRAFT_SYSTEM_TEMPLATE, GREETING_MESSAGE, RESEARCH_SYSTEM_TEMPLATE, REVIEW_SYSTEM_TEMPLATE } from 'src/utils/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers';
import { sendEmail } from './utils/common';

import messages from 'src/utils/messages'

config()

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async generateOutline(topic: string, email: string) {
    try {
      const model = new ChatOpenAI({ temperature: 0.5, apiKey: process.env.OPENAI_API_KEY })

      const graph = new MessageGraph();

      graph.addNode("research", async (state: BaseMessage[]) => {
        const SYSTEM_TEMPLATE = RESEARCH_SYSTEM_TEMPLATE.replace("{topic}", topic)
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", SYSTEM_TEMPLATE],
          new MessagesPlaceholder("messages"),
        ]);

        return prompt.pipe(model).invoke({ messages: state });
      })

      graph.addNode("draft", async (state: BaseMessage[]) => {
        let messages = state;

        if (messages[messages.length - 1]._getType() === "ai") {
          messages = state.slice(0, -1);
        }

        let SYSTEM_TEMPLATE = DRAFT_SYSTEM_TEMPLATE.replace("{topic}", topic)
        SYSTEM_TEMPLATE = SYSTEM_TEMPLATE.replace("{result}", messages[messages.length - 1].content.toString())

        const prompt = ChatPromptTemplate.fromMessages([
          ["system", SYSTEM_TEMPLATE],
          new MessagesPlaceholder("messages"),
        ]);

        return prompt.pipe(model).invoke({ messages: state });
      })

      graph.addNode("review", async (state: BaseMessage[]) => {

        let messages = state;

        if (messages[messages.length - 1]._getType() === "ai") {
          messages = state.slice(0, -1);
        }

        let SYSTEM_TEMPLATE = REVIEW_SYSTEM_TEMPLATE.replace("{topic}", topic)
        SYSTEM_TEMPLATE = SYSTEM_TEMPLATE.replace("{result}", messages[messages.length - 1].content.toString())

        const prompt = ChatPromptTemplate.fromMessages([
          ["system", SYSTEM_TEMPLATE],
          new MessagesPlaceholder("messages"),
        ]);

        return prompt.pipe(model).invoke({ messages: state });
      })

      graph.addNode("convert", async (state: BaseMessage[]) => {
        let messages = state;

        if (messages[messages.length - 1]._getType() === "ai") {
          messages = state.slice(0, -1);
        }

        let SYSTEM_TEMPLATE = CONVERT_SYSTEM_TEMPLATE.replace("{topic}", topic)
        SYSTEM_TEMPLATE = SYSTEM_TEMPLATE.replace("{result}", messages[messages.length - 1].content.toString())

        const prompt = ChatPromptTemplate.fromMessages([
          ["system", SYSTEM_TEMPLATE],
          new MessagesPlaceholder("messages"),
        ]);

        return prompt.pipe(model).invoke({ messages });
      })

      graph.setEntryPoint("research")

      graph.addEdge("research", "draft");
      graph.addEdge("draft", "review");
      graph.addEdge("review", "convert");

      graph.addConditionalEdges("convert", async (state) => {
        // Check if the response is in html format only
        const messages = state[state.length - 1];

        let SYSTEM_TEMPLATE = CONVERT_SYSTEM_TEMPLATE.replace("{topic}", topic)
        SYSTEM_TEMPLATE = SYSTEM_TEMPLATE.replace("{result}", messages.content.toString())

        const prompt = ChatPromptTemplate.fromMessages([
          ["system", SYSTEM_TEMPLATE],
        ]);
        const chain = prompt
          .pipe(model)
          .pipe(new StringOutputParser());

        const response = await chain.invoke({ messages: messages.content });

        const startsWithHTMLTag = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/i.test(response);

        if (startsWithHTMLTag) {
          // String starts and ends with HTML tag
          return "end"
        } else {
          // String does not start and end with HTML tag
          return "review"
        }

      }, {
        review: "review",
        end: END
      })

      const runnable = graph.compile();

      const stream = await runnable.stream(
        new HumanMessage(GREETING_MESSAGE.replace("{topic}", topic))
      );

      let result

      for await (const value of stream) {
        // Each node returns only one message
        const [nodeName, output]: any = Object.entries(value)[0];
        if (nodeName !== END) {
          console.log("---STEP---")
          console.log(nodeName, output.content);
          console.log("---END STEP---")
        } else {
          result = output[output.length - 1].content
        }
      }

      const options = {
        from: process.env.EMAIL, // sender address
        to: email, // receiver email
        subject: "Blog Post is ready", // Subject line
        text: "Your Blog Post", // plain text body
        html: result,
        headers: {
          'x-myheader': 'test header',
        },
      }

      await sendEmail(options)

      return { message: messages.EMAIL_SENT_SUCCESSFULLY }

    } catch (error) {
      console.error("Error generating outline:", error);
      return { "error": messages.EMAIL_SENT_FAILED };
    }
  }
}
