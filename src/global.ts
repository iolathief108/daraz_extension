
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function run_when_active(selectors: Array<string>) {
    let pass = false
    let try_count = 0
    let time_out_seconds = 60
    while (!pass)
        if (selectors.every(v => $(v).length > 0))
            return new Promise((resolve => resolve()))
        else if (try_count * 0.170 > time_out_seconds)
            pass = true
        else {
            try_count++
            await sleep(170)
        }
}




// Background to Content
export interface ch_img_type {
    url: string
}



