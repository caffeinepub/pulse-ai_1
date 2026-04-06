// Mock API service for Pulse AI
// Simulates authentication and Spark generation with artificial delays

const AUTH_ENDPOINT = "https://api.pulseai.app/auth/login";
const GENERATE_ENDPOINT = "https://api.pulseai.app/ai/generate";

const MOCK_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInVzZXJuYW1lIjoiYWtoaWxlc2giLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwMzYwMH0.mock_signature_pulse_ai";

const PICSUM_SEEDS = [
  "aurora",
  "nebula",
  "cosmos",
  "prism",
  "vortex",
  "cipher",
  "synth",
  "glitch",
  "pulse",
  "neon",
  "matrix",
  "void",
  "echo",
  "spark",
  "ignite",
];

/**
 * Authenticates a user against the Pulse AI auth endpoint.
 * Mocks a 1.5s network delay and returns a fake JWT token on success.
 * Saves the token to localStorage under "pulse_token".
 */
export async function authenticateUser(
  username: string,
  password: string,
): Promise<string> {
  if (!username.trim() || !password.trim()) {
    throw new Error("Invalid credentials");
  }

  // Simulate POST to auth endpoint (mocked)
  const _payload = {
    endpoint: AUTH_ENDPOINT,
    method: "POST",
    body: { username: username.trim(), password },
  };
  void _payload;

  // Artificial 1.5s delay to simulate network round-trip
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Save mock JWT to localStorage
  localStorage.setItem("pulse_token", MOCK_JWT);

  return MOCK_JWT;
}

/**
 * Generates a Spark image using a Gemini-style payload.
 * Mocks a 2s API call and returns a random high-quality image URL.
 */
export async function generateSpark(
  prompt: string,
  style: string,
): Promise<string> {
  // Simulate Gemini-style structured payload
  const _geminiPayload = {
    endpoint: GENERATE_ENDPOINT,
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("pulse_token") ?? MOCK_JWT}`,
      "Content-Type": "application/json",
    },
    body: {
      model: "gemini-2.0-flash-exp",
      generation_config: {
        response_modalities: ["image", "text"],
        temperature: 0.9,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a high-quality ${style} style image. ${prompt || `Cinematic ${style} artwork with neon violet accents`}`,
            },
          ],
        },
      ],
    },
  };
  void _geminiPayload;

  // Artificial 2s delay to simulate model inference
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return a random high-quality image from Picsum Photos
  const seed = PICSUM_SEEDS[Math.floor(Math.random() * PICSUM_SEEDS.length)];
  return `https://picsum.photos/seed/${seed}/800/600`;
}
