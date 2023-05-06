import { apiKey } from "./config";

addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const endpoint = url.pathname.split("/")[1];

	if (endpoint === "recipes") {
		const ingredient = url.searchParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a dish that includes ${ingredient}.
		Please include the name of the dish, followed by the ingredients and instructions.`;
		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		// Split the recipe text into an array of lines, trim each line, and remove empty lines
		const recipeLines = recipeText
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);

		// Find the index of the first occurrence of "Ingredients:"
		const ingredientsIndex = recipeLines.findIndex(
			(line) => line === "Ingredients:"
		);

		// Find the index of the first occurrence of "Instructions:"
		const instructionsIndex = recipeLines.findIndex(
			(line) => line === "Instructions:"
		);

		// Extract the name of the recipe from the first line
		const name = recipeLines[0];

		// Extract the ingredients as an array of strings between the "Ingredients:" and "Instructions:" lines
		const ingredients = recipeLines
			.slice(ingredientsIndex + 1, instructionsIndex)
			.map((line) => line.replace(/^\d+\.\s*/, ""));

		// Extract the instructions as an array of strings after the "Instructions:" line
		const instructions = recipeLines
			.slice(instructionsIndex + 1)
			.map((line) => line.replace(/^\d+\. /, ""));

		// Add the step numbers to the instructions
		const numberedInstructions = instructions.map(
			(instruction, index) => `${index + 1}. ${instruction}`
		);

		const responseData = {
			name: name,
			ingredients: ingredients,
			instructions: numberedInstructions,
		};

		return new Response(JSON.stringify(responseData), {
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response("Invalid endpoint", { status: 404 });
}

async function fetchRecipe(prompt, apiKey) {
	const response = await fetch("https://api.openai.com/v1/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			prompt: prompt,
			max_tokens: 1024,
			temperature: 0.5,
			model: "text-davinci-002",
			n: 1,
			stop: null,
		}),
	});

	const data = await response.json();

	// Check if the response from the API contains a valid recipe
	if (!data.choices || !data.choices[0] || !data.choices[0].text) {
		throw new Error("Unable to generate recipe");
	}

	// Extract the recipe from the response data and return as JSON
	return {
		recipe: data.choices[0].text.trim(),
	};
}
