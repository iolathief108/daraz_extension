// chrome.webRequest.onBeforeRequest.addListener(req=>{
//     console.log(req)
//     if (req.url.match(/https:\/\/sellercenter.daraz.lk\/product\/portal\/search\?.+/)) {
//
//     }
// }, {urls:['<all_urls>']})
import {ch_img_type} from '../global'

chrome.webRequest.onCompleted.addListener(req => {
    console.log(req.url)
    if (req.url.match(/(https:\/\/sellercenter.daraz.lk\/product\/portal\/search\?.+)|(https:\/\/sellercenter.daraz.lk\/order\/data\?.+)/)) {
        let message: ch_img_type = {
            url: req.url,
        }
        chrome.tabs.sendMessage(req.tabId, message)
    }
}, {
    urls: [
        'https://sellercenter.daraz.lk/order/*',
        'https://sellercenter.daraz.lk/product/portal/*',
    ],
})

