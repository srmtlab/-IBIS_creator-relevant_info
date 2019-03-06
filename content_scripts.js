document.getElementById("relevant-info-searches-button").onclick = function (event) {

    let context_name = "ノード : " + this.getAttribute("data-node-name")
        + " (テーマ : " + this.getAttribute("data-theme-name") + ")";

    chrome.runtime.sendMessage({
        "theme_id" : this.getAttribute("data-theme-id"),
        "node_id" : this.getAttribute("data-node-id"),
        "context_name" : context_name
    });
};
