(function () {

    const XHR = XMLHttpRequest.prototype

    const open = XHR.open
    const send = XHR.send
    const setRequestHeader = XHR.setRequestHeader

    XHR.open = function (method, url) {
        // this._method = method
        this._url = url
        this._requestHeaders = {}
        // this._startTime = (new Date()).toISOString()

        return open.apply(this, arguments)
    }

    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value
        return setRequestHeader.apply(this, arguments)
    }

    XHR.send = function (postData) {

        this.addEventListener('load', function () {
            // const endTime = (new Date()).toISOString()

            const myUrl = this._url ? this._url.toLowerCase() : this._url
            if (myUrl) {

                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                            this._requestHeaders = postData
                        } catch (err) {
                            // console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            // console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                        // do something if you need
                    }
                }

                // here you get the RESPONSE HEADERS
                // const responseHeaders = this.getAllResponseHeaders()
                try {
                    this.responseText
                } catch (e) {
                    return
                }
                if (this.responseType !== 'blob' && this.responseText) {
                    // responseText is string or null
                    try {

                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                        const arr = this.responseText

                        // printing url, request headers, response headers, response body, to console
                        if (this._url.includes('order/data?') && !arr.includes('</div>') && !arr.includes('<script>')) {
                            // console.log(this._url)
                            // console.log(arr)
                            let dataDOMElement = document.getElementById('__interceptedData')
                            if (!dataDOMElement) {
                                dataDOMElement = document.createElement('div')
                                dataDOMElement.id = '__interceptedData'
                                dataDOMElement.style.height = 0
                                dataDOMElement.style.overflow = 'hidden'
                                document.body.appendChild(dataDOMElement)
                            }
                            dataDOMElement.innerText = arr
                            dataDOMElement.classList.add('newdata')
                            dataDOMElement.classList.add('sample')
                        }

                        // console.log(JSON.parse(this._requestHeaders));
                        // console.log(responseHeaders);

                    } catch (err) {
                        // console.log("Error in responseType try catch");
                        // console.log(err);
                    }
                }

            }
        })

        return send.apply(this, arguments)
    }

})(XMLHttpRequest)

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // call on next available tick
        setTimeout(fn, 1)
    } else {
        document.addEventListener('DOMContentLoaded', fn)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

let on = 0
docReady(async () => {
    if (on === 0) {
        on = 1
        let yj = 0
        while (!(typeof olympicsModel !== 'undefined') && yj < 100) {
            yj++
            await sleep(300)
        }

        let dataDOMElement = document.getElementById('__interceptedData')
        if (!dataDOMElement) {
            dataDOMElement = document.createElement('div')
            dataDOMElement.id = '__interceptedData'
            dataDOMElement.style.height = 0
            dataDOMElement.style.overflow = 'hidden'
            document.body.appendChild(dataDOMElement)
        }
        if (typeof olympicsModel !== 'undefined') {
            dataDOMElement.innerText = JSON.stringify(olympicsModel)
            dataDOMElement.classList.add('newdata')
            dataDOMElement.classList.add('sample')
        }
    }
})
