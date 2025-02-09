import { Plugin } from "obsidian";

import { spanFormatPlugin } from "./editor";

export default class SpanFormatPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(spanFormatPlugin);

		this.registerMarkdownPostProcessor((element, context) => {
			const paragraphs = element.findAll('p');

			for (let p of paragraphs) {
				const spanFormatRegex = /\{\{\s*(.+?)\s*\|(.*?)\}\}/g;

				const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, null);

				const toReplace = new Map<Node, RegExpMatchArray[]>();

				while (walker.nextNode()) {
					const node = walker.currentNode;
					const textContent = node.textContent;
					if (!textContent) continue;

					const matches = textContent.matchAll(spanFormatRegex);
					toReplace.set(node, Array.from(matches));
				}

				for (let [node, matches] of toReplace) {
					if (!node.textContent) continue;
					const fragment = document.createDocumentFragment();
					let text = node.textContent;

					for (let match of matches) {
						const [before, after] = text.split(match[0]);

						console.log(`Match: ${match[0]}`);
						console.log(`Text length: ${text.length}`);
						console.log(`Before length: ${before.length}`);
						console.log(`After length: ${after.length}`);

						const spanFormatEl = p.createSpan({
							text: match[2],
						});
						spanFormatEl.addClasses(['span-format', 'span-format-display', `span-format--${match[1]}`]);

						fragment.appendChild(document.createTextNode(before));
						fragment.appendChild(spanFormatEl);

						text = after;
					}

					if (text) {
						fragment.appendChild(document.createTextNode(text));
					}

					node.parentNode?.replaceChild(fragment, node);
				}
			}
		});
	}

	onunload() { }
}
