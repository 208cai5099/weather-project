import { ForecastEntry } from "./types.js"
import fs from "fs/promises"


const OLLAMA_GENERATE_ENDPOINT = "http://127.0.0.1:11434/api/generate"
const OLLAMA_EMBEDDING_ENDPOINT = "http://127.0.0.1:11434/api/embed"
const WEATHER_DESCRIPTORS = ["Partly Cloudy", "Mostly Cloudy", "Cloudy", "Partly Clear", "Mostly Clear", "Clear", "Partly Sunny", "Mostly Sunny", "Sunny", "Fog", "Hail", "Rain", "Snow", "Thunderstorm", "Windy"]
const LLM_MODEL_NAME = "gemma3:1b"
const EMBEDDING_MODEL_NAME = "mxbai-embed-large:335m"
const EMBEDDING_FILE_PATH = "descriptor_embeddings.json"
const EMBEDDING_DIMENSIONS = 700


async function callGenerateAPI(systemMessage: string, promptMessage: string) {

    try {
    
        const res = await fetch(OLLAMA_GENERATE_ENDPOINT,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: LLM_MODEL_NAME,
                    system: systemMessage,
                    prompt: promptMessage,
                    stream: false,
                    think: false,
                    options: {
                        seed: 2,
                        temperature: 0.0,
                        top_p: 0.9
                    }
                })

            }
        )

        const resJSON = await res.json()
        return resJSON.response
        
    } catch (error) {
        console.log(error)
    }

}

async function callEmbeddingAPI(textForEmbedding: string) {

    try {
        const res = await fetch(OLLAMA_EMBEDDING_ENDPOINT, 
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: EMBEDDING_MODEL_NAME,
                    input: textForEmbedding,
                    dimensions: EMBEDDING_DIMENSIONS
                })
            }
        )

        const resJSON = await res.json()
        return resJSON.embeddings[0]
        
    } catch (error) {
        console.log(error)
    }


}

async function setDescriptorEmbeddings() {

    const allEmbeddings: Record<string, number[]> = {}
    for (const descriptor of WEATHER_DESCRIPTORS) {
        const embedding = await callEmbeddingAPI(descriptor)
        allEmbeddings[descriptor] = embedding
    }

    try {
        await fs.writeFile(EMBEDDING_FILE_PATH, JSON.stringify(allEmbeddings, null, 4))
    } catch (error) {
        console.log(error)
    }

}

async function getDescriptorEmbeddings() {

    try {
        const res = await fs.readFile(EMBEDDING_FILE_PATH, "utf-8")
        return JSON.parse(res) as Record<string, number[]>
    } catch (error) {
        console.log(error)
    }

}

function calculateCosineSimilarity(vectorA: number[], vectorB: number[]) {

    // calculate the dot product
    let dot_product = 0
    for (let i=0; i<vectorA.length; i++) {
        dot_product += vectorA[i] * vectorB[i]
    }

    // calculate magnitudes of vector A and B
    let magnitudeA = Math.sqrt(vectorA.reduce((accumulator, current) => accumulator + current ** 2, 0))
    let magnitudeB = Math.sqrt(vectorB.reduce((accumulator, current) => accumulator + current ** 2, 0))

    return dot_product / (magnitudeA * magnitudeB)

}


export async function getWeatherDescriptors(forecast: Partial<ForecastEntry> ) {

    const shortDaytimeForecast = forecast["shortDaytimeForecast"] as string
    const detailedDaytimeForecast = forecast["detailedDaytimeForecast"] as string
    const shortNighttimeForecast = forecast["shortNighttimeForecast"] as string
    const detailedNighttimeForecast = forecast["detailedNighttimeForecast"] as string
    const hourlyForecast = forecast["hourlyForecast"] as Record<string, string>
    const descriptorChoices = WEATHER_DESCRIPTORS.join(", ")

    // set up directions for the LLM
    const systemMessage: string = `You are a weather assistant. Given some context about the weather, you will response with a suitable weather descriptor.`

    // create the prompt template that will be updated with weather details
    const promptTemplate: string = `Given the following weather description, assign it a descriptor from the available choices.\n
    Title: weather_title\n
    Time of Day: time_of_day\n
    Description: weather_description\n
    You must pick one of the following descriptors: ${descriptorChoices}\n
    Simply output the descriptor. DO NOT make up your own descriptor. DO NOT respond with a sentence and any extra words.

    For example, a proper descriptor for the following description is Sunny.\n
    Title: Mostly Sunny\n
    Time of Day: Daytime\n
    Description: Mostly sunny. High near 52, with temperatures falling to around 49 in the afternoon. West wind 13 to 17 mph, with gusts as high as 29 mph.\n
    `

    // call LLM API to generate descriptors for daytime and nighttime weather
    const daytimePrompt = promptTemplate.replace("weather_title", shortDaytimeForecast).replace("weather_description", detailedDaytimeForecast).replace("time_of_day", "Daytime")
    const daytimeDescriptor = await callGenerateAPI(systemMessage, daytimePrompt)
    const nighttimePrompt = promptTemplate.replace("weather_title", shortNighttimeForecast).replace("weather_description", detailedNighttimeForecast).replace("time_of_day", "Nighttime")
    const nighttimeDescriptor = await callGenerateAPI(systemMessage, nighttimePrompt)

    forecast["daytimeWeatherDescriptor"] = daytimeDescriptor
    forecast["nighttimeWeatherDescriptor"] = nighttimeDescriptor
    
    try {

        let newHourlyDescriptors: Record<string, string> = {}

        // check if the embeddings for the available descriptors are already made
        // if not already made, create them
        try {
            await fs.access(EMBEDDING_FILE_PATH)
        } catch (error) {
            await setDescriptorEmbeddings()
        }

        // load the stored embeddings of available descriptors
        const availableEmbeddings = await getDescriptorEmbeddings()

        if (availableEmbeddings) {

            for (const [hour, currentDescriptor] of Object.entries(hourlyForecast)) {

                // create an embedding for the current descriptor
                const currentEmbedding = await callEmbeddingAPI(currentDescriptor)

                // use cosine similarity to find closest match to available descriptors
                let closestDescriptor = ""
                let bestScore = -Infinity
                for (const [newDescriptor, newEmbedding] of Object.entries(availableEmbeddings)) {
                    const cosineSimilarity = calculateCosineSimilarity(currentEmbedding, newEmbedding)
                    if (cosineSimilarity > bestScore) {
                        bestScore = cosineSimilarity
                        closestDescriptor = newDescriptor
                    }
                }

                newHourlyDescriptors = {...newHourlyDescriptors, [hour]: closestDescriptor}
            }

        }

        forecast["hourlyForecast"] = newHourlyDescriptors

    } catch (error) {
        console.log(error)
    }

    return forecast

}

