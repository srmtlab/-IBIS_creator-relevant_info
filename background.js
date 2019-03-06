let addPageID = chrome.contextMenus.create({
    title: "このページのURLを関連情報として登録",
    contexts: ["page"],
    type: "normal",
    enabled : false
});

/*
let addLinkID = chrome.contextMenus.create({
    title: "リンク先のURLを関連情報として登録",
    contexts: ["link"],
    type: "normal",
    onclick: function (info, tab) {
        //info によってpageかlinkかを判断
        let link_title = tab.title;
        let link_url = info.linkUrl;

        console.log(info);
        console.log(tab);
    }
});
*/

let addSelectionID = chrome.contextMenus.create({
    title: "選択したテキスト名でこのページのURLをIBISの関連情報として登録",
    contexts: ["selection"],
    type: "normal",
    enabled : false
});

let nodeID_list = [];
let PageID_list = [];
let SelectionID_list = [];
let node_list = [];


for(let i = 0; i < 10 ; i++) {
    PageID_list.unshift(chrome.contextMenus.create({
        title: "なし",
        contexts: ["all"],
        type: "normal",
        parentId : addPageID,
        visible : false
    }));

    SelectionID_list.unshift(chrome.contextMenus.create({
        title: "なし",
        contexts: ["all"],
        type: "normal",
        parentId : addSelectionID,
        visible : false
    }));
}



chrome.runtime.onMessage.addListener(function (node_data) {

    let node_id = node_data.node_id;

    if(nodeID_list.length === 0){
        chrome.contextMenus.update(addPageID,{
            enabled : true
        });
        /*
        chrome.contextMenus.update(addLinkID,{
            enabled : true
        });
        */
        chrome.contextMenus.update(addSelectionID,{
            enabled : true
        });
    }

    if (nodeID_list.indexOf(node_id) === -1){

        nodeID_list.push(node_id);
        node_list.push(node_data);

        if(nodeID_list.length > 10){
            nodeID_list.shift();
            node_list.shift();
        }

        for(let i = node_list.length - 1, index = 9; i >= 0 ; index--, i--) {
            chrome.contextMenus.update(PageID_list[index],{
                title: node_list[i]["context_name"],
                visible : true,
                onclick: function (info, tab) {
                    //info によってpageかlinkかを判断
                    $.ajax({
                        type: 'POST',
                        url: "http://lod.srmt.nitech.ac.jp/IBIS_creator/api/theme/" + node_list[i]["theme_id"] + "/relevant/add/",
                        data:
                            {
                                'node_id' : node_list[i]["node_id"],
                                'relevant_url' : info.pageUrl,
                                "relevant_title": tab.title,
                            }
                    });
                }
            });

            chrome.contextMenus.update(SelectionID_list[index],{
                title: node_list[i]["context_name"],
                visible : true,
                onclick: function (info) {
                    //info によってpageかlinkかを判断
                    $.ajax({
                        type: 'POST',
                        url: "http://lod.srmt.nitech.ac.jp/IBIS_creator/api/theme/" + node_list[i]["theme_id"] + "/relevant/add/",
                        data:
                            {
                                'node_id' : node_list[i]["node_id"],
                                'relevant_url' : info.pageUrl,
                                "relevant_title": info.selectionText,
                            }
                    });
                }
            });
        }
    }
});

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.create({ url: "http://lod.srmt.nitech.ac.jp/IBIS_creator/" });
});