describe("ap1/v1/status - get", () => {
  const apiUrl = "http://localhost:3000/api/v1/status";

  test("GET to /api/v1/status should return status code 200", async () => {
    const response = await fetch(apiUrl, { method: "GET" });
    expect(response.status).toBe(200);
  });
});
