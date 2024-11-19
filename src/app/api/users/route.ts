import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.DATABASE_URL;
if (!uri) {
  throw new Error("Environment variable MONGO_URI is not defined");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run(userId: string | null) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    await client.connect();
    const cursor = await client.db("Cluster0").collection("users").findOne({ uuid: userId });
    return cursor;
  } finally {
    await client.close();
  }
}

export async function GET(request: Request) {
  const userId = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const user = await run(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
