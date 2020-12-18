import {
    add_button,
    is_switch_on,
    is_link_active,
    wait_for_finish_load, sku_exclude, sku_exclude_data,
} from './global'
import {sleep} from '../../global'


let select_exclude_btn: JQuery

let css = `
    .bg {
        /*background-color: none;*/
    }
    .bg.exclude {
        background-color: #bc00de47;
    }`


/*
* Wrapper Functions
* */
async function getExcludeList(): Promise<sku_exclude_data> {
    let ok = false
    let data: sku_exclude_data = []

    chrome.storage.local.get('sku_exclude', function (result) {
        if (result.sku_exclude === undefined) {
            init_sku_exclude()
            ok = true
        } else {
            data = result.sku_exclude
            ok = true
        }
    })

    while (!ok) {
        await sleep(200)
    }

    return data
}

function setExcludeList(sku_exclude_data: sku_exclude_data) {
    chrome.storage.local.set({
        'sku_exclude': sku_exclude_data,
    })
}

function init_sku_exclude() {
    let data: sku_exclude = {
        'sku_exclude': [],
    }
    chrome.storage.local.set(data)
}


/*
* Button Click Handlers
* */
async function onReloadBtnClick() {

    let table_rows = $('.next-table.ol-base-table .next-table-body table tbody tr')
    let sku_exclude_data = await getExcludeList()

    // Loop through Table Row
    for (let i = 0; i < table_rows.length; i++) {

        let $table_row: JQuery = $(table_rows[i])

        // if switch on and link enabled
        if (is_switch_on($table_row) && is_link_active($table_row)) {

            // sku
            let sku = $table_row.find('td:nth-child(2) > div').text()

            // skip if sku in exclude_list
            if (sku_exclude_data.includes(sku))
                continue

            // switch
            let $next_switch = $table_row.find('td:nth-child(9) .active-switch .next-switch')

            // switch off and wait till loading is finished
            $next_switch.trigger('click')
            await wait_for_finish_load(200, 300)

            // switch on and wait till loding is finished (we using while loop for make sure switched on correctly)
            while (true) if (!is_switch_on($table_row) && is_link_active($table_row)) {
                $next_switch.trigger('click')
                break
            } else await sleep(100)
            await wait_for_finish_load(400, 100)
        }
    }
}

async function onSelectBtnClick() {
    let $table_rows = $('.next-table.ol-base-table .next-table-body table tbody tr')
    let sku_exclude_list = await getExcludeList()

    if (select_exclude_btn.text() === 'Select') {

        select_exclude_btn.text('Submit')

        for (let i = 0; i < $table_rows.length; i++) {
            let $table_row = $($table_rows[i])

            // current row SKU
            let sku: string = $table_row.find('td:nth-child(2) > div').text()

            // add bg class
            $table_row.addClass('bg')

            // if this sku is in the sku_exclude_list => add class exclude
            if (sku_exclude_list.includes(sku))
                $table_row.addClass('exclude')

            // row click Handle
            $table_row.on('click', () => {
                if ($table_row.hasClass('exclude'))
                    $table_row.removeClass('exclude')
                else
                    $table_row.addClass('exclude')
            })
        }
    } else {

        select_exclude_btn.text('Select')

        for (let i = 0; i < $table_rows.length; i++) {

            let table_row = $($table_rows[i])
            let sku = table_row.find('td:nth-child(2) > div').text()
            let is_exclude_already = sku_exclude_list.includes(sku)

            // if exclude put it into exclude
            if (table_row.hasClass('exclude')) {
                if (!is_exclude_already) sku_exclude_list.push(sku)
            } else if (is_exclude_already) sku_exclude_list = sku_exclude_list.filter(value => value !== sku)

            // unbind event listeners
            table_row.off('click')

            // remove class exclude and bg
            table_row.removeClass(['exclude', 'bg'])
        }

        // set data to local storage
        setExcludeList(sku_exclude_list)
    }
}


/*
* Main Function
* */
function refresh() {
    let style = $('<style>')
    style.text(css)
    $('head').append(style)
    add_button('Reload', () => onReloadBtnClick())
    select_exclude_btn = add_button('Select', () => onSelectBtnClick())
}

export default function () {
    if (window.location.href.match(/https:\/\/sellercenter.daraz.lk\/product\/portal\/index.*/g)) $(() => refresh())
}