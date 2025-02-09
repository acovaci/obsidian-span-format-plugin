import { Plugin } from "obsidian";

import { spanFormatPlugin } from "./editor";

export default class SpanFormatPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(spanFormatPlugin);

		this.registerMarkdownPostProcessor((element, context) => {
			const paragraphs = element.findAll('p');

			for (let p of paragraphs) {
				const text = p.innerText.trim();

				const spanFormatRegex = /\{\{\s*(.+?)\s*\|(.*?)\}\}/g;

				let match;
				while ((match = spanFormatRegex.exec(text)) !== null) {
					console.log(`Tag: ${match[1]}, Value: ${match[2]}`);

					const startPos = match.index;
					const endPos = startPos + match[0].length;

					const spanFormatEl = p.createSpan({
						text: match[2],
					});
					spanFormatEl.addClasses(['span-format', 'span-format-display', `span-format--${match[1]}`]);

					// Replace the matched text with the span element
					const before = text.slice(0, startPos);
					const after = text.slice(endPos);
					p.innerHTML = `${before}${spanFormatEl.outerHTML}${after}`;
				}
			}
		});
	}

	onunload() { }
}
