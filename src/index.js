require("dotenv").config();
import { apiKey } from "./config";
const { OpenAIApi } = require("openai");

const openai = new OpenAIApi({
	apiKey,
});

// const NodeCache = require("node-cache");
// const cache = new NodeCache();

addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event.request));
});

const cache = {};
let conversation = [];

async function handleRequest(request) {
	const url = new URL(request.url);
	const endpoint = url.pathname;
	const queryParams = url.searchParams;

	function generateUniqueId() {
		return Math.random().toString(36).substring(7);
	}

	// DIET RECIPE
	if (endpoint === "/api/diet/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a diet dish that includes ${ingredient}.
		Please include an image url of the dish.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.
		`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

		const imageUrlIndex = recipeLines.findIndex((line) =>
			line.startsWith("Image URL:")
		);

		// Extract the name of the recipe from the first line
		const name = recipeLines[0].replace(/^[^:]+:/, "").trim();

		const instructionsWithoutImageUrl = recipeLines.slice(
			instructionsIndex + 1,
			imageUrlIndex
		);

		// Extract the ingredients as an array of strings between the "Ingredients:" and "Instructions:" lines
		const ingredients = recipeLines
			.slice(ingredientsIndex + 1, instructionsIndex)
			.map((line) => line.replace(/^\d+\.\s*/, ""));

		// Extract the instructions as an array of strings after the "Instructions:" line
		const instructions = instructionsWithoutImageUrl.map((line) =>
			line.replace(/^\d+\. /, "")
		);

		// Extract the image URL
		let imageUrl = null;
		if (imageUrlIndex !== -1) {
			const imageUrlLine = recipeLines[imageUrlIndex];
			const imageUrlMatch = imageUrlLine.match(/Image URL:(.+)/);
			if (imageUrlMatch) {
				imageUrl = imageUrlMatch[1].trim();
			}
		}

		// Add the step numbers to the instructions
		const numberedInstructions = instructions.map(
			(instruction, index) => `${index + 1}. ${instruction}`
		);

		const responseData = {
			name,
			ingredients,
			instructions: numberedInstructions,
			imageUrl: null,
		};

		if (imageUrl) {
			responseData.imageUrl = imageUrl;
		}

		return new Response(JSON.stringify(responseData), {
			headers: { "Content-Type": "application/json" },
		});
	}

	// APPETIZERS

	if (endpoint === "/api/appetizer/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for an appetizer dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	if (endpoint === "/api/appetizer/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for an appetizer dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// MEDITERRANEAN
	else if (endpoint === "/api/mediterranean/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a mediterranean dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// BREAKFAST
	else if (endpoint === "/api/breakfast/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a breakfast dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// DINNER
	else if (endpoint === "/api/dinner/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a dinner dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// LUNCH
	else if (endpoint === "/api/lunch/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a lunch dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// ICE CREAM
	else if (endpoint === "/api/icecream/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for an ice cream that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// CAKE
	else if (endpoint === "/api/cake/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a cake that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the cake followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// PASTRIES
	else if (endpoint === "/api/pastry/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a pastry dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// SIDE_DISH
	else if (endpoint === "/api/side-dish/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a side dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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

	// SALAD
	else if (endpoint === "/api/salad/recipe") {
		const ingredient = queryParams.get("ingredient");

		if (!ingredient) {
			return new Response("Ingredient not specified", { status: 400 });
		}

		const prompt = `Recipe for a salad dish that includes ${ingredient}.
		Unique ID: ${generateUniqueId()}
		Please include the name of the dish, followed by the ingredients and instructions.`;

		const recipeData = await fetchRecipe(prompt, apiKey);

		const recipeText = recipeData.recipe;

		conversation.push({ role: "user", content: ingredient });
		conversation.push({ role: "assistant", content: recipeData });

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
	const cacheKey = prompt;

	if (cache[cacheKey]) {
		return cache[cacheKey]; // Return the cached response if available
	}

	const response = await fetch("https://api.openai.com/v1/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			prompt: prompt,
			max_tokens: 400,
			temperature: 0.8,
			model: "gpt-3.5-turbo-instruct",
			n: 1,
			stop: null,
		}),
	});

	const data = await response.json();

	console.log(data);

	if (!data.choices || !data.choices[0] || !data.choices[0].text) {
		throw new Error("Unable to generate recipe");
	}

	const recipe = {
		recipe: data.choices[0].text.trim(),
	};

	cache[cacheKey] = recipe;

	return recipe;
}
