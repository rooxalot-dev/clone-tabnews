describe("ap1/v1/status - get", () => {
  const apiUrl = "http://localhost:3000/api/v1/status";

  test("GET to /api/v1/status should return status code 200", async () => {
    const response = await fetch(apiUrl, { method: "GET" });
    const responseBody = await response.json();

    console.log('status response body', responseBody);

    expect(response.status).toBe(200);

    expect(responseBody.updated_at).toBeDefined();
    const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
    expect(parsedUpdatedAt).toEqual(responseBody.updated_at);

    expect(responseBody.dependencies).toBeDefined();

    const { database } = responseBody.dependencies;
    expect(database).toBeDefined();
    expect(database.version).toBeDefined();
    expect(typeof database.version).toBe('number')
    expect(database.version).toBe(16.0); // recommended version;
    expect(database.max_connections).toBeDefined();
    expect(typeof database.max_connections).toBe('number')
    expect(database.used_connections).toBeDefined();
    expect(typeof database.used_connections).toBe('number')
  });
});
