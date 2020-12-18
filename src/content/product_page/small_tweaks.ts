import {run_when_active} from '../../global'


function filter_input_hotkey() {
    let selectors = ['input#toolbar_name_ipt', 'input#toolbar_Sku_ipt', 'input#toolbar_brandName_ipt']

    run_when_active(selectors).then(() =>
        selectors.forEach(selector =>
            $(selector).on('keyup', e => {
                if (e.key === 'Enter' || e.keyCode === 13) $('button#toolbar_filter_btn').trigger('click')
            }),
        )
    )
}


export default function () {
    if (window.location.href.match(/https:\/\/sellercenter.daraz.lk\/product\/portal\/index.*/g))
        $(() => filter_input_hotkey())
}
