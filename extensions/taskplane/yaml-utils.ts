import { parseDocument } from "yaml";

function buildYamlErrorMessage(doc: ReturnType<typeof parseDocument>): string {
	const errors = doc.errors.map((err) => err.message.trim()).filter(Boolean);
	if (errors.length === 0) return "Invalid YAML document";
	return errors.join("; ");
}

export function parseYamlStrict(raw: string): unknown {
	const doc = parseDocument(raw, {
		prettyErrors: true,
		strict: true,
		uniqueKeys: true,
	});
	if (doc.errors.length > 0) {
		throw new Error(buildYamlErrorMessage(doc));
	}
	return doc.toJS();
}

export function parseYamlLoose(raw: string): unknown {
	const doc = parseDocument(raw, {
		prettyErrors: true,
		strict: false,
		uniqueKeys: true,
	});
	if (doc.errors.length > 0) {
		throw new Error(buildYamlErrorMessage(doc));
	}
	return doc.toJS();
}
