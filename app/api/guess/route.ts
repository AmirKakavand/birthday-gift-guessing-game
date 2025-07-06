import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;

  try {
    console.log("📤 Sending to OpenRouter:", JSON.stringify(messages, null, 2));

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free", // You can try other free models too
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // Required
          "Content-Type": "application/json",
        },
      }
    );

    let reply = response.data.choices[0].message.content;

    // Check if the assistant has said something about "speaker"
    if (
      reply.toLowerCase().includes("speaker") ||
      reply.toLowerCase().includes("bluetooth speaker") ||
      reply.toLowerCase().includes("jbl")
    ) {
      // Send the response with a special message to trigger model reveal
      reply += " [GIFT_REVEAL]"; // Add this to signal that the model should be revealed
    }

    return NextResponse.json({ content: reply });
  } catch (error: unknown) {
  if (error instanceof axios.AxiosError) {
    console.error('❌ OpenRouter Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  } else {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
}
