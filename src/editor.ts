import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import {
    ViewUpdate,
    PluginValue,
    EditorView,
    ViewPlugin,
    DecorationSet,
    PluginSpec,
    Decoration,
} from '@codemirror/view';

class SpanFormatPlugin implements PluginValue {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = this.buildDecorations(update.view);
        }
    }

    destroy() {
        // ...
    }

    buildDecorations(view: EditorView): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        const spanFormatRegex = /\{\{\s*(.+?)\s*\|(.*?)\}\}/g;

        for (let { from, to } of view.visibleRanges) {
            const text = view.state.doc.sliceString(from, to);

            let match;
            while ((match = spanFormatRegex.exec(text)) !== null) {
                console.log(`Tag: ${match[1]}, Value: ${match[2]}`);

                const startPos = from + match.index;
                const endPos = startPos + match[0].length;

                // Add decoration for the entire ^^text^^ range
                builder.add(
                    startPos,
                    endPos,
                    Decoration.mark({
                        class: `span-format span-format-editing span-format--${match[1]}`,
                    })
                );

                builder.add(
                    startPos,
                    startPos + 2,
                    Decoration.mark({
                        class: `span-format-delimiter span-format-delimiter-start`,
                    })
                );

                const classStartPos = startPos + 2;
                const classEndPos = classStartPos + match[1].length;

                const valueStartPos = classEndPos + 1;
                const valueEndPos = valueStartPos + match[2].length;

                // Add decoration for the class name
                builder.add(
                    classStartPos,
                    classEndPos,
                    Decoration.mark({
                        class: `span-format-class`,
                    })
                );

                // Add decoration for the class delimiter
                builder.add(
                    classEndPos,
                    valueStartPos,
                    Decoration.mark({
                        class: `span-format-delimiter span-format-delimiter-class`,
                    })
                );

                // Add decoration for the value
                builder.add(
                    valueStartPos,
                    valueEndPos,
                    Decoration.mark({
                        class: `span-format-value`,
                    })
                );

                builder.add(
                    endPos - 2,
                    endPos,
                    Decoration.mark({
                        class: `span-format-delimiter span-format-delimiter-end`,
                    })
                );
            }
        }

        return builder.finish();
    }
}

const pluginSpec: PluginSpec<SpanFormatPlugin> = {
    decorations: (value: SpanFormatPlugin) => value.decorations,
};

export const spanFormatPlugin = [ViewPlugin.fromClass(
    SpanFormatPlugin,
    pluginSpec
)];
