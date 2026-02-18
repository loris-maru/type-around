import { renderToBuffer } from "@react-pdf/renderer";
import { EulaPdfDocument } from "@/lib/eula-pdf";

export async function POST(request: Request) {
  try {
    const { eulaText } = await request.json();

    if (!eulaText || typeof eulaText !== "string") {
      return Response.json(
        { error: "EULA text is required" },
        { status: 400 }
      );
    }

    const buffer = await renderToBuffer(
      EulaPdfDocument({ eulaText })
    );
    const uint8 = new Uint8Array(buffer);

    return new Response(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="EULA.pdf"',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "PDF generation failed";
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
