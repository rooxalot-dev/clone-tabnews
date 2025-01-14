describe("ap1/v1/migrations - get", () => {
  const apiUrl = "http://localhost:3000/api/v1/migrations";

  test("GET to /api/v1/migrations should return status code 200", async () => {
    const response = await fetch(apiUrl, { method: "GET" });
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    console.log('status response body', responseBody);

    expect(Array.isArray(responseBody)).toBe(true);
  });
});
