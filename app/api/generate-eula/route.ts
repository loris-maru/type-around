import Anthropic from "@anthropic-ai/sdk";
import { eulaFormSchema } from "@/types/eula";
import {
  PERMITTED_USE_TYPE_OPTIONS,
  LICENSE_TYPE_OPTIONS,
  PERMITTED_USERS_OPTIONS,
  GEOGRAPHIC_SCOPE_OPTIONS,
} from "@/types/eula";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are an expert legal document drafter specializing in Korean intellectual property law, particularly font/typeface licensing. You have deep expertise in:

- Korean Copyright Act (저작권법) and its treatment of fonts as software/program works
- Korean font industry licensing practices and standards
- International font licensing conventions (inspired by EULA structures from major foundries)
- Bilingual (Korean/English) legal drafting

Your task is to generate a complete, professional, and legally precise End User License Agreement (EULA) for a Korean type designer or foundry. The EULA must:

1. Be written in proper Korean legal style (using formal 합니다체)
2. Follow standard Korean contract structure with numbered articles (제1조, 제2조, etc.)
3. Include all standard EULA sections: definitions, grant of license, restrictions, intellectual property, termination, limitation of liability, and governing law
4. Reference relevant Korean Copyright Act provisions where appropriate
5. Be specific to fonts/typefaces (not generic software)
6. Protect the type designer's rights while being fair to licensees
7. Use clear and unambiguous language

When outputting bilingual, provide the Korean version first in full, then the English translation in full, clearly separated with a divider.

Output the EULA as plain text with clear formatting using line breaks and numbering. Do not use markdown formatting.`;

function buildUserPrompt(
  data: Record<string, unknown>
): string {
  const d = data as Record<
    string,
    string | string[] | boolean
  >;

  const licenseTypeLabel =
    LICENSE_TYPE_OPTIONS.find(
      (o) => o.value === d.licenseType
    )?.label || d.licenseType;
  const permittedUsersLabel =
    PERMITTED_USERS_OPTIONS.find(
      (o) => o.value === d.permittedUsers
    )?.label || d.permittedUsers;
  const geoScopeLabel =
    GEOGRAPHIC_SCOPE_OPTIONS.find(
      (o) => o.value === d.geographicScope
    )?.label || d.geographicScope;

  const useTypes = (d.permittedUseTypes as string[])
    .map(
      (v) =>
        PERMITTED_USE_TYPE_OPTIONS.find(
          (o) => o.value === v
        )?.label || v
    )
    .join(", ");

  const fontFormats = (d.fontFormats as string[]).join(
    ", "
  );
  const fontFamilies = (d.fontFamilies as string[]).join(
    ", "
  );

  let geoScope = geoScopeLabel;
  if (
    d.geographicScope === "custom" &&
    d.customGeographicScope
  ) {
    geoScope = d.customGeographicScope as string;
  }

  let governingLaw = "Korean law (대한민국법)";
  if (d.governingLaw === "other" && d.customGoverningLaw) {
    governingLaw = d.customGoverningLaw as string;
  }

  return `Please generate a complete EULA with the following details:

**Licensor Information:**
- Foundry/Studio: ${d.foundryName}
- Designer: ${d.designerName}
- Business Registration: ${d.businessRegistrationNumber || "N/A"}
- Email: ${d.contactEmail}
- Website: ${d.website || "N/A"}
- Country: ${d.country}

**Font Product:**
- Font Family Name(s): ${fontFamilies}
- Format(s): ${fontFormats}
- Version/Date: ${d.versionOrDate || "N/A"}

**License Scope:**
- License Type: ${licenseTypeLabel}
- Permitted Users/Seats: ${permittedUsersLabel}
- Permitted Uses: ${useTypes}
- Geographic Scope: ${geoScope}

**Restrictions:**
- Sublicensing: ${d.allowSublicensing ? "Allowed" : "Not allowed"}
- Modification/Derivatives: ${d.allowModification ? "Allowed" : "Not allowed"}
- Redistribution: ${d.allowRedistribution ? "Allowed" : "Not allowed"}
- AI/ML Training: ${d.allowAiMlTraining ? "Allowed" : "Not allowed"}
- Embedding Protection Clause: ${d.includeEmbeddingProtection ? "Include" : "Exclude"}

**Legal Preferences:**
- Governing Law: ${governingLaw}
- Dispute Resolution: ${d.disputeResolution === "korean-courts" ? "Korean courts (대한민국 법원)" : "Arbitration (중재)"}
- Output Language: ${d.outputLanguage === "bilingual" ? "Bilingual (Korean + English)" : "Korean only"}
- Include Korean Copyright Act Reference: ${d.includeKoreanCopyrightAct ? "Yes" : "No"}

Generate a comprehensive and professional EULA based on the above specifications.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = eulaFormSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "Invalid form data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt(
      parsed.data as unknown as Record<string, unknown>
    );

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({
                text: event.delta.text,
              });
              controller.enqueue(
                encoder.encode(`data: ${data}\n\n`)
              );
            }
          }
          controller.enqueue(
            encoder.encode("data: [DONE]\n\n")
          );
          controller.close();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Stream error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: message })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal server error";
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
