// function get_active_product_count() {
//     let count = 0
//     $('.next-table.ol-base-table .next-table-body table tbody tr').each(function () {
//         if (is_link_active($(this)) && is_switch_on($(this))) count++
//     })
//     return count
// }

import {run_when_active, sleep} from '../../global'

// sku exclude
export type sku_exclude_data = Array<string>
export type sku_exclude = {
    sku_exclude: sku_exclude_data
}


export function is_switch_on($element: JQuery) {
    let a = $element.find('td:nth-child(9) .active-switch .next-switch')
    return a.attr('aria-checked') === 'true'
}


export function is_link_active($element: JQuery) {
    let b = $element.find('td:nth-child(1) > div > a')
    return b.length !== 0
}


export async function wait_for_finish_load(sleep_Start?: number, sleep_after?: number) {

    if (sleep_Start)
        await sleep(sleep_Start)

    while (true) {
        let t = $('.next-table .next-table-loading')
        if (t.length === 0)
            break
        else await sleep(100)
    }

    if (sleep_after)
        await sleep(sleep_after)
}


export function add_button(text: string, callback: Function): JQuery {
    let $btnUpdatePrice = $(`<button>${text}</button>`)
    $btnUpdatePrice.on('click', () => callback())
    run_when_active(['#toolbar_filter_btn']).then(() => $('#toolbar_filter_btn').after($btnUpdatePrice))
    return $btnUpdatePrice
}


export function datediff(date_before: Date, date_after: Date):number {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    // @ts-ignore
    return Math.round((date_after - date_before) / (1000 * 60 * 60 * 24))
}


