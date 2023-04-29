import { recipes } from "./recipes";

addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
	const url = new URL(request.url);
	const endpoint = url.pathname.split("/")[1];

	if (endpoint === "recipes") {
		const ingredient = url.searchParams.get("ingredient");
		const matchingRecipes = recipes.filter((recipe) =>
			recipe.ingredients.some((i) => i.includes(ingredient))
		);
		return new Response(JSON.stringify(matchingRecipes), {
			headers: { "content-type": "application/json" },
		});
	}

	return new Response("Invalid endpoint", { status: 404 });
}
