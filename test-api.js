const payload = {
  context: "I need to tell my manager that the project will be delayed by two days due to unexpected server downtime.",
  recipient: "manager",
  tone: "professional",
  length: "short"
};

async function runTests() {
  console.log("--- Test 1: Successful Generation ---");
  let res = await fetch("http://localhost:3000/api/generate-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  console.log("Status:", res.status);
  let data = await res.json();
  console.log(data);

  console.log("\n--- Test 2: Invalid Server Input ---");
  res = await fetch("http://localhost:3000/api/generate-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, context: "too short" })
  });
  console.log("Status:", res.status);
  console.log(await res.json());

}
runTests();
