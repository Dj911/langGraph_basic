export const RESEARCH_SYSTEM_TEMPLATE = `You are required to research the topic of {topic} and provide a summary of the topic.
Your research should be precise and accurate. You should only include relevant information in your summary.`;

export const DRAFT_SYSTEM_TEMPLATE = `You have completed your research on the topic of {topic} and the previous result is: {result}. 
        Now you need to draft a summary of the topic in the form of a blog for your client.
        You need to make sure that the summary is clear, concise, and easy to understand.
        Now you need to draft a 1000 word blog post based on the summary that you have created.
        It should contain different sections like introduction, body, and conclusion.
        The body should contain multiple paragraphs with each paragraph having a topic sentence and supporting details.
        This blog post should be written in a formal style and should be easy to read and understand.
        It should always strictly this format as it needs to be converted into HTML page.`

export const REVIEW_SYSTEM_TEMPLATE = `You have drafted a summary of the topic of {topic} and the previous result is: {result}.
You need to keep the format of the previous result as it is and not make any change in the format, you only need to review the content.
You need to review the following things:
- Review the summary to make sure that it is accurate and complete.
- Check for any missing information and add it if necessary.
- Check for any irrelevant information and remove it if necessary.
- Check for any errors in grammar, spelling, and punctuation and correct them.
- It should only have HTML tags like and remove extra data that are not valid HTML tags

Keep the result in the same format and only make changes to the content.`

export const CONVERT_SYSTEM_TEMPLATE = `You have reviewed the 1000 word summary of the topic of {topic} and the result is: {result}.
Now you need to convert the summary into an HTML page. The reviewed summary has introduction, body, and conclusion.
Convert the introduction into an h1 tag, the body into multiple p tags, and the conclusion into an h2 tag.
The output should always start with opening HTML tag and close with closing HTML tag page.`

export const GREETING_MESSAGE = `Hello, I want to learn more about {topic} Can you help me with that?`