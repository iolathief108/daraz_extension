// another - product photo
import {run_when_active, sleep} from '../../global'

let css = `
.next-table.ol-base-table .next-table-body table tbody tr td:nth-child(1) > div {
    display: -webkit-inline-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding: 0px 8px;
}

.next-table.ol-base-table .next-table-body table tbody tr td:nth-child(1) > img {
    width: 100%;
}`

interface resData {
    data: {
        tableData: Array<{ titleDetail: { imgUrl: string } }>
    }
}


/*
* Update Image Function
* */
async function updateImageV2() {
    // scroll to top
    setTimeout(() => window.scrollTo(0, 0), 200)


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
    let data: resData = have_data ? JSON.parse($Intercepted_data.text()) : undefined

    // for each row
    let $table_rows = $('.next-table.ol-base-table .next-table-body table tbody tr')
    for (let i = 0; i < $table_rows.length; i++) {

        let d = document.getElementById(`a1${i}`)
        if (d) { // if image already exist replace the src
            try {
                // @ts-ignore
                d.src = data.data.tableData[i].titleDetail.imgUrl + '_170x170q75.jpg_.webp'
            } catch {
                console.error(data)
            }
        } else {
            // add new images
            $($table_rows[i]).find('td:nth-child(1)').prepend(
                `<img id="a1${i}" alt="" src="${data.data.tableData[i].titleDetail.imgUrl}_170x170q75.jpg_.webp">`)
        }
    }

    // remove newdata class from intercepted data
    $Intercepted_data.removeClass('newdata')
}


/*
* Main Function
* */
function addImage() {

    // updateImageV2 run count
    let a1: number = 0

    /* run at the beginning */
    const s = document.createElement('script')
    s.src = chrome.extension.getURL('injected.js')
    s.onload = function () {
        // @ts-ignore
        this.remove()
    };
    (document.head || document.documentElement).appendChild(s)

    chrome.runtime.onMessage.addListener(
        () => {
            if (a1 > 0) updateImageV2()
            else {
                run_when_active(['input#toolbar_name_ipt', 'input#toolbar_Sku_ipt', 'input#toolbar_brandName_ipt']).then(() => updateImageV2())
                a1++
            }
        },
    )


    $(() => {

        /* run when dom is ready */
        let style = $('<style>')
        style.text(css)
        $('head').append(style)
    })
}


export default function () {
    if (window.location.href.match(/https:\/\/sellercenter.daraz.lk\/product\/portal\/index.*/g)) addImage()
}
