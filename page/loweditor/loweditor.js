const _low_html = `
<div style="margin-top: 10px;">
<button id="loweditor-ap-strong" class="loweditor-tool-item"><b>B</b></button>
<button id="loweditor-ap-em" class="loweditor-tool-item"><em>I</em></button>
<button id="loweditor-ap-table" class="loweditor-tool-item"><b>插入表格&gt;</b></button>
<input id="loweditor-table-rows" class="loweditor-tool-input-item" placeholder="行">
<input id="loweditor-table-cols" class="loweditor-tool-input-item" placeholder="列">
</div>
<div id="loweditor-editor" class="loweditor-editor" contenteditable="true"></div>

<div id="loweditor-code-modal" class="loweditor-modal">
    <div class="loweditor-modal-content">
        <div class="loweditor-modal-header">
            <h5 class="loweditor-modal-title">请输入代码</h5>
            <span class="loweditor-close">&times;</span>
        </div>
        <div class="loweditor-modal-body">
            <textarea id="loweditor-code-input"></textarea>
        </div>
        <div class="loweditor-modal-footer">
            <button class="loweditor-close">取消</button>
            <button id="loweditor-insert-code-btn">插入</button>
        </div>
    </div>
</div>
`;
const $$ = document.getElementById.bind(document);
const $c = document.createElement.bind(document);

function LowEditor(containerid, options) {
    $$(containerid).innerHTML = _low_html;
    const editor = $$("loweditor-editor");
    function insertDom(dom) {
        const selection = window.getSelection();
        var node = selection.anchorNode;
        if (node == null) {
            return;
        }
        var range = selection.getRangeAt(0);
        if (range.startOffset == range.endOffset) {
            // 没有选中则整行
            var text = node.textContent;
            range = new Range();
            range.setStart(node, 0);
            range.setEnd(node, text.length);
        }
        var ext = range.extractContents();
        dom.appendChild(ext);
        range.insertNode(dom);
        // 重新设置光标位置
        selection.removeAllRanges();
        let nrange = new Range();
        nrange.setStart(dom, 1);
        nrange.setEnd(dom, 1);
        window.getSelection().addRange(nrange);
    }
    function _insertImage(dom) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        var ext = range.extractContents();
        dom.appendChild(ext);
        range.insertNode(dom);
        range.setStartAfter(dom);
    }
    function createTable(rows, cols) {
        var selection = window.getSelection();
        if (!selection.anchorNode.isContentEditable) {
            alert("请点击插入位置！");
            return;
        }
        var range = selection.getRangeAt(0);
        var ext = range.extractContents();

        var table = $c('table');
        table.style.border = "1px solid black";
        table.style.borderCollapse = "collapse";
        var tbody = $c('tbody');
        var thead = $c('thead');
        var tr = $c('tr');
        for (var j = 0; j < cols; j++) {
            var cell = $c('th');
            cell.innerHTML = `title${j + 1}`;
            cell.style.border = "1px solid black";
            tr.appendChild(cell);
        }
        thead.appendChild(tr);
        table.append(thead);
        for (var i = 0; i < rows; i++) {
            var row = $c('tr');
            for (var j = 0; j < cols; j++) {
                var cell = $c('td');
                cell.innerHTML = '-';
                cell.style.border = "1px solid black";
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        table.appendChild(ext);
        range.insertNode(table);
        selection.removeAllRanges();
    }
    function handleHeader() {
        // 获取光标
        var selection = window.getSelection();
        var anchorNode = selection.anchorNode;
        var anchorOffset = selection.anchorOffset;
        // 获取光标所在元素的内容，判断生成几级标题
        var text = anchorNode.textContent;
        var level = text.match(/#+/)[0].length;
        // 获取父元素
        var parent = anchorNode.parentNode;
        parent.removeChild(anchorNode);
        var newLineNode = $c(`h${level}`);
        newLineNode.textContent = text.replace(/#+\u00a0|#+ /, '');
        parent.appendChild(newLineNode);
        // 重新设置光标位置
        selection.removeAllRanges();
        let nrange = new Range();
        nrange.setStart(newLineNode, 1);
        nrange.setEnd(newLineNode, 1);
        window.getSelection().addRange(nrange);
    }
    function handleList() {
        var selection = window.getSelection();
        var anchorNode = selection.anchorNode;
        var text = anchorNode.textContent;
        text = text.replace(/\*[ |\u00a0]/, '');
        var parent = anchorNode.parentNode;
        parent.removeChild(anchorNode);
        var ul = $c('ul');
        var li = $c('li');
        li.innerText = text;
        ul.appendChild(li);
        parent.appendChild(ul);
        // 重新设置光标位置
        selection.removeAllRanges();
        let nrange = new Range();
        nrange.setStart(ul, 1);
        nrange.setEnd(ul, 1);
        window.getSelection().addRange(nrange);
    }
    function handleSortedList() {
        var selection = window.getSelection();
        var anchorNode = selection.anchorNode;
        var text = anchorNode.textContent;
        var start = text.match(/\d+/)[0];
        text = text.replace(/\d+\.[ |\u00a0]/, '');
        var parent = anchorNode.parentNode;
        parent.removeChild(anchorNode);
        var ol = $c('ol');
        ol.setAttribute("start", start);
        var li = $c('li');
        li.innerText = text;
        ol.appendChild(li);
        parent.appendChild(ol);
        // 重新设置光标位置
        selection.removeAllRanges();
        let nrange = new Range();
        nrange.setStart(ol, 1);
        nrange.setEnd(ol, 1);
        window.getSelection().addRange(nrange);
    }
    function handleTable() {
        var rows = $$("loweditor-table-rows").value;
        var cols = $$("loweditor-table-cols").value;
        if (!rows) {
            alert("请输入插入表格行数！");
            return;
        }
        if (!cols) {
            alert("请输入插入表格列数！");
            return;
        }
        createTable(rows, cols);
    }
    function applyStyle(style) {
        const element = $c(style);
        insertDom(element);
    }
    function insertImage(url) {
        const element = $c('img');
        element.src = url;
        _insertImage(element);
    }
    function insertUrl(url, filename) {
        const element = $c('a');
        element.setAttribute('href', url);
        element.setAttribute('target', '_blank');
        element.innerText = filename;
        _insertImage(element);
    }
    // 文件上传
    function upload(files) {
        // 创建FormData对象，用于将文件上传到服务器
        var formData = new FormData();
        var image_names = [];
        var file_names = [];
        // 将拖拽的文件添加到FormData对象中
        for (var i = 0; i < files.length; i++) {
            var name = `${Date.now()}_${files[i].name}`;
            formData.append('file', files[i], name);
            if (files[i].type.indexOf('image') !== -1) {
                image_names.push(name);
            } else {
                file_names.push(name);
            }
        }
        // 创建XMLHttpRequest对象，用于发送请求
        var xhr = new XMLHttpRequest();
        // 监听上传进度
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                var percent = (e.loaded / e.total) * 100;
                console.log('上传进度：' + percent + '%');
            }
        });
        // 监听上传完成事件
        xhr.addEventListener('load', (e) => {
            console.log('上传完成');
            for (var i = 0; i < image_names.length; i++) {
                insertImage(`${options.file.prefix}${image_names[i]}`);
            }
            for (var i = 0; i < file_names.length; i++) {
                insertUrl(`${options.file.prefix}${file_names[i]}`, file_names[i]);
            }
        });
        // 监听上传出错事件
        xhr.addEventListener('error', (e) => {
            console.log('上传出错');
        });
        // 监听上传取消事件
        xhr.addEventListener('abort', (e) => {
            console.log('上传取消');
        });
        // 发送请求
        xhr.open('POST', `${options.file.upload}`);
        xhr.send(formData);
    };
    if (options.file) {
        editor.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            var files = e.dataTransfer.files;
            upload(files);
        });
        // 粘贴文件、截图等
        editor.addEventListener('paste', (e) => {
            const clipboardData = e.clipboardData;
            if (clipboardData.types.includes('Files')) {
                e.preventDefault();
                e.stopPropagation();
                var files = clipboardData.files;
                upload(files);
            }
        });
    }
    editor.addEventListener('input', (e) => {
        var selection = window.getSelection();
        var anchorNode = selection.anchorNode;
        var text = anchorNode.textContent;
        if (text.match(/#+[ |\u00a0]./)) {
            handleHeader();
        } else if (text.match(/\*[ |\u00a0]/)) {
            handleList();
        } else if (text.match(/\d+\.[ |\u00a0]/)) {
            handleSortedList();
        }
    });
    var originNode = null;
    editor.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            // 回车
            var selection = window.getSelection();
            var anchorNode = selection.anchorNode;
            var text = anchorNode.textContent;
            if (text.startsWith("```")) {
                e.preventDefault();
                e.stopPropagation();
                originNode = anchorNode;
                showModal();
            }
        }
    });
    $$("loweditor-ap-strong").addEventListener("click", () => {
        applyStyle('strong');
    });
    $$("loweditor-ap-em").addEventListener("click", () => {
        applyStyle('em');
    });
    $$("loweditor-ap-table").addEventListener("click", () => {
        handleTable();
    });
    // 设置代码插入
    var insertCodeBtn = $$("loweditor-insert-code-btn");
    var closeBtns = document.querySelectorAll("#loweditor-code-modal .loweditor-close");
    insertCodeBtn.addEventListener("click", function () {
        // 隐藏输入框
        hideModal();
        // 原光标处插入代码
        if (originNode) {
            var lang = originNode.textContent.replaceAll("```", "");
            var pre = $c("pre");
            pre.setAttribute("contenteditable", "false");
            var code = $c("code");
            code.setAttribute('class', `language-${lang}`);
            code.innerText = $$("loweditor-code-input").value;
            pre.appendChild(code);
            originNode.after(pre);
            pre.after($c("br"));
            originNode.remove();
            // 清理
            originNode = null;
            $$("loweditor-code-input").value = '';
        }
    });
    var showModal = function () {
        var modal = $$("loweditor-code-modal");
        modal.style.display = "block";
        $$("loweditor-code-input").focus();
    };
    var hideModal = function () {
        var modal = $$("loweditor-code-modal");
        modal.style.display = "none";
    };
    for (var i = 0; i < closeBtns.length; i++) {
        var closeBtn = closeBtns[i];
        closeBtn.addEventListener("click", hideModal);
    }
    return {
        editor,
        getHtml: function () {
            return this.editor.innerHTML;
        },
        setHtml: function (html) {
            this.editor.innerHTML = html;
        },
        setEditable: function (enable) {
            this.editor.setAttribute("contenteditable", enable);
        }
    };
}