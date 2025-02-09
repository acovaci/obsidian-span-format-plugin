# Span-based Text Formatting

This Obsidian plugin allows you to apply span-based formatting to your text. It was created with two
goals in mind:

1. **Flexibility**: CSS Snippets are the intended way of adding custom styling to your custom
   formats. This allows you to style your text in any way you want.
2. **Stay out of the way**: The plugin should not interfere with the way you write your notes. In
   adherence to the philosophy of [Markdown](https://daringfireball.net/projects/markdown/), the
   plugin doesn't do any fancy changes to the text, and it does not hide the formatting characters
   while in editing mode.

## Installation

This plugin is not published yet, so you will have to install it manually. You can download the
[main.js](main.js), [styles.css](styles.css), and [manifest.json](manifest.json) files from this
repository and place them in a folder named `span-format` in your Obsidian plugins. You can then go
to the **Community Plugins** settings and enable the plugin.

## Usage

The plugin extends the Markdown syntax by adding a way to apply a class to a piece of text. The
syntax is as follows:

```markdown
{{class-name|Text}}
```

This will create a `span` element with the class `span-format--class-name` and the text `Text`. You
can then style this class in your CSS Snippets. For very simple use cases, like changing the color,
background color, or background opacity, there are three variables exposed:

- `--span-format-color`: The color of the text.
- `--span-format-color-opacity`: The opacity of the text.
- `--span-format-background-color`: The background color of the text. This is computed automatically
  based on the two variables above, but you can override it if you want.

For example, the following CSS Snippet will make the text red with a slightly red background:

```css
.span-format.span-format--class-name {
    --span-format-color: red;
}
```

However, you can style the text in any way you want. The variables are just a convenience for simple
cases, but any valid CSS is allowed.

> [!IMPORTANT]
> It is **essential** that the changes you make to the text while in editing mode are purely
> cosmetic. The plugin only renders the text you are currently looking at, thus changing the size of
> the text or adding new lines will have unintended effects on the layout of your text, potentially
> disrupting the editing flow.

You can also make use of `::before` and `::after` pseudo-elements to add additional styling to the
text. For example, we can add a pencil emoji before the text. However, because we **must not** 
change the dimensions of the text in editing mode, we must specify that this change should only be
reflected in the *View* mode:

```css
.span-format.span-format-display.span-format--class-name::before {
    content: "✏️";
}
```

This will add a pencil emoji before the text when in view mode, but not in editing mode.

## License

This plugin is licensed under the [MIT License](LICENSE).
