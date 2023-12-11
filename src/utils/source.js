const promptArg = args[0]


if (
   !secrets.apiKey
) {
   throw Error(
       "Need to set OPENAI_KEY environment variable"
   )
}


// example request:
// curl https://api.openai.com/v1/images/generations -H "Content-Type: application/json" -H "Authorization: Bearer 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" -d '{ "model": "dall-e-3", "prompt": "a white siamese cat", "n": 1, "size": "1024x1024" }'

// example response:
// { "created": 1702102573, "data": [ { "revised_prompt": "A silhouette of a superhero standing on a globe representing Earth. The superhero is a man dressed in a black cape and cowl, appearing powerful and vigilant. His chest bears a symbol resembling a bat. The globe is beautifully detailed showing all continents and oceans. The background is a night sky studded with shimmering stars.", "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-4Jr5lXCDPWM20Utya9mvqPzI/user-qicwX1qYhqyx8ctm987gdWsW/img-uAZK4qmdDO687fgJfljAHfup.png?st=2023-12-09T05%3A16%3A13Z&se=2023-12-09T07%3A16%3A13Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-12-08T23%3A12%3A28Z&ske=2023-12-09T23%3A12%3A28Z&sks=b&skv=2021-08-06&sig=QjUAIkaUlPUQBUUvrA%2Btb8odkJ55TStyK63QISDuNpE%3D" } ] }
const openAIRequest = Functions.makeHttpRequest({
   url: "https://api.openai.com/v1/completions",
   method: "POST",
   headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secrets.apiKey}`
   },
   data: { "model": "gpt-3.5-turbo", "messages": [{ role: "user", content: promptArg }], "temperature": 0.7 }
})


const [openAiResponse] = await Promise.all([
   openAIRequest
])
console.log("raw response", openAiResponse)


const result = openAiResponse.data.data[0].url
return Functions.encodeString(result)




