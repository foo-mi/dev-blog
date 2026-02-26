// Quick test to verify the API works
const res = await fetch("http://localhost:3000/api/posts");
const data = await res.json();
console.log(`Found ${data.data.length} posts`);
console.log("First post:", data.data[0].title);
