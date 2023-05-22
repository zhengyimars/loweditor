## 说明

基于markdown语法的简单富文本编辑器

## 引入&使用

```html
<link href="loweditor/loweditor.css" rel="stylesheet">
<script src="loweditor/loweditor.js"></script>
```

```html
<div id="editor"></div>
<script>
    var editor = LowEditor("editor", {
        file: {
            prefix: "files/",
            upload: "/upload"
        }
    });
</script>
```

## 代码高亮

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
<script>
    var editor = LowEditor("editor", {
        file: {
            prefix: "files/",
            upload: "/upload"
        },
        code_onload: (code) => {
            hljs.highlightElement(code);
        }
    });
</script>
```
