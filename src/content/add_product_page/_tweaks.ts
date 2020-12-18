import {run_when_active} from '../../global'

let css = `
.invoice img {
    width: 100%;
}`


function tab_navigation() {
    // title to category
    $('.ui-item.parent-title.translateInput .translate-input input').keydown(e=>{
        if(e.key === 'Tab') {
            $('.category-input input').trigger('click')
        }
    })
}


export default function () {

    if (window.location.href.match(/https:\/\/sellercenter.daraz.lk\/product\/newpublish.*/g)) {


        /* run when dom is ready */
        $(() => {

            // css
            let style = $('<style>')
            style.text(css)
            $('head').append(style)

            // tab navigation
            run_when_active([
                '.dada-main-page .label-top',
                '.ui-text-info',
                '.dada-text-weakness',
            ])
                .then(() => {
                    tab_navigation()
                })

        })
    }
}
