export function extractJsonFromSchema(jsonString: string) {
    return jsonString.replace(/```json|```/g, "").trim();
}