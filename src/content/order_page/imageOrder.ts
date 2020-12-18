// another - product photo
import {run_when_active, sleep} from '../../global'
import Axios from 'axios'
import {datediff} from '../product_page/global'

let css = `
.invoice img {
    width: 100%;
}
td.invoice, th.invoice {
    width: 172px;
}
.next-table td.invoice, .next-table td:nth-child(2) {
    border-bottom: 1.5px solid;
}`

type resData = {
    orders: Array<{ id: number }>
    sellerId: number
    tabs: {
        activeKey: string
    }
}

type resItems = {
    items: {
        [key: string]: Array<{ image: Array<{ thumbnail: string, title: string, value: string }> }>
    }
}

async function getItems(sellerId: string, orderId: string, tab: string): Promise<resItems> {
    let data = await Axios({
        method: 'get',
        url: `https://sellercenter.daraz.lk/order/items?sellerId=${sellerId}&orderId=${orderId}&archive=&tab=${tab}`,
        responseType: 'json',
    })

    return data.data
}

/*
* Local Storage: xcf1
* */
type data_xcf1 = Array<{
    order_id: string
    img_uri: Array<string>
    date_updated: {
        y: number,
        m: number,
        d: number
    }
}>

type data_xcf1_chrome_set = {
    xcf1: data_xcf1
}

function init_xcf1() {
    let data: data_xcf1_chrome_set = {
        xcf1: [],
    }
    chrome.storage.local.set(data)
}

function set_xcf1_data(data: data_xcf1) {
    let set_d: data_xcf1_chrome_set = {
        xcf1: data,
    }
    chrome.storage.local.set(set_d)
}

async function get_xcf1(): Promise<data_xcf1> {
    let ok = false
    let data: data_xcf1 = []

    chrome.storage.local.get('xcf1', function (result) {
        if (result.xcf1 === undefined) {
            init_xcf1()
            ok = true
        } else {
            data = result.xcf1
            ok = true
        }
    })

    while (!ok) {
        await sleep(200)
    }

    return data
}


/*
* Update Image Function
* */
async function updateImageV2() {
    // scroll to top
    setTimeout(() => {
        $('html, body').animate({
            // @ts-ignore
            scrollTop: $('.next-table-header').offset().top,
        }, 50)
    }, 260)


    let $Intercepted_data = $('#__interceptedData')

    // Check if #__interceptedData has the nessaccary data (if not we'll give some time for fill the data using while loop)
    let while_run_time = 10000
    let current_time = 0
    while (!$Intercepted_data.hasClass('newdata')) {
        if (while_run_time < current_time)
            break
        current_time += 100
        await sleep(100)
    }
    let have_data = $Intercepted_data.hasClass('newdata')

    // return if no newdata fount
    if (!have_data) return

    // parse intercepted data as json object
    let data: resData
    try {
        data = have_data ? JSON.parse($Intercepted_data.text()) : undefined
    } catch {
        return
    }

    let tab = data.tabs.activeKey

    let seller_id = data.sellerId
    let order_ids = data.orders.map(value => value.id)

    let $table_rows = $('.next-table.orders-table .next-table-body table tbody tr.next-table-row')
    // let $table_expanded_rows = $('.next-table.orders-table .next-table-body table tbody tr.next-table-expanded-row')

    let xcf1_all_objects: data_xcf1 = await get_xcf1()

    // for each row
    for (let i = 0; i < order_ids.length; i++) {

        let xxx = 0
        let ok = false
        let storage = false
        while (!ok && xxx < 5) {
            xxx++
            try {
                let img_found = false
                let imgs: Array<string> = []
                for (let j = 0; j < xcf1_all_objects.length; j++) {
                    if (xcf1_all_objects[j].order_id === String(order_ids[i])) {
                        let dd = new Date()
                        console.log(dd)
                        xcf1_all_objects[j].date_updated = {
                            d: dd.getDate(),
                            m: dd.getMonth(),
                            y: dd.getFullYear()
                        }

                        imgs = xcf1_all_objects[j].img_uri
                        img_found = true
                        storage = true
                    }
                }

                let el = $($table_rows[i])
                if (!img_found) {
                    let order_data = await getItems(String(seller_id), String(order_ids[i]), tab)
                    imgs = order_data.items[Object.keys(order_data.items)[0]].map(value => value.image[0].value)
                    let ddd = new Date()
                    xcf1_all_objects.push({
                        order_id: String(order_ids[i]),
                        img_uri: imgs,
                        date_updated: {
                            y: ddd.getFullYear(),
                            m: ddd.getMonth(),
                            d: ddd.getDate()
                        },
                    })

                }

                // remove all divs
                el.find('td:nth-child(3) > div').remove()
                // remove all previous imgs
                el.find('td:nth-child(3) > img').remove()

                // add new imgs
                let r = el.find('td:nth-child(3)')
                for (let j = 0; j < imgs.length; j++) r.append(`<img src="${imgs[j]}_200x200q95.jpg_.webp" alt="">`)

                ok = true
            } catch {
                await sleep(200)
            }
        }
        if (!storage)
            await sleep(100)


    }
    set_xcf1_data(xcf1_all_objects)
    // remove newdata class from intercepted data
    $Intercepted_data.removeClass('newdata')
}


/*
* Main Function
* */
async function addImage() {

    // updateImageV2 run count
    let a1: number = 0

    /* run at the beginning */
    const s = document.createElement('script')
    s.src = chrome.extension.getURL('injected_orders.js')
    s.onload = function () {
        // @ts-ignore
        this.remove()
    };
    (document.head || document.documentElement).appendChild(s)

    let d = await get_xcf1()
    for (let i = 0; i < d.length; i++) {
        let value = d[i]
        // let r = datediff(new Date(value.date_updated.y, value.date_updated.m, value.date_updated.d), new Date())
        if (datediff(new Date(value.date_updated.y, value.date_updated.m, value.date_updated.d), new Date()) > 30)
            d = d.filter(value1 => value1.order_id !== value.order_id)
    }
    set_xcf1_data(d)

    chrome.runtime.onMessage.addListener(
        () => {
            if (a1 > 0) updateImageV2()
            else {
                run_when_active([
                    '.next-table.orders-table table tbody tr.next-table-row',
                    '.next-table-expanded-row',
                    '.items-container']).then(() => updateImageV2())
                a1++
            }
        },
    )


    $(() => {

        /* run when dom is ready */

        let style = $('<style>')
        style.text(css)
        $('head').append(style)
        run_when_active([
            '.next-table.orders-table table tbody tr.next-table-row',
            '.next-table-expanded-row',
            '.items-container']).then(() => updateImageV2())
    })
}


export default function () {
    if (window.location.href.match(/https:\/\/sellercenter.daraz.lk\/order\/query.*/g)) addImage()
}
